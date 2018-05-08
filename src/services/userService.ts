import request, { errorProcess } from 'src/utils/request';

export default {
  login(data) {
    return request({
      data,
      method: 'post',
      url: '/api/authenticate',
    }).then(errorProcess);
  },
};
