/* eslint-disable import/extensions */
import * as categoryList from '../service.js';

export default {
  namespace: 'resourceList',
  state: {
    data: [{name:'11'}],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      console.log('queryList--payload',payload)
      const res = yield call(categoryList.queryList,payload);
      console.log('res',res)
      yield put({ type: 'saveList', payload: { data: res } });
    },
    *remove({ payload }, { call }) {
      yield call(categoryList.remove,payload);
    },
    *update({ payload }, { call, put }) {
      console.log('update--payload',payload)
      const res = yield call(categoryList.update,payload);
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