// pages/user_info/my_order/my_order.js
const app = getApp();
const {
  http
} = require('../../../utils/util.js');
const {
  queryOrderByParams
} = require('../../../utils/date.js');


Page({

    /**
     * 页面的初始数据
     */
    data: {
      nabeiInfo: app.globalData.nabeiInfo,
        navTabs: [{
            title:"待付款",
            status:"20"
          },
          {
            title: "待拿货",
            status: "2"
          },
          {
            title: "已完成",
            status: "99"
          }],
        // 初始化将activeIndex置为0
        activeIndex: 0,
        //当前显示的订单数组
        orders:[],
        //筛选
        selectPerson:true,
        firstPerson:'四季星座',
        cancel_icon: true,
        input_value: "",
        history:true,
        commodity:false,
        stalls:true,
        selectList: [{
            name: "四季星座",
        },{
            name: "火车站头",
        }],
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      //在data中赋值为空
      this.setData({
        nabeiInfo: app.globalData.nabeiInfo
      });
      this.getOrder(this.data.activeIndex);
    },
    /**
     * nav item的tap事件
     */
    tapNavItem (e) {
      let activeIndex = e.currentTarget.dataset.id;
      this.getOrder(activeIndex);
    },

    /**
     * 根据当前选项加载订单信息
     */
    getOrder(activeIndex){
      let that = this;
      let orders = this.data.orders;
      if(orders[activeIndex]){   //有加载过订单数据就直接切换
        this.setData({
          activeIndex: activeIndex
        });
      } else {      //没有订单数据就加载
        //先切换tab，再加载数据
        this.setData({
          activeIndex: activeIndex
        });
        let tab = this.data.navTabs[activeIndex];
        let nabeiInfo = this.data.nabeiInfo; console.log(this.data);
        //let order
        http({
          url: queryOrderByParams,
          data: {
            pageIndex: 0,
            pageSize: 100,
            companyId: nabeiInfo.compId,
            createUserId: nabeiInfo.user.id,
            status: tab.status
          },
          func: data => {
             orders[activeIndex] = data.result.results;
             that.setData({
               orders:orders
             });
          }
        });
      }
    },

    goPay(){
      //弹出支付页面
    },
    /**
     * tap当前订单去当前订单详情页
     */
    goOrderDetail(e) {
        // 获取当前订单的ID作为值传入url中
      const orderId = e.currentTarget.dataset.id;
      wx.redirectTo({
        url: `../orderDetail/orderDetail?id=${orderId}`
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
})