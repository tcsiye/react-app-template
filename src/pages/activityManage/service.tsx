import request from 'src/utils/request';
import qs from 'qs';
import { AxiosResponse } from 'axios';

const ActivityService = {
  async querySubjectList(params): Promise<AxiosResponse<SubjectBean[]>> {
    return request({
      method: 'get',
      url: `/mall/api/v0.1/back-end/subject-page-groups`,
    });
  }
};
export default ActivityService;

export interface SubjectBean {
  id: number;
  name: string;
  type?: any;
  status: number;
  subjectPageDTOS?: any;
  browsingUrl?: string;
  shareable?: number;
  shareTitle?: string;
  shareSubtitle?: string;
  shareIconUrl?: string;
}
