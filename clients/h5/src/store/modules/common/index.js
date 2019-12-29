import state from './state';
import mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import createLogger from 'vuex/dist/logger';
const debug = process.env.NODE_ENV !== 'production';

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
};
