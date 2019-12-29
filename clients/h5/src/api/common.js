
import axios from './baseAxios.js';

export default {
  login(username, password, orgId) {
    return axios.post('/account/ns/login.ajax', {
      username,
      password,
      orgId
    });
  },
  users() {
    return axios.get('/cors');
  },

  logout() {
    return axios.get('/account/ns/logout');
  }
};
