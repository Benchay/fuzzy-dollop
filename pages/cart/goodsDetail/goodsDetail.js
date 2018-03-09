// pages/goods_detail/goods_detail.js
const {
  http
} = require('../../../utils/util.js');
const {
  getProductVariantByParams
} = require('../../../utils/date.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper_attrs: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      indicator_color: "#848689",
      indicator_active_color: "#f23030"
    },
    goods_detail: [],
    cart_num: 0,
    has_cart: false,
    total_num: 0,
    goods_id: "",
    default_num: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    http({
      url: "GetGoodsDetail",
      data: options.product_id,
      func: (data) => {
        this.setData({
          goods_detail: data.goods_detail,
          goods_id: options.product_id
        });
      }
    });
    //初始化购物车相关数据
    let companys = wx.getStorageSync('cart');
    if(!companys) {
      companys = new Array();
      wx.setStorageSync('cart', companys);
    }
    let cart_num = 0;
    for (let i in companys) {
      let company = companys[i];
      for (let j in company.products) {
        cart_num += parseInt(company.products[j].orderNum);
      }
      
    }
    this.setData({
      has_cart: cart_num > 0 ? true : false,
      cart_num: cart_num
    });
  },

  minusCount: function (e) {
    let goods_detail = this.data.goods_detail;
    let num = parseInt(goods_detail.count);
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    goods_detail.count = num;
    this.setData({
      goods_detail: goods_detail
    });
  },
  addCount: function (e) {
    let goods_detail = this.data.goods_detail;
    let num = parseInt(goods_detail.count);
    num = num + 1;
    goods_detail.count = num;
    this.setData({
      goods_detail: goods_detail
    });
  },
  getInputVal: function (e) {
    let goods_detail = this.data.goods_detail;
    let num = parseInt(e.detail.value);
    if (num == 0) {
      goods_detail.count = 1;
    } else {
      goods_detail.count = num;
    }
    this.setData({
      goods_detail: goods_detail
    });
  },
  addToCart: function (e) {
    //变体id
    let productId = e.currentTarget.dataset.productId;
    //公司id
    let companyId = e.currentTarget.dataset.companyId;

    let companys = wx.getStorageSync('cart');

    let hasProudct = false;
    for(let i in companys) {
      let company = companys[i];
      if(company.id == companyId) {
        for (let j in company.products) {
          let product = company.products[j];
          if(product.id == productId) {
            hasProudct = true;
            product.orderNum++;
            break;
          }
        }
      }
    }
    if (!hasProudct) {  //没有该类型商品就添加到本地库缓存
      http({
        url: getProductVariantByParams,
        data:{
          id:productId
          },
        func: (data) => {
         let product = data.result;
         product.orderNum = 1;
         let company;
         let hasCompany = false;
          //如果有档口信息，就放入该档口订单缓存中
         for(let i in companys) {
           if (companys[i].id == companyId) {
             hasCompany = true;
             company = companys[i];
             break;
           }
         }
          //如果没有档口信息，就新建档口信息，并放入订单缓存
         if(!hasCompany){
           company = {
             id: product.companyId,
             name: product.companyName,
             allName: product.marketName + product.floorNum + "楼" + product.companyName,
             marketName: product.marketName,
             floorNum: product.floorNum,
             products: new Array()
           }
           companys.push(company);
         }
         company.products.push(product);
          //死亡金字塔
         this.setData({
           cart_num: ++this.data.cart_num
         });
         wx.setStorageSync('cart', companys);
        }
      });
    } else {
      this.setData({
        cart_num: ++this.data.cart_num
      });
      wx.setStorageSync('cart', companys);
    }
    wx.showToast({
      title: '添加成功'
    });

  },
  toCartPage: function (e) {
    console.log(e);
    wx.switchTab({
      url: '../cart',
    });
  }
});