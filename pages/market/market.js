const app = getApp();
import {http} from '../../utils/util';
import convertFun from '../../utils/convert'
Page({
    data: {
      items: [{ id: '-1', name: '收藏的档口'}],
        floors: [],
        floorArraySelect:[],
        curNav: 0,
        curIndex: 0,
        stallList:[],
        collectStallList:null,
        showNoCollect:false,
        currentPage:1,
        pageSize:100,
    },
    onLoad(){
      var that = this;
      http({
        url: 'cws/market/queryMarket.do',
        method: 'POST',
        data:{pageIndex:1,pageSize:100},
        func:function(data){
          if (data.isSuccess){
            const market = data.result.market.results;
            if(market!=null && market.length>0){
              var allArray = [{ id: '-1', name: '收藏的档口' }];
              for (var i = 0; i < market.length; i++) {
                allArray.push(market[i]);
              }
              that.setData({ items: allArray, showNoCollect:true});
              //that.getMarketDetail(market.results[0].id);
              that.getMyCollection();
            }
          }
        }
      })
    },
    getMyCollection:function(){
      var that = this;
      if (app.globalData.nabeiInfo == null || app.globalData.nabeiInfo.user==null){
        this.setData({ collectStallList:null});
        return;
      }
      let userid = app.globalData.nabeiInfo.user.id;
      http({
        url: "cws/api/queryCollect.do",
        data: { pageIndex: this.data.currentPage, pageSize: this.data.pageSize, status: 2, createUserId: userid },
        func: (data) => {
          if(data.isSuccess){
            let re=data.result.results;
            if(re){
              that.setData({ showNoCollect:false});
              that.convertStall(re);
            }
            that.setData({
              collectStallList: data.result.results
            });
          }
        }
      });
    },
    goStall:function(e){
      let url=e.target.dataset.id;
      wx.navigateTo({
        url: url,
        fail:function(e){
          console.log(e);
        }
      })
    },
    switchRightTab: function(e) {
        let id = e.target.dataset.id,index = parseInt(e.target.dataset.index);
        this.setData({
            curNav: id,
            curIndex: index
        })
        this.getMarketDetail(id);
    },
    getMarketDetail(marketId){
      const that = this;
      if (marketId==-1){
        if (that.data.collectStallList==null){
          that.setData({ showNoCollect:true});
        }else{
          that.setData({ showNoCollect: false });
          that.getMyCollection();
        }
        return;
      }
      that.setData({showNoCollect: false });
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
        newobj.route = '../index/stallStore/stallStore?stallId=' + stall.id + "&companyId=" + stall.companyId;
        if (!convertFun.isInArray(foorArray, stall.floorNum)){
          foorArray.push(stall.floorNum);
        }
        tempDate.push(newobj);
      }
      var floorArray = [];
      for (var i = 0; i < foorArray.length;i++){
        var fnub = foorArray[i];
        var jt1 = new Object;
        jt1.floorNum=''+ fnub +'楼';
        jt1.children = [];
        for (var j = 0; j < tempDate.length;j++){
          var fnub2 = tempDate[j].floorNum;
          if (fnub2==fnub){
            jt1.children.push(tempDate[j]);
          }
        }
        floorArray.push(jt1);
      }
      this.setData({ floorArraySelect: floorArray});
    },
    convertStall(stallArray){
      if (stallArray){
        var floorArray = [];
        for(var i=0;i<stallArray.length;i++){
          var stall = stallArray[i];
          var newobj = { "id": '', "marketId": '', "floorNum": 0, "serialNub": '', "route": '' };
          newobj.id = stall.id;
          newobj.marketId = stall.stallId;
          newobj.floorNum = stall.stallName;
          newobj.serialNub = stall.serialNub;
          newobj.route = '../index/stallStore/stallStore?stallId=' + stall.stallId + "&companyId=" + stall.companyId;
          var jt1 = new Object;
          jt1.floorNum = stall.stallName;
          jt1.children = [];
          jt1.children.push(newobj);
          floorArray.push(jt1);
        }
        this.setData({ floorArraySelect: floorArray });
      }
     
    },
})