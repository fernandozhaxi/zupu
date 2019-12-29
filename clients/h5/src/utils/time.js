import { isType } from './common';
const monthMap = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
};
/**
 *时间格式化
 @param date 日期对象或者时间戳
 @param format 需要的格式
*/
// 时间格式化参数 dateFormat(new Date, 'yyyy-mm-dd hh:ii:ss')

export const dateFormat = function(date, format) {
  let formatResult = '';
  let dateResult = '';

  if (typeof date === 'undefined' && typeof format === 'undefined') {
    dateResult = new Date();
    formatResult = 'yyyy-mm-dd';
  } else if (typeof date === 'string' && typeof format === 'undefined') {
    formatResult = date;
    dateResult = new Date();
  } else if (/^\d+$/.test(`${date}`)) {
    dateResult = new Date(Number(date));
  } else if (date && {}.toString.call(date) !== '[object Date]') {
    dateResult = new Date(date);
  }
  if (isType(dateResult) !== 'Date') {
    return dateResult;
  }
  var e = {
    'm+': dateResult.getMonth() + 1,
    'd+': dateResult.getDate(),
    'h+': dateResult.getHours(),
    'i+': dateResult.getMinutes(),
    's+': dateResult.getSeconds(),
    'q+': Math.floor((dateResult.getMonth() + 3) / 3),
    S: dateResult.getMilliseconds()
  };

  /(y+)/.test(format) &&
    (formatResult = format.replace(
      RegExp.$1,
      String(date.getFullYear()).substr(4 - RegExp.$1.length)
    ));
  for (var i in e) {
    new RegExp('(' + i + ')').test(format) &&
      (formatResult = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ?
          e[i] :
          ('00' + e[i]).substr(String(e[i]).length)
      ));
  }
  return formatResult;
};

/**
 * 判断时间是否是今天
 * @param {*} time
 */
export const isToday = time => {
  var today = new Date();
  var target = new Date(time);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
};
/**
 * 判断时间是否是昨天
 * @param {*} time
 */
export const isYesterday = time => {
  if (typeof time === 'undefined') {
    return false;
  }
  var today = new Date().getTime();
  var yesterday = new Date(today - 24 * 60 * 60 * 1000);
  var target = new Date(time);

  return (
    yesterday.getFullYear() === target.getFullYear() &&
    yesterday.getMonth() === target.getMonth() &&
    yesterday.getDate() === target.getDate()
  );
};

/**
 * 将时间转换为聊天时间，参考微信
 * @param {*} time
 */
export const dateToChat = time => {
  const createTime = new Date(time); // 目标时间
  const list = createTime.toString().split(' ');
  // 判断是否是今天
  const timeStr = list[4].substr(0, 5);

  if (isToday(time)) {
    return timeStr;
  } else if (isYesterday(time)) {
    return '昨天 ' + timeStr;
  } else {
    return monthMap[list[1]] + '月' + (list[2] | 0) + '日 ' + timeStr;
  }
};
