/**
 * Created by song on 15/06/2017.
 */

import Vue from 'vue';
import moment from 'moment';

const JUST_NOW = 3000; // 3s内
const IN_SECOND = 1000 * 60; // 一分钟
const IN_MINUTE = 1000 * 60 * 60; // 一小时
const IN_HOUR = 1000 * 60 * 60 * 12; // 12小时
const IN_DAY = 1000 * 60 * 60 * 24 * 1; // 1天
const IN_MONTH = 1000 * 60 * 60 * 24 * 30; // 1个月
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
const weekMap = {
  Mon: '星期一',
  Tue: '星期二',
  Wed: '星期三',
  Thu: '星期四',
  Fri: '星期五',
  Sat: '星期六',
  Sun: '星期天'
};

function isToday(time) {
  var today = new Date();
  var target = new Date(time);

  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  );
}

function isYesterday(time) {
  var today = new Date().getTime();
  var yesterday = new Date(today - 24 * 60 * 60 * 1000);
  var target = new Date(time);

  return (
    yesterday.getFullYear() === target.getFullYear() &&
    yesterday.getMonth() === target.getMonth() &&
    yesterday.getDate() === target.getDate()
  );
}

Vue.filter('sexFilter', function(sex) {
  if (sex === 0) {
    return '未知';
  }
  if (sex === 1) {
    return '男';
  }
  if (sex === 2) {
    return '女';
  }
  return '其他';
});

Vue.filter('age', val => {
  const date = moment(val);
  // 如果不是一个有效的日期表达式

  if (!date.isValid()) {
    return '';
  }
  // 获得距今天的月份数
  const month = moment().diff(date, 'month');

  if (month <= 12) {
    return `${month}个月`;
  }
  if (month <= 84) {
    return `${Math.floor(month / 12)}岁${month % 12}个月`;
  }
  return `${Math.floor(month / 12)}岁`;
});

Vue.filter('dateFormat', function(time, fmt) {
  let formatStr = '';
  if (!fmt) {
    formatStr = 'yyyy-MM-dd hh:mm';
  }
  if (time) {
    const getDate = new Date(time);
    const o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      S: getDate.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
      formatStr = fmt.replace(
        RegExp.$1,
        String(getDate.getFullYear()).substr(4 - RegExp.$1.length)
      );
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        formatStr = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ?
            o[k] :
            ('00' + o[k]).substr(String(o[k]).length)
        );
      }
    }
    return formatStr;
  } else {
    return '';
  }
});

Vue.filter('dateFromNow', time => {
  const localTime = new Date(); // 当前系统时间
  const createTime = new Date(time); // 消息创建时间
  const diff = localTime - createTime;

  if (diff <= JUST_NOW) {
    return '刚刚';
  } else if (diff <= IN_SECOND) {
    return '1分钟内';
  } else if (diff <= IN_MINUTE) {
    return parseInt(diff / IN_SECOND, 10) + '分钟前';
  } else if (diff <= IN_MINUTE) {
    return parseInt(diff / IN_MINUTE, 10) + '小时前';
  } else if (diff <= IN_HOUR * 2) {
    const list = createTime.toString().split(' ');
    const lastIndex = list[4].lastIndexOf(':');
    const realtime = list[4].toString().substring(0, lastIndex);

    return realtime;
  } else if (diff < IN_DAY * 7) {
    if (diff < IN_DAY) {
      return parseInt(diff / IN_HOUR, 10) + '天前';
    }
    const t = createTime.toString().slice(0, 3);

    return weekMap[t];
  } else if (diff < IN_MONTH * 24) {
    const list = createTime.toString().split(' ');
    const month = list[1];

    let realtime = '';

    if (diff < IN_MONTH) {
      realtime += monthMap[month];
    } else {
      realtime = list[3] + '-' + monthMap[month];
    }
    return realtime + '-' + list[2];
  }
});

// 用在聊天信息中
Vue.filter('chatTime', time => {
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
});
