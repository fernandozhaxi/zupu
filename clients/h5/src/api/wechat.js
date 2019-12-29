import axios from './baseAxios';
export default {
  // 发送消息
  sendMsg(data) {
    return axios.post('/wapi/wechat/sendMsg', data);
  },
  // 拉取消息
  getMessages(page) {
    return axios.post('/wapi/wechat/getMessages', page);
  },
  // 拉取消息
  totalUnreadCount(page) {
    return axios.get('/chronic/mobile/v2/message/totalUnreadCount', page);
  },
  // 发送模版消息
  sendTmpMsg(data) {
    return axios.post('/wapi/wechat/sendTmpMsg', data);
  }
};
