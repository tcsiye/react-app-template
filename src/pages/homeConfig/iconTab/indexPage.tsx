import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import {
  Card,
  Table,
  Button,
  Icon,
  message,
  Tag,
  Badge,
  Row,
  Col,
  Input,
  Form,
  Upload,
  Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
// import PushService from './service';
import moment from 'moment';
import service from '../service';
import { UploadFile } from 'antd/lib/upload/interface';
import { checkFile } from 'src/utils/utils';
import CommonService from 'src/services/commonService';
import { SketchPicker } from 'react-color';
import Colorful from 'src/components/Colorful';

const FormItem = Form.Item;

@connect()
@(Form.create as any)()
export default class HomeIconTab extends React.PureComponent<BaseProps, any> {
  state = {
    list: [] as any,
    oldInfo: {},
    loading: false,
    name: '',
    colorStr: '#fff',
  };
  constructor(props) {
    super(props);
    this.initData();
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/homeConfig/iconTab']
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    this.setState({ loading: true });
    form.validateFields(async (err, fieldsValue) => {

      if (err) {
        return;
      }
      this.updateIcons({
        ...this.state.oldInfo,
        content: JSON.stringify(this.state.list),
        moduleImgUrl: this.state.colorStr
      });
    });
  }

  beforeUpload = (
    index: number,
    keyName: string,
    file: UploadFile & File,
    FileList: UploadFile[]
  ): boolean => {
    checkFile({
      file,
      size: 1024,
      accept: 'image'
    }).then(() => {

      return CommonService.fileUpload({
        data: { file }
      }).then(({ data, status }) => {
        if (status === 200) {
          this.state.list[index][keyName] = data.ossUrl;
          this.setState(this.state.list);

          message.success('图片上传成功');
        } else {
          message.error('上传失败，请重新选择图片上传');
        }
      });
    });

    return false;
  }

  async initData() {
    const { data } = await service.queryHomeConfig(22);

    this.setState({
      list: data.content,
      oldInfo: data,
      colorStr: data.moduleImgUrl
    });
  }

  async updateIcons(params) {
    const { data, status } = await service.setHomeConfig(params);
    if (status === 200) {

      message.success('保存成功！');
    }
    this.setState({ loading: false });
  }

  changeColor = checkColor => {
    this.setState({ colorStr: checkColor });
  }

  showListInfo = () => {
    const ColSize = {
      xs: 2,
      sm: 2,
      md: 8,
      lg: 5,
      xl: 6
    };

    const RowGutter = {
      xs: '20',
      sm: '20',
      md: '24',
      lg: '20',
      xl: '40'
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 17 }
      }
    };

    const { getFieldDecorator, getFieldValue } = this.props.form;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );

    if (this.state.list.length > 0) {
      return (
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={RowGutter}>
            {this.state.list.map((item, index) => {
              return (
                <Col {...ColSize} key={index}>
                  <Card>
                    <FormItem {...formItemLayout} label="名称">
                      {getFieldDecorator(`list[${index}].name`, {
                        rules: [
                          {
                            required: true,
                            message: '请输入名称'
                          }
                        ],
                        initialValue: item.name
                      })(<Input placeholder="请输入名称" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="选中">
                      {getFieldDecorator(`list[${index}].selectIcon`, {
                        rules: [{ required: true, message: '请上传图标' }],
                        initialValue: this.state.list[index].selectIcon
                      })(
                        <div style={{ display: 'inline-block', width: '60px' }}>
                          <Upload
                            action=""
                            listType="picture-card"
                            beforeUpload={(file: any, fileList) =>
                              this.beforeUpload(
                                index,
                                'selectIcon',
                                file,
                                fileList
                              )
                            }
                            showUploadList={false}
                          >
                            <Tooltip placement="rightTop" title="点击选择图片">
                              {item.selectIcon ? (
                                <img
                                  src={item.selectIcon}
                                  alt=""
                                  title="(图片格式:*，不超过1M)"
                                  style={{ maxWidth: '84px', maxHeight: '84px' }}
                                />
                              ) : (
                                uploadButton
                              )}
                            </Tooltip>
                          </Upload>
                        </div>
                      )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="未选中">
                      {getFieldDecorator(`list[${index}].unselectIcon`, {
                        rules: [{ required: true, message: '请上传图标' }],
                        initialValue: item.unselectIcon
                      })(
                        <Upload
                          action=""
                          listType="picture-card"
                          beforeUpload={(file: any, fileList) =>
                            this.beforeUpload(
                              index,
                              'unselectIcon',
                              file,
                              fileList
                            )
                          }
                          showUploadList={false}
                        >
                          <Tooltip placement="rightTop" title="点击选择图片">
                            {item.unselectIcon ? (
                              <img
                                src={item.unselectIcon}
                                alt=""
                                title="(图片格式:*，不超过1M)"
                                style={{ maxWidth: '84px' }}
                              />
                            ) : (
                              uploadButton
                            )}
                          </Tooltip>
                        </Upload>
                      )}
                    </FormItem>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <div className={styles.colorBox}>
            <div className={styles.colortabSty}>
              <span className={styles.warnIcon}>*</span>Tab选中颜色(rgba):
            </div>
            <span>
              <Colorful
                onChange={this.changeColor}
                value={this.state.colorStr}
              />
            </span>
          </div>

          <FormItem style={{ marginTop: 32 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
            >
              保存并提交
            </Button>
          </FormItem>
        </Form>
      );
    }
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // tslint:disable-next-line:no-console
    console.log(this.state);
    return (
      <PageHeaderLayout title="APP底部Icon配置">
        {this.showListInfo()}
      </PageHeaderLayout>
    );
  }
}
