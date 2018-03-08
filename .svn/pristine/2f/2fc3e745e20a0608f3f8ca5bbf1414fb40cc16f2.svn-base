/**
 * 存储localStorage
 */
function setStore(name, content){
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  wx.setStorage({
    key: name,
    data: content,
    success: (res) => {
      return res.data;
    }
  })
}
/**
 * 获取localStorage
 */
function getStore(name, {callback}) {
  if (!name) return;
  wx.getStorage({
    key: name,
    success: function(res) {
		  console.log('getStore' + res.data);
      var obj = new Object();
      obj.result=0;
      obj.data=res.data;
      callback(obj);
    },
    fail:function(){
      var obj = new Object();
      obj.result = -1;
      obj.data = '';
      callback(obj);
    }
  })
}

/**
 * 删除localStorage
 */
function removeStore(){
  wx.clearStorage;
}

module.exports = {
  setStore: setStore,
  getStore: getStore,
  removeStore: removeStore
}