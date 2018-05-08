/**
 * 数量管理模块
 */
export default {
  namespace: 'count',
  state: 0,
  reducers: {
    increase(state: number, params: any) {
      // tslint:disable-next-line:no-console
      console.log(params);
      return state + 1;
    },
    decrease(state: number) {
      return state - 1;
    },
  },
};
