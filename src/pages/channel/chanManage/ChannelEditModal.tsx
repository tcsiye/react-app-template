import React, { Fragment } from 'react';
import BaseProps, { BaseModalProps } from 'src/declare/baseProps.d';
import { Modal, Form, Input, Select, Row, Divider, message, Checkbox } from 'antd';
import CarJoinModal from './CarJoinModal';
import ChannelService from './service';
const FormItem = Form.Item;
const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
const levelNums = ['1', '2', '3', '4', '5', '6'];
const plainOptions = [{ label: '线上支付', value: '1' }, { label: '线下支付', value: '2' }];
@(Form.create as any)()
export default class ChannelEditModal extends React.Component<
  BaseModalProps & { formData: any; channelId: string }
> {
  state = {
    isShowModal: false,
    isShowPayTypeModal: false,
    oldbindCarItemList: [],
    bindCarItemList: [],
    loading: false
  };
  handleCancelJoin = () => {
    this.setState({
      isShowModal: false
    });
  };
  handleOkJoin = (targetKeys: any[]) => {
    this.setState({
      bindCarItemList: targetKeys
    });
  };
  handleJoin = () => {
    this.setState({
      isShowModal: true
    });
  };
  handleCancel = (e?) => {
    this.props.onCancel();
    setTimeout(() => {
      this.props.form.resetFields();
      this.setState({
        bindCarItemList: [],
        oldbindCarItemList: []
      });
    }, 1);
  };
  handleOk = e => {
    //
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.setState({
          loading: false
        });
        const params = { ...values };
        if (this.props.formData.id) {
          params.id = this.props.formData.id;
        }
        // tslint:disable-next-line:no-console
        console.log(this.state);

        params.bindCarItemList = this.state.bindCarItemList;
        // params.payType = 1;
        if (params.payType.length === 2) {
          params.payType = 3;
        } else {
          params.payType = params.payType[0];
        }
        params.unbindCarItemList = this.state.oldbindCarItemList.filter(item =>
          this.state.bindCarItemList.indexOf(item) < 0
        );

        ChannelService.saveOrganization(params).then(({ data, status }) => {
          this.setState({
            loading: true
          });
          if (status === 200 || status === 201) {
            message.success('操作成功');
            this.props.onOk();
            this.handleCancel();
          }
        });
      }
    });
  };
  async queryOrganizationCars(id) {
    const { data, status } = await ChannelService.queryOrganizationCars(id);
    if (status === 200) {
      const bindCarItemList = data.map(item => item.carItemId);
      this.setState({
        bindCarItemList,
        oldbindCarItemList: [...bindCarItemList]
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.isShowModal &&
      nextProps.isShowModal !== this.props.isShowModal
    ) {
      // tslint:disable-next-line:no-console
      if (nextProps.formData.id) {
        this.queryOrganizationCars(nextProps.formData.id);
      }
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let payType = ['1'];
    switch (this.props.formData.payType) {
      case 1:
        payType = ['1'];
        break;
      case 2:
        payType = ['2'];
        break;
      case 3:
        payType = ['1', '2'];
        break;
      default:
        payType = ['1'];
        break;
    }
    return (
      <Modal
        visible={this.props.isShowModal}
        title={this.props.formData.levelNum ? '编辑' : '新增'}
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >
        <Form>
          <FormItem {...itemProps} label="渠道名">
            {getFieldDecorator('name', {
              initialValue: this.props.formData.name,
              rules: [{ required: true, message: '请输入渠道名' }]
            })(<Input placeholder="请输入渠道名" />)}
          </FormItem>
          <FormItem {...itemProps} label="类型">
            {getFieldDecorator('typeStr', {
              initialValue: '1',
              rules: [{ required: true, message: '请选择类型' }]
            })(
              <Select>
                <Select.Option value="1">销售</Select.Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...itemProps} label="渠道层级数">
            {getFieldDecorator('levelNum', {
              initialValue: this.props.formData.levelNum
                ? this.props.formData.levelNum
                : '2',
              rules: [{ required: true, message: '请选择类型' }]
            })(
              <Select>
                {levelNums.map(item => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <Row style={{ marginLeft: 100 }}>
            <a href="JavaScript:void(0)" onClick={() => this.handleJoin()}>
              关联车辆
            </a>
            <Divider type="vertical" />
            <a href="JavaScript:void(0)" onClick={() => this.setState({ isShowPayTypeModal: true })}>
              关联支付方式
            </a>
            {/* <Divider type="vertical" /> */}
            {/* <a href="JavaScript:void(0)" onClick={() => this.handleJoin()}>
              关联合同
            </a> */}
          </Row>
        </Form>
        <CarJoinModal
          isShowModal={this.state.isShowModal}
          bindCarItemList={this.state.bindCarItemList}
          onCancel={this.handleCancelJoin}
          onOk={this.handleOkJoin}
        />
        <Modal
          visible={this.state.isShowPayTypeModal}
          title="关联支付方式"
          onCancel={() => {
            this.setState({ isShowPayTypeModal: false });
            this.props.form.resetFields(['payType']);
          }}
          onOk={() => {
            const payTypes: any[] =  this.props.form.getFieldValue('payType');
            if (payTypes.length === 0) {
              return;
            }
            this.setState({ isShowPayTypeModal: false });
          }}
        >
          <Form>
          <FormItem {...itemProps} label="选择支付方式">
            {getFieldDecorator('payType', {
              initialValue: payType,
              rules: [{ required: true, message: '请选择支付方式' }]
            })(
              <Checkbox.Group options={plainOptions}  />
              )}
          </FormItem>
          </Form>
        </Modal>
      </Modal>
    );
  }
}
