import { message } from 'antd';
import { AxiosResponse } from 'axios';
// tslint:disable-next-line:max-line-length
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path: string) {
  return reg.test(path);
}

interface CheckFileOption {
  length?: number;
  width?: number;
  height?: number;
  file?: File;
  accept?: any;
  size?: number;
}

export function checkFile({ length, width, height, file, accept, size }: CheckFileOption) {
  if (!file) {
    message.error('file 不存在!');
    return new Promise((resolve, reject) => {reject(); });
  }
  if (size && file.size > size * size) {
    message.warning('文件超出大小!');
    return new Promise((resolve, reject) => {reject(); });
  }
  const _w = width;
  const _h = height;
  /** 上传图片 */
  if (file.type.indexOf('image') !== -1) {
    return new Promise((resolve, reject) => {
      const img = new Image;
      img.onload = () => {
         /** 验证宽度 */
        if (_w && _h && (img.width !== _w || img.height !== _h)) {
          message.error(`图片大小为 ${_w} * ${_h} !`);
          reject();
        } else {
          resolve(img.src);
        }
      };
      img.onerror = () => {
        reject();
      };
      img.src = window.URL.createObjectURL(file);
    });
  }
  /** 验证文件类型 */
  if (accept && (!(accept instanceof Array)) && file.type.indexOf(accept) === -1) {
    message.error(`文件类型错误，请选择${accept}格式的文件!`);
    return new Promise((resolve, reject) => {reject(); });
  // tslint:disable-next-line:no-else-after-return
  } else if (accept && accept instanceof Array) {
    const str = file.name;
    const i = str.lastIndexOf('.');
    const  len = str.length;
    const  hz = str.substring(i + 1, len);
    const  flag = false;
    if (accept.filter(type => type === hz).length === 0) {
      message.error(`文件类型错误，请选择${accept.join('/')}格式的文件!`);
      return new Promise((resolve, reject) => {reject(); });
    }
  }
  return new Promise((resolve, reject) => { resolve(); });

}
