//获取应用实例，请求数据的方法
import { http } from '../../../utils/util';
const app = getApp();
const storage = require("../../../utils/storage.js");
const constant = require("../../../utils/constant.js");
const convert = require("../../../utils/convert.js");
const {findProductVariantByParams} = require("../../../utils/date.js");
const commonFun = require('../../../utils/common.js');

Page({
    data: {
        movies:[
            {url:'http://img04.tooopen.com/images/20130712/tooopen_17270713.jpg'} ,
            {url:'http://img04.tooopen.com/images/20130617/tooopen_21241404.jpg'} ,
            {url:'http://img04.tooopen.com/images/20130701/tooopen_20083555.jpg'} ,
            {url:'http://img02.tooopen.com/images/20141231/sy_78327074576.jpg'}
        ],
        images:[],
        items: [{
            name: "白色",
            id:'0'
        },{
            name: "黑色",
            id:'1'
        },{
            name: "蓝色",
            id:'2'
        },{
            name: "蓝色",
            id:'3'
        },{
            name: "蓝色",
            id:'4'
        },{
            name: "蓝色",
            id:'5'
        }],
        curNav: 0,
        curIndex: 0,
        toView: 'red',
        scrollTop: 100,
        num: 1,
        minusStatus: 'disabled',
        stallName:'',
        businessScopeName:'',
        sellProductNum:0,
        product:'',
        colors:[],
        sizes:[],
        variants:[],
        stall:'',
        userId:'',
        totalFee: 0,                       // 总价，初始为0
        totalNum: 0                          // 选择商品总数
    },

    onLoad:function(options){
      this.getUserInfo();//获取用户信息
      //请求档口数据
      http({
        url: "cws/stall/getStall.do",
        method: "GET",
        data: { "stallId": options.stallId },
        func: (data) => {
          var obj = data.result.stall;
          if (obj != undefined) {
            this.setData({
              stall: obj,
              stallName: obj.name,
              businessScopeName: obj.businessScopeName,
              sellProductNum: obj.sellProductNum
            });
          }
        }
      });
      //获取商品信息
      let paramInfo = {};
      if(this.data.userId!=undefined&&this.data.userId!=""){
        paramInfo = { productId: options.productId, createUserId: this.data.userId };
      }else{
        paramInfo = { productId: options.productId};
      }
      http({
        url:'stock/api/loadProductInfo.do',
        method:'GET',
        data: paramInfo,
        func:(data)=>{
          this.setData({
            product:data.result
          });
          if(this.data.product!=undefined){
            let imgs = [];
            if (this.data.product.imgUrl_main != undefined && this.data.product.imgUrl_main !=""){
              imgs.push({ url: this.data.product.imgUrl_main });
            }
            if (this.data.product.imgUrl_1 != undefined && this.data.product.imgUrl_1!=""){
              imgs.push({ url: this.data.product.imgUrl_1});
            }
            if (this.data.product.imgUrl_2 != undefined && this.data.product.imgUrl_2!=""){
              imgs.push({ url: this.data.product.imgUrl_2 });
            }
            if (this.data.product.imgUrl_3 != undefined && this.data.product.imgUrl_3!="") {
              imgs.push({ url: this.data.product.imgUrl_3});
            }
            
            this.setData({
              images:imgs,
              sizes:[],
              colors:this.data.product.colours.split("_"),
              variants: this.data.product.productVariant
            });
           
            if(this.data.colors!=undefined&&this.data.colors.length!=0&&this.data.variants!=undefined&&this.data.variants.length!=0){
              
              let table = this.data.variants,
                  vo = [];
              for(let j = 0;j<table.length;j++){ 
                if(table[j].colour==this.data.colors[0]){
                  let parameters = {name:table[j].size,id:table[j].id,num:0};
                  vo.push(parameters);
                }
              }
              this.setData({
                sizes:vo
              });
            }
          }
        }
      });

    },

    switchRightTab: function(e) {
        let color = e.currentTarget.dataset.id,
          index = parseInt(e.currentTarget.dataset.index);
        this.setData({
            curIndex: index
        })
        let table = this.data.variants,
            vo = [];
        for(let i=0;i<table.length;i++){
          if(table[i].colour==color){
            let param = {name:table[i].size,id:table[i].id,color:table[i].color,num:0};
            vo.push(param);
          }
        }
        this.setData({
          sizes:vo
        });
    },
    goDetails: function() {
        wx.navigateTo({
            url: '../stallStoreDetails/stallStoreDetails'
        })
    },
    upper: function(e) {
        console.log(e)
    },
    lower: function(e) {
        console.log(e)
    },
    scroll: function(e) {
        console.log(e)
    },
    tap: function(e) {
        for (var i = 0; i < order.length; ++i) {
            if (order[i] === this.data.toView) {
                this.setData({
                    toView: order[i + 1]
                })
                break
            }
        }
    },
    tapMove: function(e) {
        this.setData({
            scrollTop: this.data.scrollTop + 10
        })
    },
    /** */
    /* 点击减号 */  
    bindMinus: function (e) {
      let id = e.currentTarget.dataset.id,
        index = parseInt(e.currentTarget.dataset.index);
      var num = this.data.sizes[index].num;
      if(num>0){
        num--;
      }
      // 只有大于一件的时候，才能normal状态，否则disable状态  
      var minusStatus = num <= 0 ? 'disabled' : 'normal';
      // 将数值与状态写回  
      let table = this.data.sizes;
      let  vo = table;
      for (let i = 0; i < table.length; i++) {
        if (i != index) {
          let param = { name: table[i].name, id: table[i].id, color: table[i].colour, num: table[i].num };
          vo.splice(i,1,param);
        } else {
          let parameter = { name: table[i].name, id: table[i].id, color: table[i].colour, num: num };
          vo.splice(i, 1, parameter);
        }
        this.setData({
          sizes: vo,
          minusStatus: minusStatus
        });
      }
      this.getTotalFee();
    },
    
    /* 点击加号 */
    bindPlus: function (e) {
      let id = e.currentTarget.dataset.id,
          index = parseInt(e.currentTarget.dataset.index);
      var num  = this.data.sizes[index].num + 1;
      let table = this.data.sizes;
      let vo = table;
     for(let i = 0;i<table.length;i++){
       if(i!=index){
          let param = {name:table[i].name,id:table[i].id,color:table[i].colour,num:table[i].num};
        vo.splice(i,1,param);
       }else{
         let parameter = { name: table[i].name, id: table[i].id, color: table[i].colour, num: num };
         vo.splice(i, 1, parameter);
       }
       var minusStatus = num <= 0 ? 'disabled' : 'normal';
       this.setData({
         sizes:vo,
         minusStatus: minusStatus
       });
     }
     this.getTotalFee();
    },

    /* 输入框事件 */
    bindManual: function (e) {
      var num = e.detail.value;
      this.setData({
        num: num
      });
    } ,

   /**
    * 收藏商品
    */
    collectProduct:function(e){
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
      if(this.data.product.collectStatus!=undefined){
        if(this.data.product.collectStatus==1){
          let voc = this.data.product;
          voc.collectStatus = 2;
          this.setData({
            product:voc
          })
          this.cancelCollectData({stallId:this.data.stall.id,productId:this.data.product.id});
        }else{
          let vos = this.data.product;
          vos.collectStatus = 1;
          this.setData({
            product:vos
          })
          this.storeCollectData({ stallId: this.data.stall.id, productId: this.data.product.id});
        }
      }else{
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
        data: { createUserId: this.data.userId, stallId: param.stallId, productId: param.productId, status: 2 },
        func: (data) => {
          
        }
      });
    },

    /**
     * 取消收藏
     */
    cancelCollectData: function (param) {
      http({
        url: 'cws/api/cancelCollect.do',
        data: { createUserId: this.data.userId, stallId: param.stallId, productId:param.productId,status: 1 },
        func: (data) => {
          
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
    showContactFun: function (e) {
      let stall = e.currentTarget.dataset.id;
      let types = e.currentTarget.dataset.types;
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
        let showContact = { isShow: isShow, title: title, contactNub: contactNub };
        this.setData({ showContact: showContact });
      }
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
    let sizes = this.data.sizes;
    let idIn = "";
    let numMap = new Array();
    //公司id
    let companyId = e.currentTarget.dataset.companyId;
    let companys = wx.getStorageSync('cart');
    if(companys == "") {
      companys = new Array();
    }
    for (let i in sizes) {
        let product = sizes[i];
        if(product.num == 0) {   //商品数量为0不添加
          continue;
        }
        //变体id
        let productId = product.id;
        let hasProudct = false;
        for (let i in companys) {
          let company = companys[i];
          if (company.id == companyId) {
            for (let j in company.products) {
              let productv = company.products[j];
              if (productv.id == productId) {
                hasProudct = true;
                productv.orderNum += product.num;
                break;
              }
            }
          }
        }
        if (!hasProudct) {
          idIn += "," + product.id
          numMap[product.id] = product;
        }
      }
      if (idIn!= "") {  //没有该类型商品就添加到本地库缓存
        idIn = idIn.substring(1, idIn.length);
        http({
          url: findProductVariantByParams,
          data: {
            idIn: idIn
          },
          func: (data) => {
            for(let k in data.result) {
              let product = data.result[k];
              product.orderNum = numMap[product.id].num;
              product.isSelected = true;    //购物车商品默认选中
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
                  allName: product.marketName + product.floorNum + "楼" + product.companyName,
                  marketName: product.marketName,
                  floorNum: product.floorNum,
                  products: new Array()
                }
                companys.push(company);
              }
              company.products.push(product);
            }
            //死亡金字塔
            wx.setStorageSync('cart', companys);
            wx.showToast({
              title: '添加成功'
            });
          }
        });
      } else {
        wx.setStorageSync('cart', companys);
        wx.showToast({
          title: '添加成功'
        });
      }
  },
  /**
   * 计算总额
   */
  getTotalFee() {
    let sizes = this.data.sizes;
    let selected = convert.arrayToMap(sizes);
    let totalFee = 0;                       // 总价，初始为0
    let totalNum = 0;                          // 选择商品总数
    for(let i in sizes) {
      totalFee += sizes[i].num * parseFloat(this.data.product.sellPrice);    //追加商品价格
      totalNum += sizes[i].num;
    }
    this.setData({
      totalFee: totalFee,
      totalNum: totalNum
    });

  },

  /**
   * 跳转至下单页面
   */
  goSubmitOrder() {
    wx.navigateTo({
      //将该商品的id传到详情页
      url: "../../index/submitOrders/submitOrders"
    });
  },
})