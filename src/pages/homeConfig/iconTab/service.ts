import request, { errorProcess } from 'src/utils/request';
// import qs from 'qs';
// import { AxiosResponse } from 'axios';

export default {
  /**
   * 查询APP 底部 icon 配置
   * @param {default type=22}
   */
  async queryConfigIcon(type: number = 22) {
    return request({
      method: 'get',
      url: `mall/api/v0.1/configs/${type}`,
    }).then(errorProcess);
  },
};
