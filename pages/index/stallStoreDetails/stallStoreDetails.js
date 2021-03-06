//获取应用实例，请求数据的方法
import { http } from '../../../utils/util';
const app = getApp();
const storage = require("../../../utils/storage.js");
const constant = require("../../../utils/constant.js");
const convert = require("../../../utils/convert.js");
const { findProductVariantByParams } = require("../../../utils/date.js");
const commonFun = require('../../../utils/common.js');

Page({
  data: {
    movies: [
      { url: 'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg' },
      { url: 'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg' },
      { url: 'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg' },
      { url: 'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg' }
    ],
    images: [],
    curNav: 0,
    curIndex: 0,
    toView: 'red',
    scrollTop: 100,
    num: 1,
    minusStatus: 'disabled',
    product: '',
    sizes: [], //[颜色][变体]
    variants: [],
    stall: {},
    userId: '',
    totalFee: 0,                       // 总价，初始为0
    totalNum: 0                          // 选择商品总数
  },

  onLoad: function (options) {
    this.getUserInfo();//获取用户信息
    //请求档口数据
    http({
      url: "cws/stall/getStall.do",
      method: "GET",
      data: { createUserId: this.data.userId, stallId: options.stallId },
      func: (data) => {
        var obj = data.result.stall;
        if (obj != undefined) {
          this.setData({
            stall: obj,
          });
        }
      }
    });
    //获取商品信息
    let paramInfo = {};
    if (this.data.userId != undefined && this.data.userId != "") {
      paramInfo = { productId: options.productId, createUserId: this.data.userId, applicationType: '2' };
    } else {
      paramInfo = { productId: options.productId, applicationType: '2' };
    }
    http({
      url: 'stock/api/loadProductInfo.do',
      method: 'GET',
      data: paramInfo,
      func: (data) => {
        this.setData({
          product: data.result
        });
        if (this.data.product != undefined) {
          let imgs = [];
          if (this.data.product.imgUrl_main != undefined && this.data.product.imgUrl_main != "") {
            imgs.push({ url: this.data.product.imgUrl_main });
          }
          if (this.data.product.imgUrl_1 != undefined && this.data.product.imgUrl_1 != "") {
            imgs.push({ url: this.data.product.imgUrl_1 });
          }
          if (this.data.product.imgUrl_2 != undefined && this.data.product.imgUrl_2 != "") {
            imgs.push({ url: this.data.product.imgUrl_2 });
          }
          if (this.data.product.imgUrl_3 != undefined && this.data.product.imgUrl_3 != "") {
            imgs.push({ url: this.data.product.imgUrl_3 });
          }
          if (imgs.length == 0) {
            imgs.push({ url: '../../../images/index/default_product_big.png' });
          }
          this.setData({
            images: imgs,
            sizes: [],   //[颜色][变体]
            variants: this.data.product.productVariant
          });

          //加载变体信息
          let table = this.data.variants;
          let sizes = this.data.sizes;
          for (let j = 0; j < table.length; j++) {
            let colour = table[j].colour;
            if (!sizes[colour]) {
              sizes[colour] = new Array();
            }
            let vo = sizes[colour];
            vo.push({       //加载变体信息
              id: table[j].id,
              size: table[j].size,
              colour: table[j].colour,
              num: 0,
            });
          }
          let sizesN = new Array();
          for (let i in sizes) {
            sizesN.push({
              colour: i,     //颜色
              variants: sizes[i]    //变体集合
            });
          }
          this.setData({
            sizes: sizesN
          });
        }

      }
    });

  },
  /**
   * 切换颜色
   */
  switchRightTab: function (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      curIndex: index
    })
  },
  goDetails: function () {
    wx.navigateTo({
      url: '../stallStoreDetails/stallStoreDetails'
    })
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  scroll: function (e) {
    console.log(e)
  },
  tap: function (e) {
    for (var i = 0; i < order.length; ++i) {
      if (order[i] === this.data.toView) {
        this.setData({
          toView: order[i + 1]
        })
        break
      }
    }
  },
  tapMove: function (e) {
    this.setData({
      scrollTop: this.data.scrollTop + 10
    })
  },

  /* 点击减号 */
  bindMinus: function (e) {
    let index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let sizes = this.data.sizes;
    let variant = sizes[this.data.curIndex]["variants"][index];
    if (variant.num > 0) {
      variant.num--;
      this.setData({
        sizes: sizes
      });
      this.getTotalFee();
    }
  },

  /* 点击加号 */
  bindPlus: function (e) {
    let index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let sizes = this.data.sizes;
    let variant = sizes[this.data.curIndex]["variants"][index];
    variant.num++;
    this.setData({
      sizes: sizes
    });
    this.getTotalFee();
  },

  /* 输入框事件 */
  bindManual: function (e) {
    let v = e.detail.value;
    let index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let sizes = this.data.sizes;
    let variant = sizes[this.data.curIndex]["variants"][index];
    v = parseInt(v);
    if (!v || v <= 0) {
      v = 0;
    }
    variant.num = v;
    this.setData({
      sizes: sizes
    });
    this.getTotalFee();
  },

  /**
   * 收藏商品
   */
  collectProduct: function (e) {
    if (app.globalData.nabeiInfo == null || app.globalData.nabeiInfo.user == null) {
      var obj = { "url": '../../index/index', "type": 2, "from": '' };
      app.globalData.goUrl = obj;
      wx.navigateTo({
        url: '../../userInfo/bind/bind?stallId=' + this.data.stall.id
      });
      return;
    }
    let userid = app.globalData.nabeiInfo.user.id;
    this.setData({
      userId: userid
    });
    if (this.data.product.collectStatus != undefined) {
      if (this.data.product.collectStatus == 1) {
        let voc = this.data.product;
        voc.collectStatus = 2;
        this.setData({
          product: voc
        })
        this.cancelCollectData({ stallId: this.data.stall.id, productId: this.data.product.id });
      } else {
        let vos = this.data.product;
        vos.collectStatus = 1;
        this.setData({
          product: vos
        })
        this.storeCollectData({ stallId: this.data.stall.id, productId: this.data.product.id });
      }
    } else {
      let vo = this.data.product;
      vo.collectStatus = 1;
      this.setData({
        product: vos
      })
      this.storeCollectData({ stallId: this.data.stall.id, productId: this.data.product.id });
    }
  },

  /**
     * 添加收藏数据
     */
  storeCollectData: function (param) {
    http({
      url: 'cws/api/addCollect.do',
      data: { createUserId: this.data.userId, productId: param.productId, status: 1 },
      func: (data) => {
        if (data.isSuccess) {
          wx.showToast({
            title: '收藏成功',
            duration: 1000
          })
        }
      }
    });
  },

  /**
   * 取消收藏
   */
  cancelCollectData: function (param) {
    http({
      url: 'cws/api/cancelCollect.do',
      data: { createUserId: this.data.userId, productId: param.productId, status: 1 },
      func: (data) => {
        if (data.isSuccess) {
          wx.showToast({
            title: '取消成功',
            duration: 1000
          })
        }
      }
    });
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
    cancelCopy:function (e) {
        let showContact = { isShow: false, title: '', contactNub: '' };
        this.setData({ showContact: showContact });
    },
  showContactFun: function (e) {
    let stall = this.data.stall;
    let types = e.currentTarget.dataset.type;
    if (stall) {
      var contactNub = '';
      var title = '联系电话';
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
      var isShow = true;
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

  getUserInfo: function () {
    if (app.globalData.nabeiInfo == null) {
      var data = storage.getStoreSync(constant.NABEI_AUTH_TOKEN);
      if (data) {
        app.globalData.nabeiInfo = convert.stringToJson(data);
        if (app.globalData.nabeiInfo && app.globalData.nabeiInfo.user) {
          this.setData({ userId: app.globalData.nabeiInfo.user.id });
        }
      }
    }
  },

  /**
   * 加入购物车
   */
  addToCart: function (e) {
    let that = this;
    let sizes = this.data.sizes;
    let idIn = "";
    let numMap = new Array();
    //公司id
    let companyId = e.currentTarget.dataset.companyId;
    let companys = wx.getStorageSync('cart');
    if (companys == "") {
      companys = new Array();
    }
    for (let i in sizes) {
      let variants = sizes[i].variants;
      for (let j in variants) {
        let variant = variants[j];
        if (variant.num == 0) {   //商品数量为0不添加
          continue;
        }
        //变体id
        let productId = variant.id;
        let hasProudct = false;
        for (let k in companys) {
          let company = companys[k];
          if (company.id == companyId) {
            for (let z in company.products) {
              let productv = company.products[z];
              if (productv.id == productId) {
                hasProudct = true;
                productv.orderNum += variant.num;
                break;
              }
            }
          }
        }
        if (!hasProudct) {
          idIn += "," + variant.id
          numMap[variant.id] = variant;
        }
      }
    }

    if (idIn != "") {  //没有该类型商品就添加到本地库缓存
      idIn = idIn.substring(1, idIn.length);
      http({
        url: findProductVariantByParams,
        data: {
          idIn: idIn
        },
        func: (data) => {
          for (let k in data.result) {
            let product = data.result[k];
            product.orderNum = numMap[product.id].num;
            product.isSelected = true;    //购物车商品默认选中
            product.sellPrice = product.sellPrice.toFixed(2);
            let company;
            let hasCompany = false;
            //如果有档口信息，就放入该档口订单缓存中
            for (let i in companys) {
              if (companys[i].id == companyId) {
                hasCompany = true;
                company = companys[i];
                break;
              }
            }
            //如果没有档口信息，就新建档口信息，并放入订单缓存
            if (!hasCompany) {
              company = {
                id: product.companyId,
                name: product.companyName,
                allName: (product.marketName ? product.marketName : "") + product.serialNub,
                marketName: product.marketName,
                floorNum: product.floorNum,
                isSelected: true,
                products: new Array()
              }
              companys.splice(0, 0, company);//新商品排前
            }
            company.products.splice(0, 0, product);//新商品排前
          }
          wx.setStorageSync('cart', companys);
          wx.showToast({
            title: '添加成功'
          });

          //添加成功清空数量
          that.clearNum();
        }
      });
    } else {
      wx.setStorageSync('cart', companys);
      wx.showToast({
        title: '添加成功'
      });
      //添加成功清空数量
      this.clearNum();
    }
  },

  /**
   * 计算总额
   */
  getTotalFee() {
    let sizes = this.data.sizes;
    let totalFee = 0;                       // 总价，初始为0
    let totalNum = 0;                          // 选择商品总数
    for (let i in sizes) {
      let variants = sizes[i].variants;
      for (let j in variants) {
        totalFee += variants[j].num * parseFloat(this.data.product.sellPrice);    //追加商品价格
        totalNum += variants[j].num;
      }
    }
    this.setData({
      totalFee: totalFee.toFixed(2),
      totalNum: totalNum
    });
  },

  /**
   * 清空商品数量
   */
  clearNum(){
    let sizes = this.data.sizes;
    //添加成功清空数量
    for (let i in sizes) {
      let variants = sizes[i].variants;
      for (let j in variants) {
        variants[j].num = 0;
      }
    }
    this.setData({
      sizes: sizes,
      totalNum: 0,
      totalFee: 0
    });
  },

  /**
   * 跳转至下单页面
   */
  goSubmitOrder() {
    let products = new Array();    //商品集合
    let stall = this.data.stall;
    let prod = this.data.product;
    let sizes = this.data.sizes;
    for (let i in sizes) {
      let variants = sizes[i].variants;
      for (let j in variants) {
        let variant = variants[j];
        if (variant.num > 0) {   //获取数量不为0的商品信息
          let product = {};
          convert.copyProperty(product, prod);
          product.id = variant.id;    //变体id
          product.orderNum = variant.num;
          product.isSelected = true;
          product.productVariantId = variant.id;
          product.colour = variant.colour;
          product.size = variant.size;
          products.push(product);
        }
      }
    }
    let companys = new Array();
    companys.push({
      id: stall.id,
      allName: stall.marketName + stall.serialNub,
      name: stall.name,
      products: products
    });
    wx.setStorageSync("tempCart", companys);
    //跳转到订单提交页面
    wx.navigateTo({
      url: "../../index/submitOrders/submitOrders?cartType=1"
    });

    //清空商品数量
    clearNum();
  },
})