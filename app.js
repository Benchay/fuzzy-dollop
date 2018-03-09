//app.js
/******************************存放全局变量*********************************/ 
App({
    /**
     * 获取用户信息，供各页面调用
     */
    getWechatInfo:function(callback){
        const that = this;
        // 1. 若全局userInfo存在，直接调用回调函数
        if(this.globalData.userInfo){
            typeof callback == "function" && callback(this.globalData.userInfo);
        }
        // 2. 若全局userInfo不存在，用wx.getUserInfo获取userInfo保存到全局
        else{
            //调用登录接口
            wx.login({
                success: function () {
                    wx.getUserInfo({
                        success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            typeof callback == "function" && callback(that.globalData.userInfo);
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null,
        nabeiInfo:null,
        goUrl:null,
        inviteUserId:null,
        baseUrl: true ? "http://192.168.0.123:8002/" : "https://wx.nabei.net/",
    }
});
