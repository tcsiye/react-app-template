import React from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, message, Select } from 'antd';
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
  isShowModal: carModels.isShowSeriesModal
}))
export default class AddSeriesModal extends DvaComponent
  implements BaseModalInterface {
  modelName: string = 'carModels';
  state = {
    loading: false,
    brandList: [],
    text: ''
  };
  async queryCarBrands() {
    const { data, status } = await CarService.queryCarBrands();
    if (status === 200) {
      this.setState({
        brandList: data.content
      });
    }
  }
  @Bind()
  handleOk() {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          loading: true
        });
        const param = { ...values, status: 0 };
        const { status } = await CarService.saveSeries(param);
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
      isShowSeriesModal: false
    });
  }
  componentWillMount() {
    this.queryCarBrands();
  }
  render() {
    const props = this.props;

    return (
      <Modal
        title="新增车系"
        confirmLoading={this.state.loading}
        visible={props.isShowModal}
        afterClose={this.handleAfterClose}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Form>
          <Form.Item {...itemProps} label="品牌">
            {props.form.getFieldDecorator('brandId', {
              initialValue:
                this.state.brandList.length > 0
                  ? this.state.brandList[0].id
                  : '',
              rules: [{ required: true, message: '请选择品牌' }]
            })(
              <Select showSearch  optionFilterProp="children"  >
                {this.state.brandList.map(item => (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item {...itemProps} label="车系名称">
            {props.form.getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入车系名称' }]
            })(<Input placeholder="请输入品牌名称" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
