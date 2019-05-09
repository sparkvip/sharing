/* eslint-disable import/extensions */
import * as categoryList from '../service.js';

export default {
  namespace: 'categoryList',
  state: {
    data: [{name:'11'}],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      console.log('payload',payload)
      const res = yield call(categoryList.queryList,payload);
      console.log('res',res)
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