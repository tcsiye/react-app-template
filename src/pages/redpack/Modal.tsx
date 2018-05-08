import React from 'react';
import { Modal, Form, Input, message, DatePicker, Switch, Upload, Icon, InputNumber } from 'antd';
import BaseProps, { BaseModalProps } from '../../declare/baseProps.d';
import RedpackService from './service';
import moment from 'moment';
import CommonService from 'src/services/commonService';
import { checkFile } from 'src/utils/utils';
import { UploadFile } from 'antd/lib/upload/interface';
const FormItem = Form.Item;
interface FormData {
  id: number;
  title: string;
  amount: number;
  description: string;
  status: number;
  type: number;
  name: string;
  gmtCreate: string;
  gmtUpdate: string;
  image: string;
  limitAmount: number;
  shareAmount: number;
  beginValidTime: Date;
  endValidTime: Date;
  beginActivityTime: Date;
  endActivityTime: Date;
  redPacketUrl: string;
  redPacketSourceUrl: string;
  canPayOrder: number;
  inValidTime: boolean;
  validTime?: moment.Moment[];
  activityTime?: moment.Moment[];
}
const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
@(Form.create as any)()
export default class RedpackModal extends React.PureComponent<BaseModalProps & {editid: number}> {
  state = {
    loading: false,
    imageUrl: undefined,
    formData: {}  as FormData
  };
  handleCancel = () => {
    this.props.onCancel();
    setTimeout(() => {
      this.setState({
        formData: {},
        imageUrl: undefined
      });
      this.props.form.resetFields();
    }, 1);
  }
  handleOk = () => {
    this.props.form.validateFields({ force: true }, async (err, values: FormData) => {
      if (!err) {
        this.setState({
          loading: true
        });
        let params = { ...values };
        params.beginValidTime = params.validTime[0].toDate();
        params.endValidTime = params.validTime[1].toDate();
        params.beginActivityTime = params.activityTime[0].toDate();
        params.endActivityTime = params.activityTime[1].toDate();
        params.status = params.status ? 1 : 2;
        params.canPayOrder = params.canPayOrder ? 1 : 0;
        delete params.validTime;
        delete params.activityTime;
        // // tslint:disable-next-line:no-console
        // console.log(params);
        params = { ...this.state.formData, ...params };
        const { data, status } = await RedpackService.save(params);
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.editid && nextProps.editid !== this.props.editid) {
      RedpackService.queryById(nextProps.editid).then(({ data, status }) => {
        if (status === 200) {
          this.setState({
            formData: data
          }, () => {
            this.setState({
              imageUrl: this.state.formData.image
            });
          });
        }
      });
    }
  }
  render() {

    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div  >
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
       </div>
    );
    const { formData } =  this.state;
    let validTime: moment.Moment[] = [];
    let activityTime: moment.Moment[] = [];
    if (formData.beginValidTime) {
      validTime = [
        moment(formData.beginValidTime),
        moment(formData.endValidTime)
      ];
    }
    if (formData.beginActivityTime) {
      activityTime = [
        moment(formData.beginActivityTime),
        moment(formData.endActivityTime)
      ];
    }
    return (
      <Modal
        visible={this.props.isShowModal}
        confirmLoading={this.state.loading}
        width={600}
        title={this.props.editid ? '编辑红包' : '新增红包'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem {...itemProps} label="红包标题">
            {getFieldDecorator('title', {
              initialValue: formData.title,
              rules: [{ required: true, message: '请输入红包标题' }]
            })(<Input placeholder="请输入红包标题" />)}
          </FormItem>
          <FormItem {...itemProps} label="参加活动立得">
            {getFieldDecorator('amount', {
              initialValue: formData.amount,
              rules: [{ required: true, message: '请输入红包金额[分]' }]
            })(<InputNumber placeholder="红包金额[分]" style={{ width: '120px' }} min={0}  />)}
          </FormItem>
          <FormItem {...itemProps} label="成功邀请好友获得">
            {getFieldDecorator('shareAmount', {
              initialValue: formData.shareAmount,
              rules: [{ required: true, message: '请输入红包金额[分]' }]
            })(<InputNumber placeholder="红包金额[分]"  style={{ width: '120px' }} min={0}  />)}
          </FormItem>
          <FormItem {...itemProps} label="封顶金额">
            {getFieldDecorator('limitAmount', {
              initialValue: formData.limitAmount,
              rules: [{ required: true, message: '请输入红包金额[分]' }]
            })(<InputNumber placeholder="红包金额[分]"  style={{ width: '120px' }} min={0} />)}
          </FormItem>
          <FormItem {...itemProps} label="红包使用期限">
            {getFieldDecorator('validTime', {
              initialValue: validTime,
              rules: [{ required: true, message: '请输入红包使用期限' }]
            })(<DatePicker.RangePicker    />)}
          </FormItem>
          <FormItem {...itemProps} label="红包活动期限">
            {getFieldDecorator('activityTime', {
              initialValue: activityTime,
              rules: [{ required: true, message: '请输入红包活动期限' }]
            })(<DatePicker.RangePicker  />)}
          </FormItem>
          <FormItem
                {...itemProps}
                label="红包图片"
          >
              {
                getFieldDecorator('image', {
                  rules: [{ required: true, message: '请上传红包图片' }],
                  initialValue: formData.image
                })(
                <Input type="hidden"   placeholder="请输入分公司名称" />
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
                <img src={this.state.imageUrl} alt="" style={{ width: '100px' }}  /> : uploadButton}

                </Upload>

                {/* <span style={{ Color: '#999', paddingLeft: '10px' }}>(图片格式：图片尺寸166*166，大小不超过1M) </span> */}
          </FormItem>
          <FormItem {...itemProps} label="使用条件">
            {getFieldDecorator('description', {
              initialValue: formData.description,
              rules: [{ required: true, message: '请输入使用条件' }]
            })(<Input.TextArea placeholder="请输入使用条件" />)}
          </FormItem>
          <FormItem {...itemProps} label="弹层链接地址">
            {getFieldDecorator('redPacketSourceUrl', {
              initialValue: formData.redPacketSourceUrl,
              rules: [{ required: true, message: '请输入本次退款金额' }]
            })(<Input placeholder="请输入本次退款金额" />)}
          </FormItem>
          <FormItem {...itemProps} label="状态">
            {getFieldDecorator('status', {
              initialValue: formData.status === 1 ? true : false,
              valuePropName: 'checked',
              // rules: [{ required: true }]
            })(<Switch checkedChildren="激活" unCheckedChildren="禁用"  />)}
          </FormItem>
          <FormItem {...itemProps} label="是否下单时可用">
            {getFieldDecorator('canPayOrder', {
              initialValue: formData.canPayOrder ? true : false,
              valuePropName: 'checked',
              // rules: [{ required: true,  }]
            })(<Switch checkedChildren="可用" unCheckedChildren="不可用"  />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
