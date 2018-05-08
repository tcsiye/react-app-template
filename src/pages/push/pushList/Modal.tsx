import React from 'react';
import { Modal, Form, Input, message, DatePicker, Switch, Upload, Icon, InputNumber, Radio } from 'antd';
import BaseProps, { BaseModalProps } from 'src/declare/baseProps';
import PushService from './service';
import moment from 'moment';
import CommonService from 'src/services/commonService';
import { checkFile } from 'src/utils/utils';
import { UploadFile } from 'antd/lib/upload/interface';
import _ from 'lodash';
const FormItem = Form.Item;

const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
@(Form.create as any)()
export default class PushModal extends React.Component<BaseModalProps & {editid: number}> {
  state = {
    loading: false,
    imageUrl: undefined,
    formData: {
      messageDTO: {} as any
    }  as any
  };
  handleCancel = () => {
    this.props.onCancel();
    setTimeout(() => {
      this.setState({
        formData: {
          messageDTO: {}
        },
        imageUrl: undefined
      }, () => {
        this.props.form.resetFields();
      });

    }, 1);
  }
  handleOk = () => {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          loading: true
        });
        let params = { ...values };

        // // tslint:disable-next-line:no-console
        // console.log(params);
        params = { ...this.state.formData, ...params };
        const { data, status } = await PushService.save(params);
        if (status === 200 || status === 201) {
          message.success('保存成功');
          this.handleCancel();
        }
        this.setState({
          loading: false,
        });
      }
    });
  }
  handleBefore = (file: UploadFile & File, FileList: UploadFile[]) => {
    checkFile({
      file,
      accept: 'image'
    }).then(() => {
      this.setState({ loading: true });
      return CommonService.fileUpload({
        data: { file }
      }).then(({ data }) => {
        this.setState({
          imageUrl: data.ossUrl,
          loading: false,
        });
        this.props.form.setFieldsValue({
          image: data.ossUrl
        });
        message.success('图片上传成功');
      });
    });
    return false;
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   // tslint:disable-next-line:no-console
  //   return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
  // }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editid) {
      PushService.queryById(nextProps.editid).then(({ data, status }) => {
        if (status === 200) {
          this.setState({
            formData: data
          }, () => {
            this.setState({
              imageUrl: this.state.formData.messageDTO.picUrl
            });
          });
        }
      });
    }
  }
  render() {

    // tslint:disable-next-line:no-console
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div style={{ width: '300px', height: '116px', lineHeight: '50px' }} >
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
       </div>
    );
    const { formData } =  this.state;
    return (
      <Modal
        visible={this.props.isShowModal}
        confirmLoading={this.state.loading}
        width={600}
        title={this.props.editid ? '编辑推送' : '编辑推送'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem {...itemProps} label="推送标题">
            {getFieldDecorator('title', {
              initialValue: formData.messageDTO.title,
              rules: [{ required: true, message: '请输入推送标题' }]
            })(<Input placeholder="请输入推送标题" />)}
          </FormItem>
          <FormItem {...itemProps} label="推送副标题">
            {getFieldDecorator('subTitle', {
              initialValue: formData.messageDTO.subTitle,
              rules: [{ required: true, message: '请输入推送副标题' }]
            })(<Input placeholder="请输入推送副标题" />)}
          </FormItem>

          <FormItem
                {...itemProps}
                label="封面"
          >
              {
                getFieldDecorator('picUrl', {
                  rules: [{ required: true, message: '请上传封面' }],
                  initialValue: formData.messageDTO.picUrl
                })(
                <Input type="hidden"    />
                )
              }
                <Upload
                  action=""
                  beforeUpload={this.handleBefore}
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}

                >
                {this.state.imageUrl ?
                <img src={this.state.imageUrl} alt="" style={{ width: '300px' }}  /> : uploadButton}

                </Upload>

                {/* <span style={{ Color: '#999', paddingLeft: '10px' }}>(图片格式：图片尺寸166*166，大小不超过1M) </span> */}
          </FormItem>
          <FormItem {...itemProps} label="推送URL">
           {}
          </FormItem>
          <FormItem {...itemProps} label="原生URL">
            {getFieldDecorator('originUrl', {
              initialValue: formData.messageDTO.originUrl,
              rules: [{ required: true, message: '请输入原生URL' }]
            })(<Input placeholder="请输入原生URL" />)}
          </FormItem>
          <FormItem {...itemProps} label="推送对象">
            {getFieldDecorator('pushObjectType', {
              initialValue: formData.pushObjectType ? formData.pushObjectType : 0,
              // rules: [{ required: true, message: '请输入本次退款金额' }]
            })(<Radio.Group>
              <Radio value={0}>全部用户</Radio>
              <Radio value={1} disabled >指定标签</Radio>
              <Radio value={2} disabled >指定regID</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem {...itemProps} label="推送方式">
            {getFieldDecorator('sendTimeType', {
              initialValue: formData.sendTimeType ? formData.sendTimeType : 0,
              // rules: [{ required: true, message: '请输入本次退款金额' }]
            })(
              <Radio.Group
                // onChange={(e) => {
                //   // tslint:disable-next-line:no-console
                //   console.log(e);
                //   this.setState({ formData: { ...this.state.formData, sendTimeType: e.target.value } });
                // }
                // }
              >
              <Radio value={0} >立即推送</Radio>
              <Radio value={1} >定时推送（最远可以设置30天内做为推送时间）</Radio>
              </Radio.Group>
            )}
          </FormItem>
         {
          // tslint:disable-next-line:no-console
          !this.props.form.getFieldValue('sendTimeType') ? null :
          <FormItem {...itemProps} label="推送时间">
            {getFieldDecorator('sendTime', {
              // initialValue: ,
              // rules: [{ required: true, message: '请输入本次退款金额' }]
            })(<DatePicker />)}
          </FormItem>}
        </Form>
      </Modal >
    );
  }
}
