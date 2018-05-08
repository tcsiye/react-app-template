import React from 'react';
import { Modal, Form, Input, message, DatePicker, Switch, Upload,
   Icon, InputNumber, Select, Button, Checkbox, Row, Spin } from 'antd';
import BaseProps, { BaseModalProps } from 'src/declare/baseProps';
import ContractService from '../service';
import styles from './indexPage.less';
import { UploadFile } from 'antd/lib/upload/interface';
const FormItem = Form.Item;
const Option = Select.Option;
const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
interface FormData {
  title: string;
  remark: string;
  bindContractTemplates: number[];
}
interface VersionLists {
  label: number;
  title: string;
}
@(Form.create as any)()
export default class AddContractModal extends React.Component<BaseModalProps & {editid: number}> {
  state = {
    loading: false,
    modelLoading: false,
    formData: {} as FormData
  };
  handleOk = async () => {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          modelLoading: true
        });
        let params = { ...values };
        params = { ...this.state.formData, ...params };
        const { data, status } = await ContractService.editSuitLists(params);
        if (status === 200 || status === 201) {
          message.success('操作成功!');
          this.handleCancel();
          this.props.reload();
        }
        this.setState({
          modelLoading: false,
        });
      }
    });
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  handleAfterClose = () => {
    this.props.form.resetFields();
    this.setState({
      formData: {} as FormData
    });
  }
  async componentWillReceiveProps(nextProps: BaseModalProps) {
    if (nextProps.isShowModal && nextProps.isShowModal !== this.props.isShowModal && nextProps.editid) {
      this.setState({
        loading: true,
      });
      const { data, status } = await ContractService.getContractVersion(nextProps.editid);
      if (status === 200) {
        data.bindContractTemplates = data.bindContractTemplates.map(item => {
          return item.first;
        });
        this.setState({
          formData: data
        });
      }
      this.setState({
        loading: false,
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { formData, loading, modelLoading } =  this.state;
    return (
      <Modal
          visible={this.props.isShowModal}
          width={600}
          confirmLoading={modelLoading}
          title={this.props.editid ? '编辑合同' : '新增合同'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          afterClose={this.handleAfterClose}
      >
        <Spin size="large" spinning={loading}>
          <Form>
            <FormItem label="套件标题" {...itemProps}>
              {getFieldDecorator('title', {
                initialValue: formData.title,
                rules: [{ required: true, message: '请选择套件标题' }]
              })(<Input placeholder="请输入套件标题"/>
                )}</FormItem>
              <FormItem label="关联合同" {...itemProps}>
              {getFieldDecorator('bindContractTemplates', {
                initialValue: formData.bindContractTemplates,
                rules: [{ type: 'array', required: true, message: '至少选择一个合同' }]
              })(
                  <Checkbox.Group options={this.props.versionLists}/>
                )}
              </FormItem>
              <FormItem label="套件说明" {...itemProps}>
              {getFieldDecorator('remark', {
                initialValue: formData.remark,
                rules: [{ required: true, message: '请填写套件说明' }]
              })(<Input placeholder="请填写套件说明"/>
                )}</FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}