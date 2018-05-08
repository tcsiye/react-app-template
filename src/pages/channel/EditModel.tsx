import React from 'react';
import { Modal, Form, Input, message, DatePicker } from 'antd';
import BaseProps from '../../declare/baseProps.d';
import RolesService from './service';
import moment from 'moment';
const FormItem = Form.Item;
interface EditModalProps extends BaseProps {
  isShowModal: boolean;
  data: {name: string, id: number};
  onCancel: Function;
  onOk: Function;
}
const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
@(Form.create as any)()
export default class EditModal extends React.PureComponent<EditModalProps> {
  state = {
    loading: false
  };
  handleCancel = () => {
    this.props.onCancel();
    setTimeout(() => {
      this.props.form.resetFields();
    }, 1);
  }
  handleOk = () => {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          loading: true
        });

        if (this.props.data) {
          const param = {
            name: values.name,
            id: this.props.data.id
          };
          const { data, status } = await RolesService.editRoles(param);
          if (status === 200) {
            this.props.onOk();
            message.success('角色编辑成功！');

          } else {
            message.error('角色编辑失败！');
          }
        } else {
          const { data, status } = await RolesService.addRoles(values);
          // tslint:disable-next-line:no-console
          console.log(status);
          if (status === 201) {
            this.props.onOk();
            message.success('角色添加成功！');

          } else {
            message.error('角色添加失败！');
          }
        }

        this.setState({
          loading: false,
        });

        setTimeout(() => {
          this.props.form.resetFields();
        }, 1);
      }
    });
  }
  render() {

    const { getFieldDecorator } = this.props.form;
    const { name } = this.props.data || { name: '' };
    return (
      <Modal
        visible={this.props.isShowModal}
        confirmLoading={this.state.loading}
        width={600}
        title={this.props.data ? '编辑角色' : '添加角色'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <FormItem {...itemProps} label="角色类型">
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入角色类型' }]
            })(<Input placeholder="请输入角色类型" />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
