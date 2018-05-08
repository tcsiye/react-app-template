import React, { Component } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import BaseModel from 'src/declare/baseModel';
import { join } from 'path';
import { Input, Button, Upload, Tooltip, Icon, message } from 'antd';
import _ from 'lodash';
import { UploadFile } from 'antd/lib/upload/interface';
import { checkFile } from 'src/utils/utils';
import CommonService from 'src/services/commonService';

export interface UploadImagePops {
  style?: React.CSSProperties;
  onChange?: Function;
  size?: number;
  width?: number;
  height?: number;
  value?: string;
  reminder?: string;
  tipTitle?: string;
}

@connect()
class UploadImg extends Component<UploadImagePops> {
  static defaultProps: UploadImagePops = {
    tipTitle: '点击上传图片'
  };
  state = {
    loading: false,
  };
  constructor(props) {
    super(props);
  }
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
          // this.setState({ picUrl: data.ossUrl });
          if (onChange) {
            onChange(data.ossUrl);
          }
        } else {
          message.error('上传失败，请重新选择图片上传');
        }
      });
    });

    return false;
  }

  render() {
    const uploadButton = (
      <div style={{ minHeight: '80px', padding: '20px 0' }}>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

    const { style, value, reminder } = this.props;

    return (
      <Upload
        action=""
        style={{ margin: '0' }}
        listType="picture-card"
        showUploadList={false}
        beforeUpload={(file: any, fileList) =>
          this.beforeUpload(file, fileList)
        }

      >
        <Tooltip placement="rightTop" title={this.props.tipTitle}>
          {value ? (
            <img
              src={value}
              alt=""
              title="(图片格式:*，不超过1M)"
              className={styles.imgSize}
              style={style}
            />
          ) : (
            uploadButton
          )}
        </Tooltip>
      </Upload >
    );
  }
}

export default UploadImg;
