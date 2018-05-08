import React from 'react';
import { Card, BackTop, Affix, Button, Anchor } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './indexPage.less';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import PageComponent from 'src/components/base/PageComponent';
import CarModelsSearch from './CarModelsSearch';
import CarModelsTable from './CarModelsTable';
import AddBrandsModal from './AddBrandsModal';
import AddSeriesModal from './AddSeriesModal';
import AddCarTypeModal from './AddCarTypeModal';
@connect()
class CarListPage extends React.PureComponent<any> {
  refdom = null;
  constructor(props) {
    super(props);
    this.initData();
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['car', '/car/carModels']
    });
  }
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.location.search === '') {
  //     this.props.dispatch({
  //       type: 'carlist/ready',
  //       payload: nextProps.location.search,
  //     });
  //   }
  // }
  initData() {
    const { location: { search } } = this.props;
    this.props.dispatch({
      type: 'carModels/ready',
      payload: search,
    });
  }
  render() {
    // tslint:disable-next-line:no-console
    console.log('渲染啦');
    return (
      <PageHeaderLayout title="车型管理"  >
        <Card bordered={false}  >
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <CarModelsSearch  />
            </div>
            <CarModelsTable  />
          </div>
        </Card>
        <BackTop />
        <AddBrandsModal/>
        <AddSeriesModal/>
        <AddCarTypeModal/>
      </PageHeaderLayout>
    );
  }
}
export default CarListPage;
