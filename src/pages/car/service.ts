import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';
interface RootObject {
  id: number;
  content: Content;
  type: number;
  status: number;
  info: string;
  moduleImgUrl?: any;
  display?: any;
  sort?: any;
}

interface Content {
  keyword: string[];
}
const CarService = {
  /**
   * 获取所有sku省份
   * @param {*}
   */
  async querySkuProvinces() {
    return request({
      method: 'get',
      url: '/mall/api/v0.1/back-end/car-items/all-provinces'
    }).then(errorProcess);
  },
  /**
   * 获取所有车辆
   * @param {*}
   */
  async queryCarItems(params) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/car-items?${qs.stringify(params)}`
    }).then(errorProcess);
  },
  /**
   * 根据条件获取车型
   * @param {*}
   */
  async queryCarTypesParams(params, data) {
    return request({
      data,
      method: 'post',
      url: `/mall/api/v0.1/back-end/car-types/params?${qs.stringify(params)}`
    }).then(errorProcess);
  },
  /**
   * 获取品牌列表
   * @param {*}
   */
  async queryCarBrands() {
    return request({
      method: 'get',
      url: '/mall/api/v0.1/back-end/car-brands'
    }).then(errorProcess);
  },
  /**
   * 获取车系
   * @param {*}
   */
  async queryCarSeries(brands) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/car-brands/${brands}/car-series`
    }).then(errorProcess);
  },
  /**
   * 获取车型
   * @param {*}
   */
  async queryCarType(series) {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/car-series/${series}/type`
    }).then(errorProcess);
  },
  /**
   * 编辑品牌
   * @param {*}
   */
  async saveBrands(data) {
    return request({
      data,
      method: 'post',
      url: `/mall/api/v0.1/back-end/car-brands`
    }).then(errorProcess);
  },
  /**
   * 新增车系
   * @param {*}
   */
  async saveSeries(data) {
    return request({
      data,
      method: 'post',
      url: `/mall/api/v0.1/back-end/car-series`
    }).then(errorProcess);
  },
  /**
   * 新增车型
   * @param {*}
   */
  async saveCarType(data) {
    return request({
      data,
      method: 'post',
      url: `/mall/api/v0.1/back-end/car-types`
    }).then(errorProcess);
  },
  /**
   * 切换车型状态
   * @param {*}
   */
  async switchCarTypeStatus(params: { id: number; status: number }) {
    return request({
      params,
      method: 'put',
      url: `/mall/api/v0.1/back-end/car-types/status`
    }).then(errorProcess);
  }
};
export default CarService;
