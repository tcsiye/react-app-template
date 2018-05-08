import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Card, BackTop, Table, Divider, Button, Icon } from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import data from './data.json';
import { SubjectBean } from 'src/pages/activityManage/service';

const columns: ColumnProps <SubjectBean>[] = [
  {
    title: '序号',
    dataIndex: 'id',
    sorter: true,
    align: 'center',
    width: 100,
  },
  {
    title: '专题名称',
    dataIndex: 'name',
    sorter: true,
    align: 'center',
    width: 200,
  },
  {
    title: '预览链接',
    dataIndex: 'browsingUrl',
    align: 'center',
        // sorter: true,
    width: 600,
    render(val, row) {
      return (<a>{val}</a>);
    }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    align: 'center',
        // sorter: true,
    width: 200,
    render(val, row) {
      return (
            <Fragment>
              <a href="">编辑</a>
              <Divider type="vertical" />
              {row.status === 1 ? '已发布' : <a href="">发布</a>}
            </Fragment>);
    }
  },
];

@connect(({ special, app, loading  }) => ({
  special,
  app,
  submitting: loading.effects['special/queryList'],
}))
class SpecialManage extends React.PureComponent <BaseProps, any> {
  constructor(props: BaseProps) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'special/queryList',
    });
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['activityManage', '/activityManage/SpecialManage']
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   const falg = JSON.stringify(nextProps) !== JSON.stringify(this.props);
  //   const falg2 = JSON.stringify(nextState) !== JSON.stringify(this.state);
  //   return falg || falg2;
  // }
  render() {
    const { special, submitting } = this.props;
    return (
      <PageHeaderLayout  title="专题管理"  >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
            <Button type="primary" onClick={() => this.setState({})} >
              <Icon type="plus" />&nbsp;新增车辆
            </Button>
            </div>
                <Table
                    loading={submitting}
                    rowKey="id"
                    bordered
                    size="middle"
                    columns={columns}
                    dataSource={special.list}
                />
          </div>
        </Card>
        <BackTop   style={{ right: '10px' }} />
      </PageHeaderLayout>
    );
  }
}
export default SpecialManage;
