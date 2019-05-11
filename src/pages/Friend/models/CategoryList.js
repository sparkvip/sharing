/* eslint-disable import/extensions */
import * as categoryList from '../service.js';

export default {
  namespace: 'friend',
  state: {
    data: [],
  },
  effects: {
    // 查看审批列表
    *queryList({ payload }, { call, put }) {
      const res = yield call(categoryList.queryList, payload);
      yield put({ type: 'saveList', payload: { data: res } });
    },
    // 查看我的好友列表
    *queryFriend({ payload }, { call, put }) {
      const res = yield call(categoryList.queryFriend, payload);
      yield put({ type: 'saveList', payload: { data: res } });
    },
    *queryResourceList({ payload }, { call, put }) {
      const res = yield call(categoryList.queryResourceList, payload);
      yield put({ type: 'saveList', payload: { data: res } });
    },
    *agree({ payload }, { call, put }) {
      yield call(categoryList.agree, payload.data);
      yield put({ type: 'queryList', payload: { userId: payload.userId } });
    },
    *reject({ payload }, { call, put }) {
      yield call(categoryList.reject, payload.data);
      yield put({ type: 'queryList', payload: { userId: payload.userId } });
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