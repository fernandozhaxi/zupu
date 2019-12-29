import * as types from './mutation-types';

export const setBottomMenueVisible = ({ commit }, visible) => {
  commit(types.SET_BOTTOM_MENUE_VISIBLE, visible);
};
