import React, { ChangeEvent } from 'react';
import BaseProps from '../../../declare/baseProps';
import { connect } from 'dva';
import {
  Table,
  Button,
  Input,
  Row,
  Col,
  Icon,
  Card,
  Form,
  Transfer,
  message
} from 'antd';
import styles from '../tag.less';
import router from 'umi/router';
import _ from 'lodash';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import tagetService from 'src/pages/tag/service';
import map from './../../../components/Login/map';
import Item from 'antd/lib/list/Item';
import Bind from 'lodash-decorators/bind';
import { debounce } from 'lodash-decorators/debounce';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
    md: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 16 }
  }
};

const submitFormLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 10, offset: 7 },
    md: { span: 16, offset: 4 }
  }
};

@connect(({ loading }) => ({
  loading: loading.effects['carModels/queryList']
}))
export default class CreatTag extends React.PureComponent<BaseProps, any> {
  state = {
    carTypeList: [],
    carIdList: [],
    oldInfo: { carIdList: [], name: '' }, // 旧数据，用于编辑重置
    loading: false,
    name: '',
    gmtCreate: '',
    id:
      (this.props.location.query.id &&
        parseInt(this.props.location.query.id, 10)) ||
      -1,
    queryCarParams: { page: 0, size: 100, keyword: '', status: 0 }
  };
  constructor(porps) {
    super(porps);

    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/tag/tagList']
    });
    this.initData();
  }

  initData() {
    this.queryCarType(this.state.queryCarParams);
    this.queryForId();
  }

  async queryForId() {
    if (this.state.id !== -1) {
      // 查询tag名称
      const { data } = await tagetService.queryTagForId(this.state.id);
      const { name, gmtCreate } = data;
      // tag名称查询关联车辆
      const carTypeInfo = await tagetService.queryCarTypeforName({
        tag: name
      });

      if (carTypeInfo.data.length > 1) {
        carTypeInfo.data.forEach(item => {
          this.state.carIdList.push(item.id.toString());
        });

        this.setState({ name, gmtCreate, oldInfo: { name, carIdList: _.cloneDeep(this.state.carIdList) } });
      }

    }
  }

  @Bind()
  handleSubmit(e) {
    e.preventDefault();
    const checkCar = [];
    const { carIdList, name, id, gmtCreate } = this.state;
    if (!name) {
      message.error('请输入tag名称');
    } else if (carIdList.length < 1) {
      message.error('请选择车辆类型');
    } else {
      let params = {};
      carIdList.forEach((item, index) => {
        carIdList[index] = parseInt(item, 10);
      });
      if (id !== -1) {
        params = { carIdList, name, id, gmtCreate };
      } else {
        params = { carIdList, name };
      }
      this.addTag(params);
    }
  }

  async addTag(params) {
    this.setState({
      loading: true
    });
    const { status, data } = await tagetService.addHotTag(params);
    this.setState({
      loading: false
    });
    switch (status) {
      case 200:
        message.success('编辑成功！');
        break;
      case 201:
        message.success('添加成功！');
        break;
      // tslint:disable-next-line:no-unused-expression
      default: null;
    }
  }

  // @Bind()
  // @debounce(300)
  // // handleChangeInput(e: ChangeEvent<HTMLInputElement>) {
  // handleChangeInput(e) {
  //   // tslint:disable-next-line:no-console
  //   console.log(e);
  //  // this.setState({ name: e.target.value });
  // }

  handleReset = () => {

    if (this.state.id === -1) {
      this.setState({ name: '', carIdList: [] });
    } else {
      const { carIdList, name } = this.state.oldInfo;
      this.setState({ carIdList, name });
    }

  }

  handleChangeInput = e => {
    this.setState({ name: e.target.value });
  }

  handleChange = (carIdList, direction, moveKeys) => {
    this.setState({ carIdList });
  }

  async queryCarType(params) {
    const { data, status } = await tagetService.queryRelevanCar(params);

    const carList = [];
    if (data && status === 200) {
      data.map(item => {
        carList.push({ title: item.name, key: item.id.toString() });
      });
      this.setState({ carTypeList: carList });
    } else {
      message.warning('未取到车辆类型数据，刷新后无效与后台客服人员联系！');
    }
  }

  render() {
    return (
      <PageHeaderLayout title={this.state.id !== -1 ? '编辑Tag' : '新增Tag'}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ marginTop: 8 }}
          >
            <FormItem {...formItemLayout} label="Tag名称">
              <Input
                value={this.state.name}
                placeholder="请输入Tag名称"
                style={{ maxWidth: '665px', minWidth: '310px' }}
                disabled={this.state.id !== -1}
                onChange={this.handleChangeInput}
              />
            </FormItem>

            <FormItem {...formItemLayout} label="关联车辆类型">
              <Transfer
                dataSource={this.state.carTypeList}
                titles={['未选中', '已选中']}
                targetKeys={this.state.carIdList}
                showSearch
                onChange={this.handleChange}
                searchPlaceholder={'请输入关键字'}
                listStyle={{
                  width: 310,
                  height: 470
                }}
                render={item => item.title}
              />
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
              >
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onMouseUp={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
