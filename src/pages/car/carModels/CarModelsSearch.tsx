import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Button } from 'antd';
import BaseProps from '../../../declare/baseProps.d';
import { DvaComponent } from 'src/components/base/DvaComponent';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ carModels }) => ({
  brandList: carModels.brandList,
  seriesList: carModels.seriesList,
  typeList: carModels.typeList,
  searchParams: carModels.searchParams
}))
export default class CarModelsSearch extends DvaComponent {
  modelName: string = 'carModels';
  constructor(props) {
    super(props);
  }
  handleFormReset = () => {
    //
  };
  handleSearch = e => {
    e.preventDefault();
    this.props.dispatch({
      type: 'carModels/queryList'
    });
  };

  handleBrandSelect = (value, option) => {
    //
  };
  handleSeriesSelect = (value, option) => {
    //
  };
  handleTypeSelect = (value, option) => {
    //
  };
  render() {
    // const { getFieldDecorator } = this.props.form;
    // tslint:disable-next-line:no-console
    const props = this.props;
    const { brandList, seriesList, typeList, searchParams } = props;
    return (
      <Form onSubmit={this.handleSearch}>
        <Row gutter={{ md: '8', lg: '24', xl: '48' }}>
          <Col md={8} sm={24}>
            <FormItem label="品牌">
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                value={searchParams.brand}
                onChange={this.handleBrandSelect}
                style={{ width: '100%' }}
              >
                {brandList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="车系">
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                value={searchParams.series}
                onChange={this.handleSeriesSelect}
                style={{ width: '100%' }}
              >
                {seriesList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="型号">
              <Select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                value={searchParams.type}
                onChange={this.handleTypeSelect}
                style={{ width: '100%' }}
              >
                {typeList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden', marginTop: 10 }}>
          <span style={{ float: 'left', marginBottom: 24 }}>
            <Button type="primary">导入Excel</Button>
            <Button style={{ marginLeft: 8 }} type="primary">
              查看品牌列表
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              onClick={() =>
                this.setDvaState({
                  isShowBrandsModal: true
                })
              }
            >
              新增品牌
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              onClick={() =>
                this.setDvaState({
                  isShowSeriesModal: true
                })
              }
            >
              新增车系
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              type="primary"
              onClick={() =>
                this.setDvaState({
                  isShowCarTypeModal: true
                })
              }
            >
              新增型号
            </Button>
          </span>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button
              loading={this.props.loading}
              type="primary"
              htmlType="submit"
            >
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </span>
        </div>
      </Form>
    );
  }
}
