import request from 'src/utils/request';

interface FileUploadOption {
  url?: string;
  data: any;
  headers?: any;
}

const CommonService = {
  fileUpload({ url = '/api/v0.2/upload/img', data = {} , headers = {} }: FileUploadOption) {
    const form = new FormData();
    Object.keys(data).map(key => {
      form.append(key, data[key]);
    });
    return request({
      url,
      headers,
      data: form,
      method: 'post',
    });
  },
  fileUpload2({ url = '/api/v0.1/upload/img', data = {} , headers = {} }: FileUploadOption) {
    const form = new FormData();
    Object.keys(data).map(key => {
      form.append(key, data[key]);
    });
    return request({
      url,
      headers,
      data: form,
      method: 'post',
    });
  },
};
export default CommonService;
