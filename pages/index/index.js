//获取应用实例，请求数据的方法
const app = getApp();
const {http} = require("../../utils/util.js");
const storage = require("../../utils/storage.js")
const constant = require("../../utils/constant.js");
const weatherUtil = require("../../utils/weather.js");
const amap = require('../../libs/amap-wx.js');

Page({
  data: {
    items: [{
      name: "综合排序",
        id:'0'
    },{
        name: "按销量",
        id:'1'
    },{
        name: "筛选",
        id:'2'
    }],
      curNav: 0,
      curIndex: 0,
      choseCollect:false,
      stalls:[],
      sortType:3,
  },
    //横向导航切换点击
    switchRightTab: function(e) {
        let id = e.target.dataset.id,
            index = parseInt(e.target.dataset.index);
        this.setData({
            curNav: id,
            curIndex: index,
        });
        if (this.data.curIndex==0){
          this.data.sortType = 3;//综合排序
        }else if(this.data.curIndex==1){
          this.data.sortType = 1;//按销量排序
        }
        if(this.data.curIndex==2){
            wx.navigateTo({
                url: 'classSelect/classSelect'
            });
        }else{
          this.loadForData();
        }
        
    },

    screenChange:function(){
    if(this.data.choseCollect == true){
        this.data.choseCollect = false
    }else{
        this.data.choseCollect = true
    }
    },

    toStore: function(e) {
      let id = e.currentTarget.dataset.id,
        index = parseInt(e.currentTarget.dataset.index);
    wx.navigateTo({
        url: 'stallStore/stallStore?stallId='+id
    });
},
  /**
   * 页面加载时
   */
  onLoad: function () {
    const _this = this;
    _this.getUserInfo();
    _this.loadForData();
  },
  onShow:function(){
    console.log('====================onShow===================================');
    this.getUserInfo();
  },

  //网络请求
  loadForData:function() {
    http({
      url: "cws/stall/queryStall.do",
      data: { stall: { status: 1 }, pageIndex: 1, pageSize: 10, sortType:this.data.sortType },
      func: (data) => {
        if (data.isSuccess){
          this.setData({
            stalls: data.result.stall.results
          });
        }
      }
    });
    this.weather();
  },
  weather:function(){
    var that = this;
    var myAmapFun = new amap.AMapWX({ key: 'f1069d18ec0068803bd898dde5a5a2a7' });
    myAmapFun.getWeather({
      success: function (data) {
        //成功回调
        console.log(data);
        that.setData({
          weatherData: {
            currentCity: data.liveData.city,
            temperature: data.liveData.temperature +'℃',
            weatherDesc: data.liveData.weather,
            weatherIcon: weatherUtil.getIconPath(data.liveData.weather)
          }
        });
      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    })
  },
  /**
   * 初始化页面
   * @pram data--页面加载的数据
   */
  initPage: function (data) {
    this.setData({
      //products_data: data
    });
  },

  /**
   */
  clickNum: function (e) {
    //设置当前点击的项为选中样式
    this.setData({
      num: e.target.dataset.num
    })
  },

  /**
   * 点击searchbar进入搜索页面
   */
  goSearchPage: function () {
    wx.navigateTo({
      url: "search/search"
    })
  },

/**
 * 点击扫码事件 
 */
  bindScan:function() {
    wx.scanCode({
      success(res){
        console.log(res.result);
        wx.navigateTo({
          url: "stallStore/stallStore"
        });
        //res.path
      }
    })
  },

  /**
   * 点击商品进入商品对应的详情页
   * @pram e--当前点击对象的属性集合
   */
  goDetail: (e) => {
    wx.navigateTo({
      //将该商品的id传到详情页
      url: `../cart/goodsDetail/goodsDetail?product_id=${e.currentTarget.dataset.id}`
    })
  },

  goCart:function(){
    wx.navigateTo({
      url: "../cart/cart"
    })
  },
  goClassSelect:function(){
    wx.navigateTo({
      url: "../index/classSelect/classSelect"
    })
  },

  /**
   * 下拉加载更多
   */
  onReachBottom: function () {
    //保存this对象
    const _this = this;
  },
  getUserInfo:function(){
    if (app.globalData.nabeiInfo == null) {
      storage.getStore(constant.NABEI_AUTH_TOKEN, {
        callback: (data) => {
          if (data.result==0){
            app.globalData.nabeiInfo=data.data;
          }
          console.log(app.globalData.nabeiInfo);
        }
      });
    }
  },
});
