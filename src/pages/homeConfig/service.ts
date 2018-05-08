import request, { errorProcess } from 'src/utils/request';

export default {
  /**
   * 查询配置信息
   * @param {22:底部icon ,23：启动页图片}
   */
  async queryHomeConfig(params: number) {
    return request({
      url: `/mall/api/v0.1/configs/${params}`,
      method: 'get'
    }).then(errorProcess);
  },

  /**
   * 编辑页图片
   * @param {type:post(新增：POST，修改：PUT)}
   */
  async setHomeConfig(option, type: 'put' | 'post' = 'put') {
    return request({
      url: `/mall/api/v0.1/back-end/simple-configs`,
      method: type,
      data: option
    }).then(errorProcess);
  },

  /**
   * 批量提交配置信息
   * @param {option:array}
   */
  async setHomeConfigList(option) {
    return request({
      url: `/mall/api/v0.1/back-end/simple-configs/list`,
      method: 'post',
      data: option
    }).then(errorProcess);
  },

  /**
   * banner列表
   * @param {*}
   */
  async getBannerList() {
    return request({
      url: `/mall/api/v0.1/back-end/configs/1`,
      method: 'get',
    }).then(errorProcess);
  }
};
