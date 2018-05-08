import request, { errorProcess } from 'src/utils/request';

const tagetService = {
  /**
   * 查询热门标签列表
   * @param {*}
   */
  async queryHotTagList(option: any) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/tags`,
      params: option
    }).then(errorProcess);
  },

  /**
   * id查询热门标签
   * @param {*}
   */
  async queryTagForId(params: number | string) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/tags/${params}`
    }).then(errorProcess);
  },

  /**
   * 添加热门标签
   * @param {*}
   */
  async addHotTag(option: any) {
    return request({
      method: 'put',
      url: `mall/api/v0.1/back-end/tags`,
      data: option
    }).then(errorProcess);
  },

  /**
   * 删除热门标签
   * @param {*}
   */
  async delHotTag(id: number) {
    return request({ method: 'delete', url: `/mall/api/v0.1/tags/${id}` }).then(
      errorProcess
    );
  },

  /**
   * 编辑热门标签
   * @param {*}
   */
  async editHotTag(params) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/car-items/all-provinces?${qs.stringify(
        params
      )}`
    }).then(errorProcess);
  },

  /**
   * 查询关联车辆
   * @param {*}
   */
  async queryRelevanCar(option) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/car-items`,
      params: option
    }).then(errorProcess);
  },
  /**
   * 查询关联车辆
   * @param {*}
   */
  async queryCarTypeforName(option) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/car-items/tags`,
      params: option
    }).then(errorProcess);
  }
};

export default tagetService;
