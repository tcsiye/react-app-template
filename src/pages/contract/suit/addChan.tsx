import React from 'react';
import { Modal, Form, Input, message, DatePicker, Switch, Upload,
   Icon, InputNumber, Select, Button, Checkbox, Row, Transfer, Spin } from 'antd';
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
export default class AddContractModal extends React.Component<BaseModalProps & {editid: number}> {
  state = {
    loading: false,
    modelLoading: false,
    selectedChannel: [],
    currId: null,
    channel: []
  };
  handleOk = async () => {
    this.setState({
      modelLoading: true
    });
    const { data, status } = await ContractService.joinChannelSuit({
      listOrganizationId: this.state.selectedChannel,
      suiteId: this.state.currId 
    });
    if (status === 200 || status === 201) {
      message.success('操作成功!');
      this.handleCancel();
      this.props.reload();
    }
    this.setState({
      modelLoading: false,
    });
  }
  handleCancel = () => {
    this.props.onCancel();
  }
  handleChange = (targetKeys) => {
    this.setState({
      selectedChannel: targetKeys
    });
  }
  async componentWillReceiveProps(nextProps) {
    if (nextProps.isShowModal && nextProps.isShowModal !== this.props.isShowModal && nextProps.editid) {
      this.setState({
        loading: true
      });
      const { data, status } = await ContractService.getJoinChannel(nextProps.editid);
      if (status === 200) {
        this.setState({
          currId: nextProps.editid,
          selectedChannel: data.map(item => {
            return item.id.toString();
          }),
          channel: this.props.channel.map(arr => {
            for (const i in data) {
              if (arr.key === data[i].id) {
                arr.chosen = true;
              }
            }
            if (!arr.chosen) {
              arr.chosen = false;
            }
            return arr;
          })
        });
      }
      this.setState({
        loading: false
      });
    }
  }
  render() {
    const { loading, modelLoading } = this.state;
    return (
      <Modal
          visible={this.props.isShowModal}
          confirmLoading={modelLoading}
          width={680}
          title={'关联渠道'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
      >
        <Spin size="large" spinning={loading}>
          <Transfer
            dataSource={this.state.channel}
            showSearch
            listStyle={{
              width: 250,
              height: 300,
            }}
            titles={['未关联一级渠道', '已关联渠道数']}
            onChange={this.handleChange}
            operations={['to right', 'to left']}
            targetKeys={this.state.selectedChannel}
            render={item => `${item.title}`}
          />
        </Spin>
      </Modal>
    );
  }
}