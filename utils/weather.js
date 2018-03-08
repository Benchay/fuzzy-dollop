
const weatherIcon = {
  '00': '晴',
  '01': '多云',
  '02': '阴',
  '03': '阵雨',
  '04': '雷阵雨',
  '05': '雷阵雨并伴有冰雹',
  '06': '雨夹雪',
  '07': '小雨',
  '08': '中雨',
  '09': '大雨',
  '10': '暴雨',
  '11': '大暴雨',
  '12': '特大暴雨',
  '13': '阵雪',
  '14': '小雪',
  '15': '中雪',
  '16': '大雪',
  '17': '暴雪',
  '18': '雾',
  '19': '冻雨',
  '20': '沙尘暴',
  '21': '小雨- 中雨',
  '22': '中雨- 大雨',
  '23': '大雨- 暴雨',
  '24': '暴雨- 大暴雨',
  '25': '大暴雨- 特大暴雨',
  '26': '小雪- 中雪',
  '27': '中雪- 大雪',
  '28': '大雪- 暴雪',
  '29': '浮尘',
  '30': '扬沙',
  '31': '强沙尘暴',
  '32': '飑',
  '33': '龙卷风',
  '34': '弱高吹雪',
  '35': '轻雾',
  '53': '霾',
}

function getIconPath(weatherDesc){
  for(let i in weatherIcon){
    if(weatherIcon[i]===weatherDesc){
      // console.log(i);
      // console.log(weatherIcon[i]);
      return '../../images/weatherIcon/' + i + '.png';
    }
  }
  return '../../images/weatherIcon/undefined.png';
}

module.exports = { 
  getIconPath
};