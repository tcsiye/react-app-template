import request, { errorProcess } from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';

const BranchComService = {
  async queryCompaniesList(): Promise<AxiosResponse<any[]>> {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/companies`,
    }).then(errorProcess);
  },
  async saveCompanies(data): Promise<AxiosResponse<any>> {
    return request({
      data,
      method: data.id ? 'put' : 'post',
      url: `/mall/api/v0.1/back-end/companies`,
    }).then(errorProcess);
  },
  async removeCompanies(id) {
    return request({
      method: 'delete',
      url: `/mall/api/v0.1/back-end/companies/${id}`,
    }).then(errorProcess);
  },
  async queryErpAreaList() {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/car-area-erps/back-end/erp-area-list`,
    }).then(errorProcess);
  }
};
export default BranchComService;
