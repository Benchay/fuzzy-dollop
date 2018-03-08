// pages/index/search/search.js
//获取应用实例，请求数据的方法
const {
    http
} = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectPerson:true,
      firstPerson:'商品',
    cancel_icon: true,
    input_value: "",
      history:true,
      commodity:false,
      stalls:true,
      selectList: [{
        name: "商品",
    },{
        name: "档口",
    }],
      items: [{
          name: "综合",
          id:0
      },{
          name: "新品",
          id:1
      },{
          name: "人气",
          id:2
      },{
          name: "价格",
          id:3
      }],
      curNav: 0,
      curIndex: 0

  },

  /**
   * 生命周期函数--监听页面加载
   * @pram options--页面跳转带来的参数
   */
  onLoad: function (options) {
    //保存this对象
    const _this = this;
    //请求热搜数据
    http({
      url: "GetSearch",
      loading:true,
      func: (data) => {
        // 成功后加载页面
        _this.initPage(data);
      }
    })
  },

  /**
   * input输入内容时cancel按钮的显示隐藏
   * @pram e 当前点击对象的属性集合
   */
  inputShow(e) {
    //输入值时
    if (e.detail.value) {
      this.setData({
        active_search_val: e.detail.value,
        cancel_icon: false,
        input_value: e.detail.value,
          history:true,
          commodity:false,
          stalls:true,
      })
    } else {
      this.setData({
        cancel_icon: true,
        input_value: "",
          history:false,
          commodity:false,
          stalls:true,
      })
    }
  },

  /**
   * 点击清除隐藏历史搜索
   */
  clearHistorySearch() {
    this.setData({
      history_show: true
    });
    //发起清除历史记录的请求
    http({
      url: "SetClearHistory",
      data: this.data.history_search,
      func: (data) => {
        //成功后弹窗提示
        wx.showToast({
          title: "清除成功",
          icon: "success",             //icon的类型
          duration: 2000               //弹窗持续时长
        })
      }
    })
  },

  /**
   * 搜索按钮点击事件
   */
  searchGoods() {
    wx.navigateTo({
      //页面跳转时将搜索的字段传入
      url: `../search_result/search_result?title=${this.data.active_search_val}`
    })
  },

  /**
   * input输入内容时cancel按钮的显示隐藏
   * @pram e--当前点击对象的属性集合
   */
  clearInput(e) {
    this.setData({
      active_search: true,
      cancel_icon: true,
      input_value: "",
      search_show_status: false,         //隐藏页面历史搜索和热门搜索
      btncancel_status: false,           //显示取消按钮
      btnsearch_status: true,
        history:false
    })
  },

  /**
   * 点击取消返回上一级
   */
  getBack() {
    wx.navigateBack({
      delta: 1       //返回的页面层数
    })
  },

  /**
   * 初始化页面
   * @pram data--页面加载的数据
   */
  initPage: function (data) {
    this.setData({
      hot_search: data["hot_search"],          //赋值请求到的值给当前page下面的data.hot_search
      history_search: data["history_search"]   //赋值请求到的值给当前page下面的data.history_search
    });
  },

  /**
   * 换一批点击事件
   */
  changeHotItems: function () {
    //保存this对象
    const _this = this;
    //请求数据
    http({
      url: "GetChangeHotSearch",
      loading:true,
      func: (data) => {
        // 成功后加载页面
        _this.initPage(data);
      }
    })
  },

  /**
   * 点击热门搜索或历史搜索字段时自动填充到搜索框
   * @pram e--当前点击对象的属性集合
   */
  fillInputValue(e) {
    this.setData({
      active_search_val: e.target.dataset.cur_value,  //设置当前搜索字段值为选中的字段值
      input_value: e.target.dataset.cur_value,        //设置选中的字段值在输入框中
      cancel_icon: false                              //显示关闭按钮

    })
  },
    clickPerson:function(){
        var selectPerson = this.data.selectPerson;
        if(selectPerson == true){
            this.setData({
                selectPerson:false,
            })
        }else{
            this.setData({
                selectPerson:true,
            })
        }
    } ,
    //点击切换
    mySelect:function(e){
            let index = parseInt(e.target.dataset.index);
            console.log(index);
            if(index == 0){
                this.setData({
                    commodity:false,
                    stalls:true,
                })
            }else{
                this.setData({
                    commodity:true,
                    stalls:false,
                })
            }
        this.setData({
            firstPerson:e.target.dataset.me,
            selectPerson:true,
        })
    },
    onLoad:function(options){
        // 页面初始化 options为页面跳转所带来的参数
    },
    onReady:function(){
        // 页面渲染完成
    },
    onShow:function(){
        // 页面显示
    },
    onHide:function(){
        // 页面隐藏
    },
    onUnload:function(){
        // 页面关闭
    },
    switchRightTab: function(e) {
        console.log(e);
        let id = e.target.dataset.id,
            index = parseInt(e.target.dataset.index);
        this.setData({
            curNav: id,
            curIndex: index
        })
    },
    goDetails: function() {
        wx.navigateTo({
            url: '../stallStoreDetails/stallStoreDetails'
        })
    },
});