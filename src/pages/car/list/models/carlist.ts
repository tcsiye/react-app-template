import BaseModel from 'src/declare/baseModel';
import { AxiosResponse } from 'axios';
import CarService from 'src/pages/car/service';
import qs from 'qs';
import router from 'umi/router';

const initState = {
  list: [],
  total: 0,
  historySearch: '',
  searchParams: {
    status: '0',
    sellProvinceId: '',
    keyword: '',
    page: 1,
    size: 10,
  }
};
const getInitState = () => {
  return JSON.parse(JSON.stringify(initState));
};
/**
 * 数量管理模块
 */
export default {
  namespace: 'carlist',
  state: getInitState(),
  reducers: {
    updateList(state, { payload }) {
      state.list = payload.list;
      state.total = payload.total;
      return { ...state };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    upSearchParams(state, { payload }) {
      return { ...state, searchParams: { ...state.searchParams, ...payload } };
    },
    initData() {
      return getInitState();
    },
  },
  effects: {
    *ready({ payload }, { put, call, select }) {
      const { historySearch } = yield select(state => state.carlist);
      if (payload === historySearch) {
        if (payload === '') {
          yield put({
            type: 'initData',
          });
          yield put({
            type: 'queryList',
          });
        }
      } else {
        let params = payload.substring(1, payload.length);
        params = qs.parse(params);
        yield put({
          type: 'initData',
        });
        if (payload === '') {
          yield put({
            type: 'queryList',
          });
        } else {
          yield put({
            type: 'updateSearchParams',
            payload: params,
          });
        }
      }
      // yield put({
      //   type: 'queryList',
      // });
    },
    *queryList({ payload }, { put, call, select }) {
      // tslint:disable-next-line:no-console
      const searchParams = yield select(state => state.carlist.searchParams);
      const search = `?${qs.stringify(searchParams)}`;
      const params = { ...searchParams, page: searchParams.page - 1 };
      const { data, status, total } = yield call(CarService.queryCarItems, params);

      router.replace({
        search,
        pathname: '/car/list',
        // query: searchParams,
      } as any);
      yield put({
        type: 'updateState',
        payload: { historySearch: search },
      });
      yield put({
        type: 'updateList',
        payload: {
          total,
          list: data,
        }
      });
    },
    *updateSearchParams({ payload }, { put }) {
      yield put({
        payload,
        type: 'upSearchParams',
      });
      yield put({
        payload,
        type: 'queryList'
      });
    },
  },
} as BaseModel<any>;
