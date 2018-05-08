import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import {
  Card,
  Button,
  Icon,
  message,
  Row,
  Col,
  Input,
  Form,
  Radio,
  DatePicker,
  Select,
  Spin
} from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import Colorful from 'src/components/Colorful';
import UploadImg from 'src/components/UploadImg';
import service from '../service';
import moment from 'moment';
import _ from 'lodash';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

export interface ListFormat {
  content: {
    buttonIcon?: string;
    borderColor?: string;
    afterImg?: string;
    afterImgHeight?: number;
    afterImgWidth?: number;
    afterTemplate?: string;
    afterTime?: any;
    afterUrl?: string;
    beforeImg?: string;
    beforeImgHeight?: number;
    beforeImgWidth?: number;
    beforeTemplate?: string;
    beforeTime?: any;
    beforeUrl?: string
    actionUrl?: string;
    heigth?: number;
    picUrl?: string
    width?: number;
  };
  display: number;
  id: number;
  info: string;
  moduleImgUrl?: null;
  sort: number;
  status: number;
  type: number;
}

@connect()
@(Form.create as any)()
export default class AddModule extends React.Component<BaseProps, any> {
  // const list = new Array(3).fill({content: { buttonIcon: stringborderColor?: string }})
  state = {
    name: '',
    list: [{ content: {} }, { content: {} }, { content: {} }] as ListFormat[],
    loading: false
  };

