import React from 'react';
import { Modal, Form, Input, Upload, Button, Select, Icon, message } from 'antd';
import BaseProps from 'src/declare/baseProps';
import { checkFile } from 'src/utils/utils';
import { UploadFile } from 'antd/lib/upload/interface';
import styles from './indexPage.less';
import CommonService from '../../services/commonService';
import BranchComService from './service';

const FormItem  = Form.Item;
const { Option } = Select;

interface BranchComModalProps extends BaseProps {
  isShowModal: boolean;
  modalType: number;
  onCancel: (e) => void;
  onOk: (e) => void;
  modalLoading: boolean;
}
const titles = ['添加', '编辑', '查看'];
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
@(Form.create as any)(

)

class BranchComModal extends  React.PureComponent<BranchComModalProps, any> {
  state = {
    loading: false,
    imageUrl: undefined,
    list: []
  };

  handleBefore = (file: UploadFile & File, FileList: UploadFile[]) => {
    checkFile({
      file,
      width: 166,
      height: 166,
      size: 1024,
      accept: 'image'
    }).then(() => {
      this.setState({ loading: true });
      // getBase64(file, imageUrl => this.setState({
      //   imageUrl,
      //   loading: false,
      // }));
      return CommonService.fileUpload({
        data: { file }
      }).then(({ data }) => {
        this.setState({
          imageUrl: data.ossUrl,
          loading: false,
        });
        this.props.form.setFieldsValue({
          sealUrl: data.ossUrl
        });
        message.success('图片上传成功');
      });
    });
    // .then(({ data }) => {
    //   if (data.ossUrl) {
    //     this.$Message.success('上传成功!');
    //     this.form.sealUrl = data.ossUrl;
    //   }
    // }).catch(e => { console.log(e); });
    return false;
  }
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  componentWillMount() {

    BranchComService.queryErpAreaList().then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          list: data
        });
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.imageUrl) {
      this.setState({
        imageUrl: nextProps.sealUrl
      });
    }
  }
  handleCancel = (e) => {
    this.props.onCancel(this.props.form);
    setTimeout(() => {
      this.setState({
        imageUrl: undefined
      });
    }, 0);

  }
  handleOk = (e) => {
    this.props.onOk(this.props.form);
  }
  render() {
    const { form, modalType } = this.props;
    // tslint:disable-next-line:no-console
    console.log(this.props);
    const isDisabled = modalType === 3;
    const itemProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    const uploadButton = (
      <div style={{ display: isDisabled ? 'none' : 'block' }} >
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
       </div>
    );
    return (
        <Modal
              width={600}
              confirmLoading={this.props.modalLoading}
              onCancel={this.handleCancel}
              visible={this.props.isShowModal}
              onOk={this.handleOk}
              title={`${titles[modalType - 1]}分公司`}
        >
          <Form  className={styles.modal}  >
            <FormItem
                {...itemProps}
                label="分公司名称"
            >
              {
                form.getFieldDecorator('name', {
                  initialValue: this.props.name,
                  rules: [{ required: true, message: '必填项' }],
                })(
                <Input placeholder="请输入分公司名称" disabled={isDisabled || modalType === 2} />
                )
              }
            </FormItem>
            <FormItem
                {...itemProps}
                label="分公司印章"
            >
              {
                form.getFieldDecorator('sealUrl', {
                  rules: [{ required: true, message: '必填项' }],
                  initialValue: this.props.sealUrl
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
                  disabled={isDisabled}
                  showUploadList={false}
                >
                {this.state.imageUrl ? <img src={this.state.imageUrl} alt="" /> : uploadButton}

                </Upload>
                {isDisabled ? null :
                <span style={{ Color: '#999', paddingLeft: '10px' }}>(图片格式：图片尺寸166*166，大小不超过1M) </span>}
                {/* <img src={this.props.sealUrl} style={{ height: '80px', width: 'auto' }} /> */}
            </FormItem>
            <FormItem
                {...itemProps}
                label="email"
            >
              {
                form.getFieldDecorator('email', {
                  rules: [{ required: true, message: '必填项' }],
                  initialValue: this.props.email
                })(
                <Input placeholder="请输入邮箱" disabled={isDisabled} />
                )
              }
            </FormItem>
            <FormItem
                {...itemProps}
                label="组织机构代码"
            >
              {
                form.getFieldDecorator('organizationCode', {
                  rules: [{ required: true, message: '必填项' }],
                  initialValue: this.props.organizationCode
                })(
                <Input placeholder="请输入组织机构代码" disabled={isDisabled} />
                )
              }
            </FormItem>
            <FormItem
                {...itemProps}
                label="合同签署公司名称"
            >
              {
                form.getFieldDecorator('signName', {
                  rules: [{ required: true, message: '必填项' }],
                  initialValue: this.props.signName
                })(
                <Input placeholder="请输入合同签署公司名称"  disabled={isDisabled} />
                )
              }
            </FormItem>
            <FormItem
                {...itemProps}
                label="ERP地区(分公司)"
            >
              {
                form.getFieldDecorator('erpCarAreaId', {
                  initialValue: this.props.erpCarAreaId
                })(
                  <Select placeholder="请选择地区分公司" disabled={isDisabled}   >
                    <Option value="" >请选择</Option>
                    {this.state.list.map(item =>
                    <Option key={item.areaId} value={item.areaId} >
                    {item.areaName}
                    </Option>)}
                  </Select>
                )
              }
            </FormItem>
          </Form>
        </Modal>
    );
  }
}
export default  BranchComModal;
