import React from 'react';
import { Modal, Form, Input, message, DatePicker, Switch, Upload, Icon, InputNumber, Select, Button, Spin } from 'antd';
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
  version: number;
  companyId?: number;
  title: string;
  customerKey: string;
  companyKey: string;
  fontSize?: string;
  fontType?: number;
  filePath?: string;
  templateId?: number;
}
interface VersionType {
  id: number;
  name: string;
  [propName: string]: any;
}
interface CompanyLists {
  id: number;
  name: string;
}
@(Form.create as any)()
export default class AddContractModal extends React.Component<BaseModalProps & {editid: number}> {
  state = {
    loading: false,
    modelLoading: false,
    formData: {} as FormData,
    versionLists: [] as VersionType[],
    companyLists: [] as CompanyLists[],
    fileList: []
  };
  handleOk = async () => {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          modelLoading: true
        });
        let params = { ...values };
        params = { ...this.state.formData, ...params };
        const { data, status } = await ContractService.updatedContract(params);
        if (status === 200 || status === 201) {
          message.success('操作成功!');
          this.handleCancel();
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
      formData: {} as FormData,
      fileList: []
    });
  }
  beforeUpload = async (file: UploadFile & File) => {
    const form = new FormData();
    form.append('file', file);
    const { data, status } = await ContractService.upload(form);
    if (status === 200) {
      message.success('上传成功!');
      this.state.formData.filePath = data.url;
    }
    return false;
  }
  onFileChange = ({ fileList }) => {
    if (fileList) {
      this.setState({
        fileList: [fileList[fileList.length - 1]]
      });
    }
  }
  async componentWillMount() {
    const { data, status } = await ContractService.getVersionLists();
    if (status === 200) {
      this.setState({
        versionLists: data
      });
    }
    const req = await ContractService.getCompanyLists();
    if (req.status === 200) {
      this.setState({
        companyLists: req.data
      });
    }
  }
  async componentWillReceiveProps(nextProps) {
    if (nextProps.isShowModal &&  nextProps.isShowModal !== this.props.isShowModal && nextProps.editid) {
      this.setState({
        loading: true
      });
      const { data, status } = await ContractService.getContractData(nextProps.editid);
      if (status === 200) {
        this.setState({
          formData: data
        });
      }
      this.setState({
        loading: false
      });
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { formData, loading, modelLoading } =  this.state;
    const fontType = [
        { id: 0, name: '宋体' },
        { id: 1, name: '仿宋' },
        { id: 2, name: '黑体' },
        { id: 3, name: '楷体' },
        { id: 4, name: '微软雅黑' }
    ];
    return (
      <Modal
          visible={this.props.isShowModal}
          width={600}
          afterClose={this.handleAfterClose}
          title={this.props.editid ? '编辑合同' : '新增合同'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          confirmLoading={modelLoading}
      >
        <Spin size="large" spinning={loading}>
          <Form>
            <FormItem label="合同版本" {...itemProps}>
              {getFieldDecorator('version', {
                initialValue: formData.version,
                rules: [{ required: true, message: '请选择合同版本' }]
              })(<Select placeholder="请选择合同版本">
                    {this.state.versionLists.map(item => 
                    <Option key={item.id} value={item.id}>
                    {item.name}
                    </Option>)}
                  </Select>
                )}</FormItem>
              <FormItem label="隶属公司" {...itemProps}>
              {getFieldDecorator('companyId', {
                initialValue: formData.companyId,
              })(<Select placeholder="请选择隶属公司">
                    {this.state.companyLists.map(item => 
                    <Option key={item.id} value={item.id}>
                    {item.name}
                    </Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem label="合同标题" {...itemProps}>
              {getFieldDecorator('title', {
                initialValue: formData.title,
                rules: [{ required: true, message: '请填写合同标题' }]
              })(<Input placeholder="请选择合同标题"/>
                )}</FormItem>
              <FormItem label="用户合同盖章位置" {...itemProps}>
              {getFieldDecorator('customerKey', {
                initialValue: formData.customerKey,
                rules: [{ required: true, message: '请填写用户合同盖章位置' }]
              })(<Input placeholder="请填写用户合同盖章位置"/>
                )}</FormItem>
                <FormItem label="公司合同盖章位置" {...itemProps}>
              {getFieldDecorator('companyKey', {
                initialValue: formData.companyKey,
                rules: [{ required: true, message: '请填写公司合同盖章位置' }]
              })(<Input placeholder="请填写公司合同盖章位置"/>
                )}</FormItem>
                <FormItem label="填充字体大小" {...itemProps}>
              {getFieldDecorator('fontSize', {
                initialValue: formData.fontSize,
              })(<Input placeholder="请填写字体大小"/>
                )}</FormItem>
                <FormItem label="填充字体类型" {...itemProps}>
              {getFieldDecorator('fontType', {
                initialValue: formData.fontType,
              })(<Select placeholder="请选择字体类型">
                  {fontType.map(item => 
                  <Option key={item.id} value={item.id}>
                  {item.name}
                  </Option>)}
                </Select>
                )}</FormItem>
                <div className={styles.btn_export}>
                <Upload beforeUpload={this.beforeUpload} fileList={this.state.fileList} onChange={this.onFileChange}>
                  <Button>
                    <Icon type="upload" /> 导入合同
                  </Button>
                </Upload>
                </div>
          </Form>
        </Spin>
      </Modal>
    );
  }
}