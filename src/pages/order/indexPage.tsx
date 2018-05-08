import React from 'react';
import { connect } from 'dva';
import styles from './indexPage.less';
import BaseProps from '../../declare/baseProps.d';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Card, BackTop } from 'antd';
import OrderTable from './OrderTable';
@connect()
export default class OrderPage extends React.Component <BaseProps> {
  constructor(props) {
    super(props);
    this.initData();
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['order', '/order']
    });
  }
  initData() {
    // const { location: { search } } = this.props;
    this.props.dispatch({
      type: 'orderlist/ready',
      // payload: search,
    });
  }
  handleEdit = () => {
    //
  }
  render () {
    return (
      <PageHeaderLayout title="订单管理"  >
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {/* <OrderSearch  /> */}
          </div>
          <OrderTable  />
        </div>
      </Card>
      <BackTop />
    </PageHeaderLayout>
    );
  }
}
