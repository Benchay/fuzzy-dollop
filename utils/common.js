/**
 * 手机号判断
 * @param mobile 手机号
 * @param showToast 是否显示提示
 */
function isMobileNub(mobile,showToast) {
  if (mobile.length == 0) {
    if (showToast)
    //wx.showToast({ title: '请输入手机号！', icon: 'info',duration: 1500});
      this.showToast({ title: '请输入手机号！' });
    return false;
  }
  if (mobile.length != 11) {
    if (showToast)
      this.showToast({ title: '请输入11位手机号！' });
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    if (showToast)
      this.showToast({ title: '手机号有误！' });
    return false;
  }
  return true;
}
/*
显示toast提示
title:    提示的内容 必填
icon:     图标，//请指定正确的路径，选填
duration: 提示的延迟时间，单位毫秒，默认：1500, 10000永远存在除非手动清除 选填
mask:     是否显示透明蒙层，防止触摸穿透，默认：true 选填
callback:       接口调用成功的回调函数 选填
 */
function showToast(obj) {
  if (typeof obj == 'object' && obj.title) {
    if (!obj.duration || typeof obj.duration != 'number') { obj.duration = 1500; }
    var that = getCurrentPages()[getCurrentPages().length - 1];
    obj.isShow = true;//开启toast
    if (obj.duration < 10000) {
      setTimeout(function () {
        obj.isShow = false;
        obj.callback && typeof obj.callback == 'function' && obj.callback();
        that.setData({
          'showToast.isShow': obj.isShow
        });
      }, obj.duration);
    }
    that.setData({
      showToast: obj
    });
  } else {
    console.log('showToast fail:请确保传入的是对象并且title必填');
  }
}
/**
 *手动关闭toast提示
 */
function hideToast() {
  var that = getCurrentPages()[getCurrentPages().length - 1];
  if (that.data.showToast) {
    that.setData({
      'showToast.isShow': false
    });
  }
}


module.exports = {
  isMobileNub: isMobileNub,
  showToast: showToast,
  hideToast: hideToast
}