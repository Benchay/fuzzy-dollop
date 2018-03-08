
/** 
  * 
  * json转字符串 
  */
function stringToJson(data) {
  return JSON.parse(data);
}
/** 
*字符串转json 
*/
function jsonToString(data) {
  return JSON.stringify(data);
}
/** 
*map转换为json 
*/
function mapToJson(map) {
  return JSON.stringify(strMapToObj(map));
}
/** 
*json转换为map 
*/
function jsonToMap(jsonStr) {
  //return objToStrMap(JSON.parse(jsonStr));
   return objToStrMap(JSON.parse(JSON.stringify(jsonStr)));
}
/** 
*map转化为对象（map所有键都是字符串，可以将其转换为对象） 
*/
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

/** 
*对象转换为Map 
*/
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
} 

function map2UrlString(strMap){
  var para='';
  var i=0;
  for (let [k, v] of strMap) {
    if(i<1){
      para = para + "?" + k + "=" + v;
    }else{
      para = para + "&" + k + "=" + v;
    }
  }
  return para;
}
/**
 * 判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
  if (arr==null) return false;
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}

module.exports = {
  stringToJson: stringToJson,
  jsonToString: jsonToString,
  mapToJson: mapToJson,
  jsonToMap: jsonToMap,
  strMapToObj: strMapToObj,
  objToStrMap: objToStrMap,
  map2UrlString: map2UrlString,
  isInArray: isInArray,
} 