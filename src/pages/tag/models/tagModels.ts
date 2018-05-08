import BaseModel from 'src/declare/baseModel';
import { AxiosResponse } from 'axios';
import tagService from 'src/pages/tag/service';
import homeConfigService from 'src/pages/homeConfig/service';
import _ from 'lodash';

const initState = {
  list: [],
};
const getInitState = () => {
  return _.cloneDeep(initState);
};
/**
 * 车型列表
 */
export default {
  namespace: 'tagModels',
  state: getInitState(),
  reducers: {
    initData() {
      return getInitState();
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {
    *ready({ payload }, { put }) {
      yield put({
        type: 'queryInfo',
      });
    },
    *queryInfo({ payload }, { put, call }) {
      const queryId = [7, 8, 15];  // 7:热门品牌 8:热门查询首付区间 15:热门搜索
      const list = [];

      queryId.forEach(async (id, index) => {
        const { status, data } = await homeConfigService.queryHomeConfig(id) ;
        if (status === 200) {
          list[index] = data;
        }
      });

      yield put({
        type: 'updateState',
        payload: { list },
      });
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
