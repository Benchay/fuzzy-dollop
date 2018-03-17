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
          console.log(data);
          if (data.isSuccess){
            const market = data.result.market.results;
            if(market!=null && market.length>0){
              var collectItem = { id: '-1', name: '收藏的档口' };
              market.splice(0, 0, collectItem);
              that.setData({ items: market, showNoCollect:true});
              that.getMyCollection();
            }
          }
        }
      })
    },
    getMyCollection:function(){
      var that = this;
      if (app.globalData.nabeiInfo == null || app.globalData.nabeiInfo.user==null){
        this.setData({collectStallList: null,showNoCollect:true});
        return;
      }
      let userid = app.globalData.nabeiInfo.user.id;
      http({
        url: "cws/api/queryCollect.do",
        data: { pageIndex: this.data.currentPage, pageSize: this.data.pageSize, status: 2, createUserId: userid },
        func: (data) => {
          if(data.isSuccess){
            let re=data.result.results;
            if(re && re.length>0){
              that.setData({ showNoCollect:false});
              that.convertStall(re);
            } else {
              this.setData({ showNoCollect: true });
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
        if(e){
          var id = e.target.dataset.id, index = parseInt(e.target.dataset.index);
          this.setData({
            curNav: id,
            curIndex: index
          })
        }else{
          var id=this.data.items[0].id;
        }
        this.getMarketDetail(id);
    },
    getMarketDetail(marketId){
      const that = this;
      if (marketId==-1){
        this.getMyCollection();
        return;
      }
      that.setData({ 
        floorArraySelect:[],
        showNoCollect: false
      });
      wx.showNavigationBarLoading();
      http({
        url: 'cws/market/queryMarketDetail.do?marketId='+marketId,
        method:'GET',
        func: function (data) {
          if (data.isSuccess){
            that.groupStalls(data.result);
          }
        },
        complete:()=>{
          wx.hideNavigationBarLoading();
        }
      })
    },
    groupStalls(data){
      let market = data.market;
      if(market==null||!market.stallList||market.stallList.length<1){
        this.setData({ showNoCollect: true });
        return;
      } 
      let stallList = market.stallList;
      //按floorNum顺序排序
      stallList.sort((x,y)=> {return x['floorNum']-y['floorNum'];});
      
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
      if (stallArray && stallArray.length>0){
        var tempDate = [];
        var foorArray  = [];
        var foormap=[];
        //var m = new Map([[1, 'x'], [2, 'y'], [3, 'z']]);
       
        
        for(var i=0;i<stallArray.length;i++){
          var stall = stallArray[i];
          var newobj = { "id": '', "marketId": '', "floorNum": 0, "serialNub": '', "route": '' };
          newobj.id = stall.id;
          newobj.marketId = stall.marketId;
          newobj.floorNum = stall.marketName;
          newobj.serialNub = stall.serialNub;
          newobj.route = '../index/stallStore/stallStore?stallId=' + stall.stallId + "&companyId=" + stall.companyId;
          if (!convertFun.isInArray(foorArray ,stall.marketId)){
            foorArray .push(stall.marketId);
            foormap.push([stall.marketId, stall.marketName]);
          }
          tempDate.push(newobj);
        }
        
        var all=[];
        for (var i = 0; i < foorArray.length; i++) {
          var fnub = foorArray[i];
          var jt1 = new Object;
          var marketname='';
          foormap.forEach(function (value, key, foormap) {
            if (value[0] == fnub){
              marketname = value[1];
              return true;
            }
          });
          jt1.floorNum = marketname;
          jt1.children = [];
          for (var j = 0; j < tempDate.length; j++) {
            var fnub2 = tempDate[j].marketId;
            if (fnub2 == fnub) {
              jt1.children.push(tempDate[j]);
            }
          }
          all.push(jt1);
        }

        this.setData({ floorArraySelect: all  });
      }
    },
})