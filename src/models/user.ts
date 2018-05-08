import BaseModel from 'src/declare/baseModel';
import UserService from 'src/services/userService';
import router from 'umi/router';

/**
 * 用户管理模块
 */
const initState = {
  loginStatus: 200,
  // tslint:disable-next-line:object-literal-sort-keys
  id_token: localStorage.getItem('id_token') || undefined
};

export default {
  namespace: 'user',
  state: { ...initState },
  reducers: {
    setToken(state, { payload }) {
      // tslint:disable-next-line:no-console
      localStorage.setItem('id_token', payload);
      return { ...state, id_token: payload };
    },
    changeLoginStatus(state, { payload }) {
      return { ...state, loginStatus: payload };
    }
  },
  effects: {
    *login({ payload }, { call, put }) {
      // console.log(payload)
      yield put({
        type: 'changeLoginStatus',
        payload: 200
      });
      // tslint:disable-next-line:no-console
      const { data, status } = yield call(UserService.login, payload);
      // tslint:disable-next-line:no-console
      console.log(status);
      yield put({
        type: 'changeLoginStatus',
        payload: status
      });
      if (status === 200) {
        yield put({
          type: 'setToken',
          payload: data.id_token
        });
        router.push('/');
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'setToken',
        payload: undefined
      });
      router.push('/user/login');
    }
  }
} as BaseModel<any>;
