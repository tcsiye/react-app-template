import React from 'react';
import BaseProps from 'src/declare/baseProps';
import { Icon, Upload, message } from 'antd';
import styles from './editorTool.less';
import { UploadFile } from 'antd/lib/upload/interface';
import { checkFile } from 'src/utils/utils';
import CommonService from 'src/services/commonService';

export default class EditorTool extends React.Component<BaseProps> {
  beforeUpload = (
    file: UploadFile & File,
    FileList: UploadFile[]
  ): boolean => {
    const { size, width, height, onChange } = this.props;
    checkFile({
      file,
      size: size || 2084,
      width: width || null,
      height: height || null,
      accept: 'image'
    }).then(() => {
      this.setState({
        loading: true
      });
      return CommonService.fileUpload({
        data: { file }
      }).then(({ data, status }) => {
        this.setState({
          loading: false
        });
        if (status === 200) {
          message.success('图片上传成功');
          if (onChange) {
            onChange(data.url);
          }
        } else {
          message.error('上传失败，请重新选择图片上传');
        }
      });
    });
    return false;
  }
  render() {
    return (
      <div className={styles.btns}>
          <div className={styles['btn-item']}>
            <Upload beforeUpload={this.beforeUpload} showUploadList={false}>
              <Icon type="edit" />
            </Upload>
          </div>
          <div className={styles['btn-item']}>
            <Icon type="delete" />
          </div>
        </div>
    );
  }
}