  dateFormat = 'YYYY-MM-DD HH:mm:ss';
  beforeTime;
  afterTime;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/homeConfig/addModule']
    });

    this.initData();
  }

  beforeUpload = () => {
    return;
  };

  initData = async () => {
    const indexModel = await service.queryHomeConfig(24);
    const actionModel = await service.queryHomeConfig(25);
    const picAtcModel = await service.queryHomeConfig(26);

    const { beforeTime, afterTime } = actionModel.data.content;

    this.beforeTime = moment(beforeTime).format(this.dateFormat);
    this.afterTime = moment(afterTime).format(this.dateFormat);
    // _.clone();
    // this.state.list = [indexModel.data, actionModel.data, picAtcModel.data];
    this.setState({
      list: [indexModel.data, actionModel.data, picAtcModel.data]
    });
    // tslint:disable-next-line:no-console
    console.log(this.state.list);
  };

  changeDate = () => {
    return;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form } = this.props;
    this.setState({ loading: true });
    form.validateFields(async (err, { list }) => {

      if (err) {
        this.setState({ loading: false });
        return;
      }
      const nlist = [];
      this.state.list.map((item, index) =>
        nlist.push({ ...item, ...list[index], content: JSON.stringify(list[index].content) })
      );
      const { status } = await service.setHomeConfigList(nlist);
      if (status === 200) {
        this.setState({ loading: false });
        message.success('保存成功！');
      }

    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

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
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };

    const { list } = this.state;

    return (
      <div>
        <PageHeaderLayout title="首页新增模块配置">
          <Form onSubmit={this.handleSubmit}>

            <Card
              className={styles.formBox}
              title="查看车型/首页线索：（线索数据需要同步到客服系统）"
            >
              <Row>
                <Col sm={12}>
                  <FormItem {...formItemLayout} label="是否展示">
                    {getFieldDecorator(`list[0].display`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入名称'
                        }
                      ],
                      initialValue: list[0].display
                    })(
                      <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="按钮图片">
                    {getFieldDecorator('list[0].content.buttonIcon', {
                      rules: [
                        {
                          required: true,
                          message: '请输入上次图片'
                        }
                      ],
                      initialValue: list[0].content.buttonIcon
                    })(<UploadImg reminder="notice" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="边框或字体颜色">
                    {getFieldDecorator(`list[0].content.borderColor`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入或选择边框或字体颜色'
                        }
                      ],
                      initialValue: list[0].content.borderColor
                    })(<Colorful />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="排序">
                    {getFieldDecorator(`list[0].sort`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入排序次序'
                        }
                      ],
                      initialValue: list[0].sort
                    })(<Input placeholder="请输入排序次序" />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>

            <Card className={styles.formBox} title="活动倒计时模块：">
              <Row>
                <Col sm={12}>
                  <FormItem {...formItemLayout} label="开始倒计时模块">
                    {getFieldDecorator(`list[1].display`, {
                      rules: [
                        {
                          required: true,
                          message: '请确认是否展示开始倒计时模块'
                        }
                      ],
                      initialValue: list[1].display
                    })(
                      <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="排序">
                    {getFieldDecorator(`list[1].sort`, {
                      rules: [
                        {
                          required: true,
                          message: '请选排序次序'
                        }
                      ],
                      initialValue: list[1].sort
                    })(<Input placeholder="排序" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <FormItem {...formItemLayout} label="开始之前图片">
                    {getFieldDecorator(`list[1].content.beforeImg`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片宽度'
                        }
                      ],
                      initialValue: list[1].content.beforeImg
                    })(<UploadImg style={{ maxWidth: '340px' }} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片宽度">
                    {getFieldDecorator(`list[1].content.beforeImgWidth`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片宽度'
                        }
                      ],
                      initialValue: list[1].content.beforeImgWidth
                    })(<Input placeholder="请输入图片宽度" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片高度">
                    {getFieldDecorator(`list[1].content.beforeImgHeight`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片高度'
                        }
                      ],
                      initialValue: list[1].content.beforeImgHeight
                    })(<Input placeholder="请输入图片高度" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="倒计时模板">
                    {getFieldDecorator(`list[1].content.beforeTemplate`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择倒计时模板'
                        }
                      ],
                      initialValue: list[1].content.beforeTemplate
                    })(<Select><Option value="1">双旦模板</Option></Select>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="活动开始时间">
                    {getFieldDecorator(`list[1].content.beforeTime`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择活动开始时间'
                        }
                      ],
                      initialValue: moment(this.beforeTime, this.dateFormat)
                    })(<DatePicker showTime format={this.dateFormat} />)}

                  </FormItem>
                  <FormItem {...formItemLayout} label="活动链接">
                    {getFieldDecorator(`list[1].content.beforeUrl`, {
                      rules: [
                        {
                          required: false,
                          message: '请选择活动开始的时间'
                        }
                      ],
                      initialValue: list[1].content.beforeUrl
                    })(<Input placeholder="活动链接" />)}
                  </FormItem>
                </Col>

                <Col sm={12}>
                  <FormItem {...formItemLayout} label="开始之后图片">
                    {getFieldDecorator(`list[1].content.afterImg`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片宽度'
                        }
                      ],
                      initialValue: list[1].content.afterImg
                    })(<UploadImg style={{ maxWidth: '340px' }} />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片宽度">
                    {getFieldDecorator(`list[1].content.afterImgWidth`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片宽度'
                        }
                      ],
                      initialValue: list[1].content.afterImgWidth
                    })(<Input placeholder="请输入图片宽度" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片高度">
                    {getFieldDecorator(`list[1].content.afterImgHeight`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片高度'
                        }
                      ],
                      initialValue: list[1].content.afterImgHeight
                    })(<Input placeholder="请输入图片高度" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="倒计时模板">
                    {getFieldDecorator(`list[1].content.afterTemplate`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片高度'
                        }
                      ],
                      initialValue: list[1].content.afterTemplate
                    })(<Select><Option value="1">双旦模板</Option></Select>)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="活动结束时间">
                    {getFieldDecorator(`list[1].content.afterTime`, {
                      rules: [
                        {
                          required: true,
                          message: '请选择活动结束时间'
                        }
                      ],
                      initialValue:  moment(this.beforeTime, this.dateFormat)
                    })(<DatePicker showTime format={this.dateFormat} />)}

                  </FormItem>
                  <FormItem {...formItemLayout} label="活动链接">
                    {getFieldDecorator(`list[1].content.afterUrl`, {
                      rules: [
                        {
                          required: false,
                          message: '请生成活动链接'
                        }
                      ],
                      initialValue: list[1].content.afterUrl
                    })(<Input placeholder="活动链接" />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Spin spinning={this.state.loading} tip="请稍等，保存中...">
            <Card className={styles.formBox} title="单图文模块：">
              <Row>
                <Col sm={12}>
                  <FormItem {...formItemLayout} label="是否展示">
                    {getFieldDecorator(`list[2].display`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入名称'
                        }
                      ],
                      initialValue: list[2].display
                    })(
                      <RadioGroup>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片">
                    {getFieldDecorator(`list[2].content.picUrl`, {
                      rules: [
                        {
                          required: true,
                          message: '请上传图片'
                        }
                      ],
                      initialValue: list[2].content.picUrl
                    })(<UploadImg />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片宽度">
                    {getFieldDecorator(`list[2].content.width`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片宽度'
                        }
                      ],
                      initialValue: list[2].content.width
                    })(<Input placeholder="请输入图片宽度" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="图片高度">
                    {getFieldDecorator(`list[2].content.heigth`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入图片高度'
                        }
                      ],
                      initialValue: list[2].content.heigth
                    })(<Input placeholder="请输入图片高度" />)}
                  </FormItem>

                  <FormItem {...formItemLayout} label="活动链接">
                    {getFieldDecorator(`list[2].content.actionUrl`, {
                      rules: [
                        {
                          required: false,
                          message: '活动链接'
                        }
                      ],
                      initialValue: list[2].content.actionUrl
                    })(<Input placeholder="请生成活动链接" />)}
                  </FormItem>
                  <FormItem {...formItemLayout} label="排序">
                    {getFieldDecorator(`list[2].sort`, {
                      rules: [
                        {
                          required: true,
                          message: '请输入排序值'
                        }
                      ],
                      initialValue: list[2].sort
                    })(<Input placeholder="请输入排序值" />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>

            <FormItem style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
              >
                保存并提交
              </Button>
            </FormItem>
            </Spin>
          </Form>
        </PageHeaderLayout>
      </div>
    );
  }
}
