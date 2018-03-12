const app = getApp();
let { globalData: { baseUrl } } = getApp();

function payoff (e) {
  var that = e;
  wx.login({
    success: function (res) {
      that.getOpenId(res.code);
    }
  });        

};
//获取openid
function getOpenId (code) {
  console.log("getOpenIdstart")
  var that = this;
  wx.request({
    url: baseUrl+'/wallet/api/getOpenId',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: { 'code': code },
    success: function (res) {

      var openId = res.data.openid;
      that.xiadan(openId);
    },
    fail: function (res) {
      console.log(res)
    }
  })
  console.log("end")
};
//下单
function xiadan(openId,orderids, orderTotalFee) {
  console.log("统一下单开始");
  var that = this;
  wx.request({
    url: baseUrl +'/wallet/api/xiadan',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: { 'openid': openId, 'orderids': orderids, 'orderTotalFee': orderTotalFee},
    success: function (res) {
      var prepay_id = res.data.prepay_id;
      console.log(JSON.stringify(res))
      console.log("统一下单返回 prepay_id:" + prepay_id);
      that.sign(prepay_id);
    }
  })
};
//签名
function sign(prepay_id) {
  var that = this;
  wx.request({
    url: baseUrl +'/wallet/api/sign',
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: { 'repay_id': prepay_id },
    success: function (res) {
      console.log("签名返回 :" + JSON.stringify(res));
      that.requestPayment(res.data);

    }
  })
}
//申请支付
 function requestPayment (obj) {
  console.log(obj)
  wx.requestPayment({
    'timeStamp': obj.timeStamp,
    'nonceStr': obj.nonceStr,
    'package': obj.package,
    'signType': obj.signType,
    'paySign': obj.paySign,
    'success': function (res) {
      console.log("yes ssss")
      console.log(JSON.stringify(res))
    },
    'fail': function (res) {
      console.log("nonono ssss")
      console.log(JSON.stringify(res))
    }
  })
} 
module.exports = {
  payoff,
  getOpenId,
  xiadan,
  sign,
  requestPayment
};