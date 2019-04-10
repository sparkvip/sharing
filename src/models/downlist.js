import { querydownList } from '@/services/api';

export default {
  namespace: 'downlist',

  state: {
    list: {
      category: [
        { key: 1, code: 'COMPUTER', name: '计算机' },
        { key: 2, code: 'ENGLISH', name: '英语' },
        { key: 3, code: 'MATH', name: '数学' },
        { key: 4, code: 'PHYSICAL', name: '物理' },
        { key: 5, code: 'CHEMISTRY', name: '化学' }
      ],
      fileType: [
        { key: 1, code: 'exe', name: 'exe' },
        { key: 2, code: 'zip', name: 'zip' },
        { key: 3, code: 'doc/docx', name: 'doc/docx' },
        { key: 4, code: 'xls/xlsx', name: 'xls/xlsx' },
        { key: 5, code: 'ppt', name: 'ppt' },
        { key: 6, code: 'png', name: 'png' },
        { key: 7, code: 'mp4', name: 'mp4' },
        { key: 8, code: 'txt', name: 'txt' }
      ]
    },
  },

  effects: {
    *queryList({ payload }, { call, put }) {
      const response = yield call(querydownList, payload);
      yield put({
        type: 'saveList',
        payload: { data: response.data },
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
