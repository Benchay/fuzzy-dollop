const {http} = require('../../../utils/util.js');
const {formatDate} = require('../../../utils/convert.js');
const {createQrCodeImg} = require('../../../utils/wxqrcode.js');
const {getOrderById, getStall, getPackageByParams} = require('../../../utils/date.js');
const commonFun = require('../../../utils/common.js');
const {payoff, submitOrderAndSignBack, requestPayment} = require('../../../utils/pay.js');
const constant = require("../../../utils/constant.js");
const convert = require("../../../utils/convert.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 初始化当前订单详情
        order: {},
        qrcode:"",   //提货二维码
        stall:{},    //档口信息
        isLocked: false     //是否正在执行操作
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        order:{
          id:options.id
          }
      });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      this.getOrder();  //加载订单详情
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 加载订单详情信息
     */
    getOrder(){
      let startDate = new Date();
      console.log("开始执行时间" + startDate);
      let that = this;
      let id = this.data.order.id;
      http({
        url: getOrderById,
        data: {
          id: id
        },
        func: data => {
          console.log("请求结束时间" + (startDate - new Date()));
          let order = data.result;
          order.orderTime = formatDate(order.orderTime);  //格式化时间
          order.payTime = formatDate(order.payTime);
          order.takeTime = formatDate(order.takeTime);
          order.totalFee = order.totalFee.toFixed(2);    //格式化所有金额
          let dvo = order.detailsVO;
          for (let i in dvo) {
            dvo[i].price = dvo[i].price.toFixed(2);
          }
          that.setData({
            order: data.result
          });
          console.log("结束时间2" + (startDate - new Date()));
          //死亡金字塔
          that.getStall();
        }
      });
    },

    /**
     * 获取档口信息
     */
    getStall() {
      let that = this;
      http({
        url: getStall,
        method: "GET",
        data: {
          "stallId": this.data.order.stallId
        },
        func: (data) => {
          let stall = data.result.stall;
          that.setData({
            stall: stall
          });
        //死亡金字塔
        that.getPackage();
        }
      });
    },

    /**
     * 查询包裹信息
     */
    getPackage(){
      let that = this;
      let order = this.data.order;
      http({
        url: getPackageByParams,
        data: {
          "companyId": order.busiCompId,
          "orderCode": order.orderCode,
          "createUserId": order.createUserId
        },
        func: (data) => {
          let pack = data.result;
          //生成二维码
          let qrcode = createQrCodeImg('hmj_p_info' + pack.id, { 'size': 150 });
          that.setData({
            qrcode: qrcode
          });
        }
      });
    },

    /**
      * 去支付
      */
    goPay() {
      let order = this.data.order;

      //设置提交按钮失效
      this.setData({
        isLocked: true
      });
      
      //弹出支付界面
      this.orderids = new Array();
      this.orderids.push(order.id)//订单ids
      this.orderTotalFee = order.totalFee// 传入订单金额
      this.succCall = this.paySucc;
      this.failCall = this.payFail;
      this.payoff(this);
     
    },
    //支付成功
    paySucc() {
      //刷新
      this.onShow();
      this.setData({
        isLocked: false
      });
    },

    //支付失败
    payFail({ errorMsg }) {
      let that = this;
      wx.showToast({
        title: errorMsg,
        icon: 'none',
        complete: () => {
          //跳转到订单列表页
          setTimeout(function () {
            that.onShow();
            that.setData({
              isLocked: false
            });
          }, 1500);
        }
      });
    },

   /**
    * 添加微信好友
    */
   showContactFun: function (e) {
     let types = e.currentTarget.dataset.type;
     let stall = this.data.stall;
     if (stall) {
       let contactNub = '';
       let title = '联系电话';
       if (types == 'phone') {
         title = '联系电话';
         contactNub = stall.linkTel;
       } else if (types == 'qq') {
         title = '联系QQ';
         contactNub = stall.qq;
       } else if (types == 'wx') {
         title = '联系微信';
         contactNub = stall.weixin;
       }
       let isShow = true;
       if (contactNub == null || contactNub == '') {
         isShow = false;
         commonFun.showToast({ title: '档口还没有设置联系方式 !' });
         return;
       }
       if (types == 'phone') {
         this.phonecallevent(contactNub);
       } else {
         let showContact = { isShow: isShow, title: title, contactNub: contactNub };
         this.setData({ showContact: showContact });
       }
     }
   },

   phonecallevent: function (mobile) {
     wx.makePhoneCall({
       phoneNumber: mobile
     })
   },

   clickCommponent: function (e) {
     let showContact = { isShow: false, title: '', contactNub: '' };
     this.setData({ showContact: showContact });
   },

   confirmCopy: function (e) {
     let seleData = e.currentTarget.dataset.id;
     var ontactNub = '';
     if (seleData && seleData.contactNub) {
       ontactNub = seleData.contactNub;
     }
     wx.setClipboardData({
       data: ontactNub,
       success: function (res) {
       }
     });
     let showContact = { isShow: false, title: '', contactNub: '' };
     this.setData({ showContact: showContact });
   },
   
   cancelCopy: function (e) {
     let showContact = { isShow: false, title: '', contactNub: '' };
     this.setData({ showContact: showContact });
   },


   /**
    * 跳转至档口主页
    */
    goStallStore(e) {
      let stallId = e.currentTarget.dataset.stallId;
      let companyId = e.currentTarget.dataset.companyId;
      wx.navigateTo({
        url: `../../index/stallStore/stallStore?stallId=${stallId}&companyId=${companyId}`
      })
    },

    /**
     * 点击某一商品链接到该商品的详情页
     */
    goGoodsDetail (e) {
      // 获取当前订单的ID作为值传入url中
      let productId = e.currentTarget.dataset.id;
      let a = this.data.stall.id;
      wx.navigateTo({
        url: '../../index/stallStoreDetails/stallStoreDetails?stallId=' + this.data.stall.id + '&' + 'productId=' + productId
      });
    },

    /**
     * tap申请取消订单
     */
    cancelOrderDlg: function () {
      const that = this;
      // 获取data中的cur_order_detail
      const cur_order_detail = this.data.cur_order_detail;
      // 将order_status状态设为1，即订单取消的状态
      cur_order_detail.order_status = "1";
      wx.showModal({
        title: `是否申请取消订单？`,
        confirmText: "确定",
        confirmColor: "#E45050",
        success: function (res) {
          // 点确定将页面设为订单取消的状态
          if (res.confirm) {
            that.setData({
              cur_order_detail: cur_order_detail
            });
          }
        }
      });
    },
    payoff, submitOrderAndSignBack, requestPayment
})