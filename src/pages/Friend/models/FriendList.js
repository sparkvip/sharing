/* eslint-disable import/extensions */
import * as categoryList from '../service.js';

export default {
  namespace: 'friendList',
  state: {
    data: [{name:'11'}],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(categoryList.queryFriendList,payload);
      yield put({ type: 'saveList', payload: { data: res } });
    },
  },
  reducers: {
    saveList(state, { payload: { data } }) {
      return {
        ...state,
        data,
      }
    },
  },
};