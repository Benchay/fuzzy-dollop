const app = getApp();
const {http} = require('../../../utils/util.js');
const {createOrderByWx} = require('../../../utils/date.js');
const { payoff, getOpenId, xiadan, sign, requestPayment} = require('../../../utils/pay.js');


Page({
    data: {
       companys:[],
       totalFee: 0
    },

    /**
     * 加载事件
     */
    onLoad: function (options) {
    },

    /**
     * 显示页面
    */
    onShow: function () {
      //加载档口商品信息
      this.getCompanysData();
    },

    /**
     * 加载选中的商品信息
     */
    getCompanysData(){
      //所有商品总价
      let totalFee = 0;
      //获取购物车中的商品信息
      let companys = wx.getStorageSync("cart");
      for(let i = 0; i < companys.length; i++) {
        let company = companys[i];
        let products = company.products; //档口商品集合
        let ctf = 0;      //档口所有商品总价
        let ctn = 0;      //档口所有商品总数
        //遍历商品移除非选中商品，并计算价格
        for(let j = 0; j < products.length; j++) {
          let product = products[j];
          if (product.isSelected) {
            ctf += product.orderNum * parseFloat(product.sellPrice);
            ctn += parseInt(product.orderNum);
          } else {    //移除购物车中非选中的商品
            products.splice(j, 1);
            j--;
          }
        }
        //档口下没有选中商品,就移除档口
        if(products.length == 0) {
          companys.splice(i, 1);
          i--;
          continue;
        }
        totalFee += ctf;
        company.totalFee = ctf.toFixed(2);
        company.totalNum = ctn;
      }
      this.setData({
        companys: companys,
        totalFee: totalFee
      });
    },

    /**
     * 提交订单
     */
    submitOrder(){
      let nabeiInfo = app.globalData.nabeiInfo;
      if (!nabeiInfo) {   //获取用户信息，
        wx.navigateTo({
          //跳转绑定页面
          url: '../../userInfo/bind/bind'
        })
        //测试数据
        // userInfo = {
        //   id:"8a8694b76071a5dc01607210f7200029",
        //   companyId:"8a8694b760771272016078053e8c011a"
        // }
      }

      //拼接订单提交数据
      let orders = new Array();
      let companys = this.data.companys;
      for (let i in companys) {
        let company = companys[i];
        let products = company.products;
        for (let j in products) {
          let product = products[j];
          let order = {
            productVariantId:product.id,
            price: product.sellPrice,     //价格传入后台验证
            orderNum: product.orderNum,
            companyId: nabeiInfo.compId,
            busiCompId: product.companyId,
            createUserId: nabeiInfo.user.id
          }
          orders.push(order);
        }
      }
      let that = this;
      //提交订单
      http({
        url: createOrderByWx,
        data: orders,
        func: (data) => {
          if(data.isSuccess) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            });
            //移除购物车中的商品
            wx.removeStorageSync("cart");
            //弹出支付界面
            that.orderids = []//订单ids
            that.orderTotalFee = 0.00// 传入订单金额
            that.payoff(that);
          }
        }
      });
    },
    payoff, getOpenId, xiadan, sign, requestPayment
})