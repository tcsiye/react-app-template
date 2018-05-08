import BaseModel from 'src/declare/baseModel';

export interface AppModelState {
  collapsed: boolean;
  openKeys: string[];
  selectedKeys: string[];
}
const initState = {
  collapsed: false,
  openKeys: [],
  selectedKeys: []
};
/**
 *  全局应用状态
 */
export default {
  namespace: 'app',
  state: { ...initState },
  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload
      };
    },
    updateOpenKeys(state, { payload }) {
      return {
        ...state,
        openKeys: [payload[payload.length - 1]]
      };
    },
    updateSelectedKeys(state, { payload }) {
      return {
        ...state,
        selectedKeys: payload
      };
    },
    updateMenukey(state, { payload }) {
      return {
        ...state,
        openKeys: [payload[0]],
        selectedKeys: [payload[1]]
      };
    }
  }
} as BaseModel<AppModelState>;
