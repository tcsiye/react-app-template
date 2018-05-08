import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Button, Icon, Spin } from 'antd';
import CarService from 'src/pages/car/service';
import { FormCreateOption } from 'antd/lib/form';
import { debounce } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

const opt: FormCreateOption<any>  = {
  mapPropsToFields(props) {
    const { searchParams } = props;
    // tslint:disable-next-line:no-console
    console.log(searchParams);
    const params = {};
    Object.keys(searchParams).forEach((key) => {
      params[key] = Form.createFormField({ name: key, value: searchParams[key] });
    });
    return params;
  },
  onValuesChange: debounce((props, values) => {
    props.dispatch({
      type: 'carlist/updateSearchParams',
      payload: values,
    });
  }, 400)
};

@connect(({ carlist, loading }) => ({
  searchParams: carlist.searchParams,
  loading: loading.effects['carlist/queryList'],
}))
@(Form.create as any)(opt)
class CarListSearch extends PureComponent<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      provinces: [{ id: '', areaName: '全部' }],
    };
    this.initData();
  }
  getProvinces = async () => {
    const { data, status } = await CarService.querySkuProvinces();
    if (status === 200) {
      data.unshift({ id: '', areaName: '全部' });
      this.setState({ provinces: data });
    }
  }
  initData = () => {
    this.getProvinces();
  }
  handleFormReset = () => {
    //
  }
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {// eslint-disable-line
      if (err) { return; }
      this.props.dispatch({
        type: 'carlist/queryList',
      });
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: '8', lg: '24', xl: '48' }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}   >
                  <Option value="-1">全部</Option>
                  <Option value="0">C端上架</Option>
                  <Option value="1">C端下架</Option>
                  <Option value="2">B端上架</Option>
                  <Option value="3">B端下架</Option>
                  <Option value="4">未编辑</Option>
                </Select>
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="可选区域">
              {this.state.provinces.length === 1 ?
              <Spin style={{ marginLeft: 20 }} /> : getFieldDecorator('sellProvinceId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  {
                 this.state.provinces.map(item =>
                   <Option key={item.id} value={`${item.id}`} >{item.areaName}</Option>)
               }
                </Select>
            )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车辆查询">
              {getFieldDecorator('keyword')(
                <Input placeholder="请输入车辆名称"   />
            )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden', marginTop: 10 }}>
          <span style={{ float: 'left', marginBottom: 24 }}>

            <Button type="primary" onClick={() => { this.props.history.push('/car/carManage/carDetail'); }} >
              <Icon type="plus" />&nbsp;新增车辆
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary">
              <Icon type="arrow-up-a" />&nbsp;上传CSV文件
            </Button >
            <Button style={{ marginLeft: 8 }} type="primary" >复制车辆</Button>
            <Button style={{ marginLeft: 8 }} type="primary" >批量导入SKU</Button>

          </span>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button loading={this.props.loading} type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }
}

export default CarListSearch;
