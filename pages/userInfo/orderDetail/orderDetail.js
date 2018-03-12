const {http} = require('../../../utils/util.js');
const {formatDate} = require('../../../utils/convert.js');
const {createQrCodeImg} = require('../../../utils/wxqrcode.js');
const {getOrderById, getStall} = require('../../../utils/date.js');
const commonFun = require('../../../utils/common.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 初始化当前订单详情
        order: {},
        qrcode:"",   //提货二维码
        stall:{}    //档口信息
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
      let that = this;
      let id = this.data.order.id;
      http({
        url: getOrderById,
        data: {
          id: id
        },
        func: data => {
          let order = data.result;
          order.orderTime = formatDate(order.orderTime);  //格式化时间
          order.payTime = formatDate(order.payTime);
          order.takeTime = formatDate(order.takeTime);
          //生成二维码
          let qrcode = createQrCodeImg('http://www.qiusuoweb.com', { 'size': 150 });
          that.setData({
            order: data.result,
            qrcode: qrcode
          });
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
          }
        });
    },

    /**
     * 去支付
     */
   goPay(){
    
   },

   /**
    * 添加微信好友
    */
   showContactFun: function (e) {
     let types = e.currentTarget.dataset.types;
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
       let showContact = { isShow: isShow, title: title, contactNub: contactNub };
       this.setData({ showContact: showContact });
     }
   },

    /**
     * 点击某一商品链接到该商品的详情页
     */
    goGoodsDetail: (e) => {
      // 获取当前订单的ID作为值传入url中
      const goodsId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `../../cart/goodsDetail/goodsDetail?goods_id=${goodsId}`
      })
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
})