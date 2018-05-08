import request from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';

const RolesService = {
  /**
   * 获取所有角色
   * @param {name}
   */
  async queryRoles(params) {
    return request({
      params,
      method: `get`,
      url: `/usercenter/api/v0.1/roles/all-list`,
    });
  },
  /**
   *
   * @param {id, name}
   */
  async editRoles(data) {
    return request({
      data,
      method: `put`,
      url: `/usercenter/api/v0.1/roles`,
    });
  },
  /**
   *
   * @param id
   */
  async deleteRoles(id) {
    return request({
      method: `delete`,
      url: `/usercenter/api/v0.1/roles/${id}`,
    });
  },
  /**
   *
   * @param id
   */
  async addRoles(data) {
    return request({
      data,
      method: `post`,
      url: `/usercenter/api/v0.1/roles`,
    });
  },
  /**
   *
   * @param id
   */
  async getAuthOfRole(id) {
    return request({
      method: `get`,
      url: `/usercenter/api/v0.1/role-authorities/role/${id}`,
    });
  },
  /**
   *
   * @param {}
   */
  async getAuthList() {
    return request({
      method: `get`,
      url: `/usercenter/api/v0.1/authorities/all-list`,
    });
  },
  /**
   *
   * @param {bindAuthorityList, roleId, unBindAuthorityList}
   */
  async editAuthList(data) {
    return request({
      data,
      method: `post`,
      url: `/usercenter/api/v0.1/role-authorities/bind`,
    });
  }
};
export default RolesService;
