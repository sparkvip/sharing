/* eslint-disable import/extensions */
import * as categoryList from '../service.js';

export default {
  namespace: 'resourceList',
  state: {
    data: [{name:'11'}],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(categoryList.queryList,payload);
      yield put({ type: 'saveList', payload: { data: res } });
    },
    *remove({ payload }, { call }) {
      yield call(categoryList.remove,payload);
    },
    *update({ payload }, { call, put }) {
      const res = yield call(categoryList.update,payload);
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