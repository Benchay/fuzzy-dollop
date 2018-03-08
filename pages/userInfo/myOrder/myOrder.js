// pages/user_info/my_order/my_order.js
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
        userInfo:{
          id:"8a8694b76071a5dc01607210f7200029",
          companyId:"8a8694b760771272016078053e8c011a"
        },
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
        // 初始化将待付款订单置为空数组
        payOrder: [],
        // 初始化将待拿货订单置为空数组
        taskOrder: [],
        // 初始化将已完成订单置为空数组
        finishOrder: [],
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
      this.getOrder(this.data.activeIndex);

        // const that = this;
        // http({
        //     url: "ums/api/getRandomCode.do",
        //     loading: true,
        //     func: function (data) {
        //         // 定义unpaidOrder和canceledOrder
        //         let unpaidOrder = [],
        //             paidOrder = [];
        //         // 遍历data，将数据重新组合
        //         for (let i = 0; i < data.length; i++) {
        //             // 订单状态为0，为待付款订单，加入unpaidOrder
        //             if (data[i]["order_status"] == "0") {
        //                 unpaidOrder.push(data[i]);
        //             }
        //             // 订单状态为2，为已支付，paidOrder
        //             if (data[i]["order_status"] == "2") {
        //                 paidOrder.push(data[i]);
        //             }
        //         }
        //         that.setData({
        //             allOrder: data,
        //             unpaidOrder: unpaidOrder,
        //             paidOrder: paidOrder
        //         });
        //     }
        // });
        // that.setData({
        //     // 此处获取的activeIndex为user_info页面navigator传过来的参数
        //     activeIndex: options.activeIndex
        // });
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
        let userInfo = this.data.userInfo;
        let order
        http({
          url: queryOrderByParams,
          data: {
            pageIndex: 0,
            pageSize: 100,
            companyId: userInfo.companyId,
            createUserId: userInfo.id,
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