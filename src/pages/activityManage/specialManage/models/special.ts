import BaseModel from 'src/declare/baseModel';
import ActivityService, { SubjectBean } from '../../service';
import { AxiosResponse } from 'axios';

const initState = {
  list: []
  // total: 0
};
const getInitState = () => {
  return JSON.parse(JSON.stringify(initState));
};
/**
 * 数量管理模块
 */
export default {
  namespace: 'special',
  state: getInitState(),
  reducers: {
    updateList(state, { payload }) {
      state.list = payload.list;
      return { ...state };
    },
    updateState(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    *queryList({ payload }, { put, call }) {
      // tslint:disable-next-line:no-console
      const { data, status } = (yield call(
        ActivityService.querySubjectList,
        payload
      )) as AxiosResponse<SubjectBean[]>;

      yield put({
        type: 'updateList',
        payload: {
          list: data
          // total: 0
        }
      });
    }
  }
} as BaseModel<any>;
