import React from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Button, Input, Row, Col, Icon, message, Menu, Card } from 'antd';
import { connect } from 'dva';
import BaseProps from 'src/declare/baseProps';
import styles from './indexPage.less';
import _ from 'lodash';

const { Search } = Input;

@connect(({ tagModels, loading }) => ({
  tagModels,
  loading: loading.effects['tagModels/queryInfo']
}))
export default class HotTagetManage extends React.PureComponent<
  BaseProps,
  any
> {
  state = {
    list: [],
    total: 0,
    historySearch: '',
    searchParams: {
      keyword: '',
      page: 1,
      size: 20
    }
  };

  constructor(props) {
    super(props);
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/tag/hotTag']
    });
    this.initData();
  }

  initData() {
    this.props.dispatch({
      type: 'tagModels/ready'
    });
  }

  render() {
    const paginationProps = {
      // showSizeChanger: true,
      current: this.state.searchParams.page - 0,
      showQuickJumper: true,
      defaultPageSize: 20
    };

    return (
      <PageHeaderLayout title="Tag列表">
      <Card>
      <Row>
          <Col sm={4}>
            <Menu defaultOpenKeys={['1']}>
              <Menu.Item key="1">热门品牌</Menu.Item>
              <Menu.Item key="2">热门首付区间搜索</Menu.Item>
              <Menu.Item key="3">热门搜索</Menu.Item>
            </Menu>
          </Col>
          <Col sm={20}>
          <Button
                type={'primary'}
                onMouseUp={() => {
                  router.push('/tag/creatTag');
                }}
          >
                保存并发布
          </Button>
          </Col>
        </Row>
      </Card>

      </PageHeaderLayout>
    );
  }
}
