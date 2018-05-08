import React from 'react';
import { Modal, Radio, Form, Select, Input } from 'antd';
import { BaseModalProps } from 'src/declare/baseProps';
import { connect } from 'dva';
declare var window: any;
const inputStyle = {
  width: 230
};
const paramKeyArray1 = [
  { name: 'brand', desc: '品牌' },
  { name: 'series', desc: '系列' },
  { name: 'type', desc: '类型' },
  { name: 'name', desc: '名字' },
  { name: 'tag', desc: '标签' },
  { name: 'lower', desc: '首付下限(单位:分)' },
  { name: 'upper', desc: '首付上限(单位:分)' }
];
const paramKeyArray2 = [{ name: 'id', desc: '车辆id' }];
const paramKeyArray3 = [
  { name: 'title', desc: '标题' },
  { name: 'url', desc: '链接' },
  { name: 'needUserInfo', desc: '拼接userId' }
];
interface ParamsItem {
  type: String;
  value: String;
}
@(Form.create as any)()
export default class LinkModal extends React.Component<
  BaseModalProps & { index: number }
> {
  state = {
    linkValue: '',
    type: 0,
    maxValue: 7,
    trackValue: '',
    params1: [{}] as ParamsItem[],
    params2: [{}] as ParamsItem[],
    params3: [{}] as ParamsItem[],
  };
  handleCancel = () => {
    this.props.onCancel();
  };
  handleAfterClose = () => {
    this.props.form.resetFields();
  }
  handleOk = () => {
    this.props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        const formData = { ...values };
        const type = formData.type;
        let linkValue = '';
        switch (type) {
          case 0: linkValue = 'taoqicar://mall/itemList'; break;
          case 1: linkValue = 'taoqicar://mall/itemDetail'; break;
          case 2: linkValue = 'taoqicar://mall/webview'; break;
          default: break;
        }
        let params = null;
        if (type === 0) {
          params = {};
          formData.params1.map((item, i) => {
            params[item.type] = item.value;
          });
          if (formData.trackValue) {
            params.trackValue = formData.trackValue;
          }
        }
        if (type === 1) {
          params = {};
          formData.params2.map((item, i) => {
            params[item.type] = item.value;
          });
          if (formData.trackValue) {
            params.trackValue = formData.trackValue;
          }
        }
        if (type === 2) {
          params = {};
          formData.params3.map((item, i) => {
            params[item.type] = item.value;
          });
          if (formData.trackValue) {
            params.trackValue = formData.trackValue;
          }
        }
        if (Object.keys(params).length !== 0) {
          linkValue = linkValue + '?param=' + window.encodeURIComponent(JSON.stringify(params));
        }
        this.props.onOk(linkValue);
      }
    });
  }
  radioChange = (val) => {
    this.setState({
      params1: [{} as ParamsItem],
      params3: [{} as ParamsItem],
    });
    this.props.form.resetFields();
  };
  getParamsNum = (num) => {
    // tslint:disable-next-line:prefer-array-literal
    return new Array(num).fill('');
  };
  handleSelectChange = (val, type) => {
    const params = this.state[type];
    if (params.length < val) {
      // tslint:disable-next-line:no-increment-decrement
      for (let i = 0; i <= (val - params.length); i++) {
        params.push({} as ParamsItem);
      }
    }
    if (params.length > val) {
      params.splice(0, val);
    }
    this.setState({
      [type]: params
    });
  }
  render() {
    const { trackValue, maxValue, params1, params2, params3 } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
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
    const type = this.props.form.getFieldValue('type') || 0;
    const paramsNumber = this.props.form.getFieldValue('paramsNumber') || 1;
    const paramsNumber2 = this.props.form.getFieldValue('paramsNumber2') || 1;
    return (
      <Modal
        visible={this.props.isShowModal}
        width={600}
        title={'生成链接'}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        afterClose={this.handleAfterClose}
      >
        <Form>
          <Form.Item {...formItemLayout} label="链接类型">
            {getFieldDecorator(`type`, {
              initialValue: type
            })(
              <Radio.Group onChange={this.radioChange}>
                <Radio value={0}>商品列表</Radio>
                <Radio value={1}>商品详情</Radio>
                <Radio value={2}>web容器</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          {type === 0 && (
            <div>
              <Form.Item {...formItemLayout} label="参数个数">
                {getFieldDecorator(`paramsNumber`, {
                  initialValue: paramsNumber
                })(
                  <Select onChange={val => this.handleSelectChange(val, 'params1')}>
                    {this.getParamsNum(maxValue).map((item, i) => (
                      <Select.Option key={i} value={i + 1}>{i + 1}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {params1.map((arr, i) => (
                <Form.Item {...formItemLayout} label="参数名" key={i}>
                  {getFieldDecorator(`params1[${i}].type`, {
                    initialValue: params1[i].type
                  })(
                    <Select placeholder="请选择参数类型">
                      {paramKeyArray1.map(item => (
                        <Select.Option key={item.desc} value={item.name}>
                          {item.desc}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(`params1[${i}].value`, {
                      initialValue: params1[i].value
                    })(<Input placeholder="请输入参数名" style={inputStyle} />)}
                  </Form.Item>
                </Form.Item>
              ))}
            </div>
          )}
          {type === 1 && (
            <div>
              <Form.Item {...formItemLayout} label="参数名">
                {getFieldDecorator(`params2[0].type`, {
                  initialValue: params2[0].type
                })(
                  <Select placeholder="请选择参数类型">
                    {paramKeyArray2.map(item => (
                      <Select.Option key={item.desc} value={item.name}>
                        {item.desc}
                      </Select.Option>
                    ))}
                  </Select>
                )}
                <Form.Item {...formItemLayout}>
                  {getFieldDecorator(`params2[0].value`, {
                    initialValue: params2[0].value
                  })(<Input placeholder="请输入参数名" style={inputStyle}/>)}
                </Form.Item>
              </Form.Item>
            </div>
          )}
          {type === 2 && (
            <div>
              <Form.Item {...formItemLayout} label="参数个数">
                {getFieldDecorator(`paramsNumber2`, {
                  initialValue: paramsNumber2
                })(
                  <Select onChange={val => this.handleSelectChange(val, 'params3')}>
                    {this.getParamsNum(maxValue).map((item, i) => (
                      <Select.Option key={i} value={i + 1}>{i + 1}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {params3.map((arr, i) => (
                <Form.Item {...formItemLayout} label="参数名" key={i}>
                  {getFieldDecorator(`params3[${i}].type`, {
                    initialValue: params3[i].type
                  })(
                    <Select placeholder="请选择参数类型">
                      {paramKeyArray3.map(item => (
                        <Select.Option key={item.desc} value={item.name}>
                          {item.desc}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                  <Form.Item {...formItemLayout}>
                    {getFieldDecorator(`params3[${i}].value`, {
                      initialValue: params3[i].value
                    })(<Input placeholder="请输入参数名" style={inputStyle} />)}
                  </Form.Item>
                </Form.Item>
              ))}
            </div>
          )}
          <Form.Item {...formItemLayout} label="打点值">
            {getFieldDecorator(`trackValue`, {
              initialValue: trackValue
            })(<Input placeholder="打点值（可选）" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
