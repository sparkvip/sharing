import { querydownList } from '@/services/api';

export default {
  namespace: 'downlist',

  state: {
    list: []
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      console.log('payload',payload)
      const response = yield call(querydownList, payload);
      console.log('response',response)
      yield put({
        type: 'saveList',
        payload: { data: response },
      });
    },
  },

  reducers: {
    saveList(state, { payload: { data } }) {
      return {
        ...state,
        list: data
      };
    },
  },
};
