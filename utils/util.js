const convert = require('./convert.js');
/**
 * 接口请求方法：wx.request发起的是https请求,一个微信小程序，最高并发数5个
 * @param options--调用该方法时传入的对象
 */
function http(options) {
    // 获取全局对象并进行解构
    let {globalData:{baseUrl}} = getApp();
    let nabeiinfo = getApp().globalData.nabeiInfo;
    let _token = (nabeiinfo == null || nabeiinfo.user==null) ? '': nabeiinfo.user.token;
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
            'onTest':'hmj',
            //"token": _token
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



/**
 * array转map
 */
function arrayToMap(obj, key) {
  let map = new Array();
  for (let i in obj) {
    map[obj[i][key]] = obj[i];
  }
  return map;
}

/**
 * map转array
 */
function mapToArray(map) {
  let arry = new Array();
  for (let i in map) {
    arry.push(map[i]);
  }
  return arry;
}

/**
 * 复制属性
 */
function copyProperty(to, form) {
  for (let i in form) {
    to[i] = form[i];
  }
}

/**
 * 格式化时间
 */
function formatDate(date, fmt ='Y-M-D h:m:s') {
  // if (date == null) {
  //   return "";
  // }
  // if (typeof (date) == "number") {
  //   date = new Date(date);
  // }
  // if (/(y+)/.test(fmt)) {
  //   fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  // }
  // let o = {
  //   'M+': date.getMonth() + 1,
  //   'd+': date.getDate(),
  //   'h+': date.getHours(),
  //   'm+': date.getMinutes(),
  //   's+': date.getSeconds()
  // };
  // for (let k in o) {
  //   if (new RegExp(`(${k})`).test(fmt)) {
  //     let str = o[k] + '';
  //     fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
  //   }
  // }
  // return fmt;

  if (date == null) {
    return "";
  }
  if (typeof (date) == "number") {
    date = new Date(date);
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    fmt = fmt.replace(formateArr[i], returnArr[i]);
  }
  return fmt;  
};

/**
 * 数据转化  
 */
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}



module.exports = {
  http,
  arrayToMap,
  mapToArray,
  copyProperty,
  formatDate
};