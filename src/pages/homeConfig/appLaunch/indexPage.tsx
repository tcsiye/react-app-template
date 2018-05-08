import React from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import BaseProps from 'src/declare/baseProps';
import {
  Button,
  Input,
  Row,
  Col,
  Icon,
  Popconfirm,
  message,
  Card,
  Form,
  Tooltip,
  Upload,
  Modal
} from 'antd';
import { connect } from 'dva';
import service from '../service';
import { UploadFile } from 'antd/lib/upload/interface';
import { checkFile } from 'src/utils/utils';
import CommonService from 'src/services/commonService';

const FormItem = Form.Item;

@connect()
@(Form.create as any)()
export default class AppLuanch extends React.PureComponent<BaseProps, any> {
  state = {
    oldUrl: '',
    picUrl: '',
    payInfo: {},
    loading: false,
    upLoding: false,
    isShowPic: false
  };
  constructor(porps) {
    super(porps);

    this.initData();
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/homeConfig/appLuanch']
    });
  }

  async initData() {
    const { data } = await service.queryHomeConfig(23);
    if (data && data.content) {
      this.setState({
        picUrl: data.content.picUrl,
        oldUrl: data.content.picUrl,
        payInfo: data
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    // tslint:disable-next-line:no-console
    console.log(this.props);
    if (Object.keys(this.state.payInfo).length > 0) {
      this.state.payInfo = {
        ...this.state.payInfo,
        content: JSON.stringify({ actionUrl: '', picUrl: this.state.picUrl })
      };
      service.setHomeConfig({ ...this.state.payInfo }, 'put');
    } else {
      message.error('数据异常，请刷新后重新提交或与后台人员联系');
    }
    // tslint:disable-next-line:no-unused-expression
  }

  handleUpload = (file: UploadFile & File, FileList: UploadFile[]) => {
    checkFile({
      file,
      accept: 'image'
    }).then(() => {
      this.setState({ loading: true });
      return CommonService.fileUpload({
        data: { file }
      }).then(({ data }) => {
        this.setState({
          picUrl: data.ossUrl,
          loading: false
        });
        message.success('图片上传成功');
      });
    });

    return false;
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 8 }
      }
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 16 }
      }
    };
    return (
      <PageHeaderLayout title="APP启动页/动画配置">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="启动图片">
              <div style={{ paddingTop: '12px' }}>
                <Upload
                  action=""
                  listType="picture-card"
                  beforeUpload={this.handleUpload}
                  showUploadList={false}
                >
                  {this.state.picUrl ? (
                    <Tooltip
                      placement="rightTop"
                      title={'点击重新选择图片上传'}
                    >
                      <img
                        src={this.state.picUrl}
                        alt="启动图片"
                        style={{
                          maxWidth: '600px',
                          maxHeight: '500px'
                        }}
                      />
                    </Tooltip>
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>

              <p>注：最多上传1张图片（图片尺寸为750*1334）</p>
              <Modal
                visible={this.state.isShowPic}
                footer={null}
                onCancel={() => {
                  this.setState({ isShowPic: false });
                }}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={this.state.picUrl}
                />
              </Modal>
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
              >
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>取消</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
