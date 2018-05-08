import React from 'react';
import { Card, BackTop, Table, Divider, Button, Icon } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './indexPage.less';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import PageComponent from 'src/components/base/PageComponent';
import CarListSearch from './CarListSearch';
import CarListTable from './CarListTable';
import _ from 'lodash';
@connect()
class CarListPage extends React.Component<any> {
  constructor(props) {
    super(props);
    this.initData();
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['car', '/car/list']
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search === '') {
      this.props.dispatch({
        type: 'carlist/ready',
        payload: nextProps.location.search,
      });
    }
  }
  shouldComponentUpdate(nextProps) {
    return _.eq(nextProps, this.props);
  }
  initData() {
    const { location: { search } } = this.props;
    this.props.dispatch({
      type: 'carlist/ready',
      payload: search,
    });
  }
  render() {
    return (
      <PageHeaderLayout title="车辆管理"  >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <CarListSearch />
            </div>
            <CarListTable />
          </div>
        </Card>
        <BackTop style={{ right: '10px' }} />
      </PageHeaderLayout>
    );
  }
}
export default CarListPage;
