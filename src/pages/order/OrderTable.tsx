import React, { Fragment } from 'react';
import BaseProps from 'src/declare/baseProps';
import styles from './indexPage.less';
import { connect } from 'dva';
import { Alert, Table, Divider, Tag } from 'antd';
import moment from 'moment';
import { ColumnProps } from 'src/declare/antd/table';
import { getColumns } from './utils';

const modelName = 'orderlist';
@connect(({ orderlist, loading }) => ({
  list: orderlist.list,
  total: orderlist.total,
  page: orderlist.searchParams.page,
  loading: loading.effects[`${modelName}/queryList`],
}))

export default class OrderTable extends React.Component<BaseProps, any> {
  columns: ColumnProps<any>[];
  componentWillMount () {
    this.columns = getColumns.bind(this)();
  }
  /** ok函数 */
  handleOk = () => {
    //
  }
  render() {
    const { loading, list, total, page,  dispatch } = this.props;
    const paginationProps = {
      // showSizeChanger: true,
      current: page - 0,
      showQuickJumper: true,
      defaultPageSize: 20,
      // tslint:disable-next-line:no-shadowed-variable
      onChange: (page, pageSize) => {
        dispatch({
          type: `${modelName}/updateSearchParams`,
          payload: { page, size: pageSize },
        });
      },
      total: total - 0,
    };
    return (
    <div className={styles.standardTable}>
      <Table
        loading={loading}
        // bordered
        scroll={{ x: '1600px', y: '600px' }}
        rowKey={record => record.order.id}
        // rowSelection={rowSelection}
        dataSource={list}
        columns={this.columns}
        pagination={paginationProps}
        size="middle"
        // onChange={handleChange}
      />
    </div>);
  }
}
