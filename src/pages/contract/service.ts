import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';

const contractService = {
  /**
   * 获取合同列表
   * @param {*}
   */
  async getContractLists(params) {
    return request({
      params,
      method: 'get',
      url: '/contract/api/v0.1/contract-templates',
    }).then(errorProcess);
  },
  /**
   * 获取合同版本列表
   * @param {*}
   */
  async getVersionLists() {
    return request({
      method: 'get',
      url: '/contract/api/v0.1/contract-template-versions',
    }).then(errorProcess);
  },
  /**
   * 获取隶属公司列表
   * @param {*}
   */
  async getCompanyLists() {
    return request({
      method: 'get',
      url: '/mall/api/v0.1/back-end/companies/simple',
    }).then(errorProcess);
  },
  /**
   * 新增或编辑合同信息
   * @param {id, data}
   */
  async updatedContract(data) {
    const url = `/contract/api/v0.1/contract-templates`;
    return request({
      url,
      data,
      method: data.id ? 'put' : 'post'
    }).then(errorProcess);
  },
  /**
   * 获取合同信息
   * @param {id}
   */
  async getContractData(id) {
    const url = `/contract/api/v0.1/contract-templates/${id}`;
    return request({
      url,
      method: 'get'
    }).then(errorProcess);
  },
  /**
   * 上传合同模板
   * @param {templateId, file}
   */
  async uploadContract(params) {
    const url = `/contract/api/v0.1/contract-management/upload`;
    return request({
      url,
      params,
      method: 'post'
    }).then(errorProcess);
  },
  /**
   * 上传文件
   * @param {*}
   */
  async upload(data) {
    const url = `/api/v0.1/upload/cms`;
    return request({
      url,
      data,
      method: 'post'
    }).then(errorProcess);
  },
  /**
   * 获取套件列表
   * @param {*}
   */
  async getSuitsLists(params) {
    return request({
      params,
      url: '/contract/api/v0.1/contract-template-suites',
      method: 'get'
    }).then(errorProcess);
  },
  /**
   * 获取套件合同列表
   * @param {*}
   */
  async getContractVersion(id = null) {
    return request({
      url: `/contract/api/v0.1/contract-template-suites${id ? '/' + id : ''}`,
      method: 'get'
    }).then(errorProcess);
  },
  /**
   * 编辑套件信息
   * @param {*}
   */
  async editSuitLists(data) {
    return request({
      data,
      url: `/contract/api/v0.1/contract-template-suites`,
      method: data.id ? 'put' : 'post'
    }).then(errorProcess);
  },
  /**
   * 关联渠道-获取所有渠道
   * @param {*}
   */
  async getJoinChannel(id = null) {
    return request({
      url: `/usercenter/api/v0.1/organization/contract-template-suite/organizations/${id}`,
      method: 'get'
    }).then(errorProcess);
  },
  /**
   * 关联渠道-获取渠道树
   */
  async getChannelTree(typeId = 1) {
    return request({
      url: `/usercenter/api/v0.1/organizations/tree-list/type/${typeId}`,
      method: 'get'
    }).then(errorProcess);
  },
  /**
   * 关联渠道-设置关联渠道
   */
  async joinChannelSuit(data) {
    return request({
      data,
      url: `/usercenter/api/v0.1/organization/contract-template-suite`,
      method: 'post'
    }).then(errorProcess);
  }
};
export default contractService;