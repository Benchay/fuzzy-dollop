
import {http} from '../../utils/util';
import convertFun from '../../utils/convert'
Page({
    data: {
        items: [],
        floors: [],
        floorArraySelect:[],
        curNav: 0,
        curIndex: 0,
        stallList:[],
        collectStallList:[],
    },
    onLoad(){
      var that = this;
      http({
        url: 'cws/market/queryMarket.do',
        method: 'POST',
        data:{pageIndex:1,pageSize:100},
        func:function(data){
          const market = data.result.market;
          that.setData({ items: market.results});
          that.getMarketDetail(market.results[0].id);
        }
      })
    },
    goStall:function(e){
      let url=e.target.dataset.id;
      wx.redirectTo({
        url: url,
        fail:function(e){
          console.log(e);
        }
      })
    },
    switchRightTab: function(e) {
        //console.log(e);
        let id = e.target.dataset.id,index = parseInt(e.target.dataset.index);
        this.setData({
            curNav: id,
            curIndex: index
        })
        this.getMarketDetail(id);
    },
    getMarketDetail(marketId){
      const that = this;
      http({
        url: 'cws/market/queryMarketDetail.do?marketId='+marketId,
        method:'GET',
        func: function (data) {
          if (data.isSuccess){
            that.groupStalls(data.result);
          }
        },
      })
    },
    groupStalls(data){
      let market = data.market;
      if(market==null) return;
      let stallList = market.stallList;
      var tempDate = [];
      var foorArray=[];
      for (var i = 0; i < stallList.length; i++) {
        var stall = stallList[i];
        var newobj = { "id": '',"marketId":'', "floorNum": 0,"serialNub":'',"route": '' };
        newobj.id = stall.id;
        newobj.marketId = stall.marketId;
        newobj.floorNum = stall.floorNum;
        newobj.serialNub = stall.serialNub;
        newobj.route = '../index/stallStore/stallStore?stallId=' + stall.marketId;
        if (!convertFun.isInArray(foorArray, stall.floorNum)){
          foorArray.push(stall.floorNum);
        }
        tempDate.push(newobj);
      }
      var floorArray = [];
      for (var i = 0; i < foorArray.length;i++){
        var fnub = foorArray[i];
        var jt1 = new Object;
        jt1.floorNum=''+ fnub;
        jt1.children = [];
        for (var j = 0; j < tempDate.length;j++){
          var fnub2 = tempDate[j].floorNum;
          if (fnub2==fnub){
            jt1.children.push(tempDate[j]);
          }
        }
        floorArray.push(jt1);
      }
      console.log(floorArray);
      this.setData({ floorArraySelect: floorArray});
    },
    convertStall(){
      
    },
})