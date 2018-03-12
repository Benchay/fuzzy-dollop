//app.js
/******************************存放全局变量*********************************/ 
const appid = 'wx832e5caf80b83f93';
const appSecret = '9eb9a008965a64d46352b3f95d5ccc11'

App({
  
  onShow: function () {
    setInterval(this.keepToken, 1000 * 600);
  },
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
                success: function (res) {
                    console.log(res);
                    //发起网络请求
                    wx.request({
                      url: 'https://api.weixin.qq.com/sns/jscode2session',
                      data: {
                        appid: appid,
                        secret: appSecret,
                        js_code: res.code,
                        grant_type:'authorization_code'
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success: function (res) {
                        console.log(res);
                        const openid = res.data.openid;
                        console.log(openid);
                        wx.getUserInfo({
                          success: function (res) {
                            that.globalData.userInfo = res.userInfo;
                            that.globalData.userInfo.openId = openid;
                            typeof callback == "function" && callback(that.globalData.userInfo);
                          }
                        })
                      }
                    })
                }
            })
        }
    },
    keepToken:function(){
      if (this.globalData.nabeiInfo){
        wx.request({
          url: this.globalData.baseUrl,
          header: {
            'content-type': 'application/json',
          },
          method: 'GET',
        })
      }
    },
    globalData: {
        userInfo: null,
        nabeiInfo:null,
        goUrl:null,
        inviteUserId: null,
        baseUrl: true ? "http://192.168.0.123:8002/" : "https://wx.nabei.net/",
    }
});
