/* eslint-disable import/extensions */
import { message } from 'antd';
import * as categoryList from '../service.js';


export default {
  namespace: 'aduit',
  state: {
    data: [],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(categoryList.queryList, payload);
      yield put({ type: 'saveList', payload: { data: res } });
    },
    *agree({ payload }, { call, put }) {
      const res =  yield call(categoryList.agree, payload.data);
      if(res === 'ok'){
         message.success('操作成功！');
      }else{
        message.error('操作失败！');
      }
      yield put({ type: 'queryList', payload: payload.userId });
    },
    *reject({ payload }, { call, put }) {
      const res =  yield call(categoryList.reject, payload.data);
      if(res === 'ok'){
        message.success('操作成功！');
     }else{
       message.error('操作失败！');
     }
      yield put({ type: 'queryList', payload: payload.userId });

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