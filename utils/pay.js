const app = getApp();
const { http } = require('util.js');
let { globalData: { baseUrl } } = getApp();

function payoff (e) {
  console.log("payoff---------");
  var that = e;
  if (getApp().globalData.openId){
    that.submitOrderAndSignBack(getApp().globalData.openId, e.orderids, e.orderTotalFee,e.succCall,e.failCall);
  }else{
    e.failCall({errorMsg:"支付下单失败,没有获取到openId！"});
  }
};

//下单签名多合一
function submitOrderAndSignBack(openId, orderids, orderTotalFee, succCall, failCall) {
  console.log("统一下单开始");
  var that = this;

  http({
    url: "wallet/api/submitOrderAndSignBack",
    method:'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: { 'openid': openId, 'orderIds': orderids, 'orderTotalFee': orderTotalFee * 100 },
    func: (res) => {
          console.log("下单和签名返回 :" + JSON.stringify(res));
          that.requestPayment(res, succCall, failCall);
        }
  });
  }

//申请支付
function requestPayment(obj, succCall, failCall) {
  console.log(obj)
  wx.requestPayment({
    'timeStamp': obj.timeStamp,
    'nonceStr': obj.nonceStr,
    'package': obj.package,
    'signType': obj.signType,
    'paySign': obj.paySign,
    'success': function (res) {
      succCall(res);
    },
    'fail': function (res) {
      if ('requestPayment:fail cancel' == res.errMsg){
        res.errorMsg = "取消支付";
      } else {
        res.errorMsg = "申请支付失败";
      }
      failCall(res);
    }
  })
} 
module.exports = {
  payoff,
  submitOrderAndSignBack,
  requestPayment
};