const convert = require('./convert.js');
/**
 * 接口请求方法：wx.request发起的是https请求,一个微信小程序，最高并发数5个
 * @param options--调用该方法时传入的对象
 */
function http(options) {
    // 获取全局对象并进行解构
    let {globalData:{baseUrl}} = getApp();
    let nabeiinfo = getApp().globalData.nabeiInfo;
    console.log(nabeiinfo);
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
    if (options.method == "GET" && options.data!=null){
      var json = options.data;
      var objs=convert.jsonToMap(json);
      para=convert.map2UrlString(objs);
    }
    wx.request({
        url: `${baseUrl}${options.url}` + para,
        header: {
            'content-type': 'application/json',
            //'onTest':'hmj',
            "token": _token
        },
        data: options.data,
        //传参使用pss
        method: options.method == null ? "POST" : options.method,
        success: (res)=> {
            if (options.loading) {
                setTimeout(function(){
                    wx.hideLoading()
                },200)
            }
            //console.log(options.url + para );
            //console.log(res);
            options.func(res.data);
        },
        fail: function (err) {
          console.log(err)
        }
    })
}

module.exports = {
  http
};