import { fakeRegister } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';
import router from 'umi/router';


export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      // console.log(`注册时提交传参，`, payload)
      const response = yield call(fakeRegister, payload);
      if (response.status === 'ok') {
        router.push({
          pathname: '/user/register-result',
          state: {
            account: response.userName
          }
        });
      }
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
   
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
