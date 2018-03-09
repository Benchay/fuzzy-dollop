//获取应用实例，请求数据的方法
import { http } from '../../../utils/util'
Page({
    data: {
        curNav: 0,
        curIndex: 0,
        stall:'',
        stallId:'',
        spreadLabel:[],
        products:[]
    },
    switchRightTab: function(e) { 
        let id = e.target.dataset.id,
          index = parseInt(e.target.dataset.index);
        this.setData({
            curNav: id,
            curIndex: index
        });
        this.loadForProducts(this.data.curNav);
    },
    goDetails: function(e) {
      let id = e.currentTarget.dataset.id,
        index = parseInt(e.currentTarget.dataset.index);
          if(this.data.products==undefined){
            return;
          }else{
            let productId = id;
            wx.navigateTo({
              url: '../stallStoreDetails/stallStoreDetails?stallId=' + this.data.stallId + '&' + 'productId=' + productId 
            });
          }
        
    },
    onLoad:function(options) {
      this.setData({
        stallId:options.stallId
      });
      //请求档口数据
      http({
        url: "cws/stall/getStall.do",
        method:"GET",
        data: { "stallId": options.stallId },
        func: (data) => {
          var obj = data.result.stall;
          if (obj!=undefined){
            this.setData({
              stall:obj
            });
            //请求推广标签数据
            this.loadForSpreadLabel(this.data.stall.companyId);
          }
        }
      });
    
    },
    //请求推广标签数据
    loadForSpreadLabel:function(data){
      http({
        url: "stock/api/querySpreadLabel.do",
        data: { companyId: data, pageIndex: 1, pageSize: 10 },
        func: (data) => {
          if (data.isSuccess){
            this.setData({
              spreadLabel: data.result.results
            });
            if (this.data.spreadLabel == undefined && this.data.spreadLabel.length == 0) {
              let table = [];
              table.push({id:"",name:"全部商品"});
              this.setData({
                spreadLabel:table
              }); 
            }else{
              let vo = this.data.spreadLabel;
              vo.push({ id: "", name: "全部商品" });
              this.setData({
                spreadLabel: vo
              });
            }
            //默认查询热销商品
            this.loadForProducts(this.data.spreadLabel[0].id);
          }
          
        }
      });
    },

    //请求对应标签的商品数据
    loadForProducts:function(data){
      http({
        url:"stock/api/querySpreadLabelProduct.do",
        data: { spreadLabelId: data,saleState:1,pageIndex:1,pageSize:10},
        func:(data)=>{
          this.setData({
            products:data.result.results
          })
        }
      });
    },

    goOrders:function(){
        wx.navigateTo({
            url: "../submitOrders/submitOrders"
        })
    },
})