import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, message } from 'antd';
import BaseProps from '../../../declare/baseProps.d';
import { DvaComponent } from 'src/components/base/DvaComponent';
import UploadImg from '../../../components/UploadImg';
import BaseModalInterface from '../../../components/base/BaseModalInterface';
import { Bind } from 'lodash-decorators/bind';
import CarService from '../service';

const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
@(Form.create as any)()
@connect(({ carModels }) => ({
  isShowModal: carModels.isShowBrandsModal
}))
export default class AddBrandsModal extends DvaComponent
  implements BaseModalInterface {
  modelName: string = 'carModels';
  state = {
    loading: false
  };
  @Bind()
  handleOk() {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          loading: true
        });
        const param = { ...values, status: 0 };
        const { status } = await CarService.saveBrands(param);
        this.setState({
          loading: false
        });
        if (status === 201) {
          message.success('添加成功');
          this.handleCancel();
        }
      }
    });
  }
  @Bind()
  handleCancel() {
    this.setDvaState({
      isShowBrandsModal: false
    });
  }

  render() {
    const props = this.props;

    return (
      <Modal
        title="新增品牌"
        confirmLoading={this.state.loading}
        visible={props.isShowModal}
        afterClose={this.handleAfterClose}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <Form.Item {...itemProps} label="品牌图标">
            {props.form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入品牌名称' }]
            })(<Input placeholder="请输入品牌名称" />)}
          </Form.Item>
          <Form.Item {...itemProps} label="品牌图标">
            {props.form.getFieldDecorator('icon', {
              rules: [{ required: true, message: '请上传品牌图标' }]
            })(<UploadImg />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
