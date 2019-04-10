/* eslint-disable import/extensions */
import * as categoryList from '../service.js';

export default {
  namespace: 'categoryList',
  state: {
    data: [],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(categoryList.queryList,payload);
      yield put({ type: 'saveList', payload: { data: res.data } });
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