import BaseModel from 'src/declare/baseModel';
import { AxiosResponse } from 'axios';
import CarService from 'src/pages/car/service';
import _ from 'lodash';

const initState = {
  list: [],
  total: 0,
  isShowBrandsModal: false,
  isShowSeriesModal: false,
  brandList: [],
  seriesList: [{ id: '', name: '全部' }],
  typeList: [{ id: '', name: '全部' }],
  searchParams: {
    brand: '',
    series: '',
    type: '',
    page: 1,
    size: 10,
  }
};
const getInitState = () => {
  return _.cloneDeep(initState);
};
/**
 * 车型列表
 */
export default {
  namespace: 'carModels',
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
      yield put({
        type: 'queryList',
      });
    },
    *queryList({ payload }, { put, call, select }) {
      const searchParams = yield select(state => state.carModels.searchParams);
      const params = { ...searchParams };
      // tslint:disable-next-line:no-console
      console.log(params);
      const { data, status, total } = yield call(CarService.queryCarTypesParams,
                                                 { page: searchParams.page - 1 }, params);
      // tslint:disable-next-line:no-console
      console.log(total);
      if (status === 200) {
        yield put({
          type: 'updateList',
          payload: {
            total,
            list: data
          },
        });
      }
    },
    *updateSearchParams({ payload }, { put }) {
      yield put({
        payload,
        type: 'upSearchParams',
      });
      yield put({
        // payload,
        type: 'queryList',
      });
    },
  },
} as BaseModel<any>;
