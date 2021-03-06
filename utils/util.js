const convert = require('./convert.js');
const storage = require("./storage.js")
const constant = require("./constant.js")
/**
 * 接口请求方法：wx.request发起的是https请求,一个微信小程序，最高并发数5个
 * @param options--调用该方法时传入的对象
 */
function http(options) {
    // 获取全局对象并进行解构
    let {globalData:{baseUrl}} = getApp();
    let nabeiinfo = getApp().globalData.nabeiInfo;
    let _token = (nabeiinfo == null || nabeiinfo.user == null) ? '' : nabeiinfo.token;
    if (options.loading) {
      /*
        wx.showLoading({
            title: "加载中...",
            mask: true
        });
        */
    }
    let para='';
    let contentType = 'application/json';
    if (options.method == "GET" && options.data!=null){
      var json = options.data;
      var objs=convert.jsonToMap(json);
      para=convert.map2UrlString(objs);
    }
    if (options.contentType){
      contentType = options.contentType;// 'application/x-www-form-urlencoded';
    }
    wx.request({
        url: `${baseUrl}${options.url}` + para,
        header: {
          'content-type': contentType,
          "token": _token
        },
        data: options.data,
        //传参使用pss
        method: options.method == null ? "POST" : options.method,
        success: (res) => {
          if (options.loading) {
            setTimeout(function () {
              wx.hideLoading()
            }, 200)
          }
          //console.log(res);
          if (!res.data.isSuccess) {
            if (res.data.errorCode == '402') {
              if (nabeiinfo && nabeiinfo.user) {
                let authToken = nabeiinfo.user.authToken;
                wx.request({
                  url: `${baseUrl}` + 'ums/api/wxAppLogin.do',
                  method: "post",
                  data: { mobile: nabeiinfo.mobile, openId: nabeiinfo.mobile, authToken: authToken },
                  success: function (res2) {
                    if (res2.data.isSuccess) {
                      var newInfo = nabeiinfo;
                      newInfo.token = res2.data.result.token;
                      getApp().globalData.nabeiInfo = newInfo;
                      console.log(newInfo);
                      storage.setStore(constant.NABEI_AUTH_TOKEN, newInfo);
                      wx.request({
                        url: `${baseUrl}${options.url}` + para,
                        header: {
                          'content-type': 'application/json',
                          "token": newInfo.token
                        },
                        data: options.data,
                        method: options.method == null ? "POST" : options.method,
                        success: (res) => {
                          options.func(res.data);
                        }
                      });
                    }
                  }
                })
              }
            }else{
              options.func(res.data);
            }
          }else{
            options.func(res.data);
          }
        },
        fail: function (err) {
          console.log(err);
          if (err && err.errMsg) {
            let error = err.errMsg;
            var pages = getCurrentPages();
            if (error.indexOf('request:fail timeout') >-1){

            }else if (error.indexOf('request:fail')>-1){
              if (pages.length>1){
                wx.redirectTo({
                  url: '/pages/system/netFail'
                });
              }else{
                wx.navigateTo({
                  url: '/pages/system/netFail'
                });
              }
              
            }
          }
        },
        complete:function(){
          if(options.complete){
            options.complete();
          }
        }
      })
}

module.exports = {
  http
};