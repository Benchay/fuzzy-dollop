const app = getApp();
const {http} = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cellHeight: '40px',
    pageItems: [],
    //classItems:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var pageItems = [];
    var row = [];
    http({
      url: "cws/stall/getCoreBusiness.do",
      method:"GET",
      //data: options.product_id,
      func: (data) => {
        if (data.isSuccess){
          var classItemsT = data.result;
          var len = classItemsT.length;//重组PageItems 
          var tempDate = [];
          for (var i = 0; i < len; i++) {
            var newobj = { "typeName": '', "index": 0, "route": '' };
            newobj.typeName = classItemsT[i].typeName;
            newobj.index = classItemsT[i].index;
            newobj.route = '../index?businessScope=' + classItemsT[i].index;
            tempDate.push(newobj);
          }
          this.setData({ classItems: tempDate});
          
          len = Math.floor((len + 2) / 3) * 3;
          for (var i = 0; i < len; i++) {
            var item = tempDate[i];
            //console.log(obj);
            if ((i + 1) % 3 == 0) {
              row.push(item);
              pageItems.push(row);
              row = [];
              continue;
            }
            else {
              row.push(item);
            }
          }
          //
          that.setData({
            pageItems: pageItems
          })
        }
    
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
  goRoute:function(e){
    let url = e.currentTarget.dataset.id;
    wx.switchTab({
      url: url,
      success:function(){
      },
      fail:function(obj){
        console.log(obj);
      }
    })
  },
})