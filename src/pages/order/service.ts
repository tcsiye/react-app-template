import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';

const OrderService = {
  async queryList(params, data) {
    return request({
      data,
      method: 'post',
      url: `/mall/api/v0.1/back-end/orders/params?${qs.stringify(params)}`,
    }).then(errorProcess);
  },
};
export default OrderService;
