import React, { Fragment } from 'react';
import BaseProps from '../../../declare/baseProps';
import styles from './indexPage.less';
import { connect } from 'dva';
import { Alert, Table, Divider, Tag } from 'antd';
import moment from 'moment';
import { ColumnProps } from 'src/declare/antd/table';
const columns: ColumnProps<any>[] = [
  {
    title: '编号',
    dataIndex: 'id',
    sorter: true,
    width: 100,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    sorter: true,
    width: 130,
    align: 'center',
  },
  {
    title: '指导价',
    dataIndex: 'guidedPrice',
    sorter: true,
    align: 'center',
    width: 180,
    render: (val) => {
      if (val) {
        return `${(val / 100)}元`;
      }
      return val;
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    sorter: true,
    align: 'center',
    width: 140,
    render: (val) => {
      let render = null;
      switch (val) {
        case 0:
          render = <Tag  color="green">C端上架</Tag>;
          break;
        case 1:
          render = <Tag  color="yellow">C端下架</Tag>;
          break;
        case 2:
          render = <Tag color="green">B端上架</Tag>;
          break;
        case 3:
          render = <Tag  color="yellow">B端下架</Tag>;
          break;
        case 4:
          render = <Tag  color="red">未编辑</Tag>;
          break;
        default:
          break;
      }
      return render;
    },
  },
  {
    title: '最后修改时间',
    dataIndex: 'gmtModified',
    sorter: true,
    align: 'center',
    width: 180,
    render: (val) => {
      return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
    },
  },
  {
    title: '可售区域',
    dataIndex: 'sellProvinces',
    sorter: true,
    align: 'center',
    width: 180,
  },
  {
    title: 'SKU预览',
    // sorter: true,
    align: 'center',
    dataIndex: 'sellingNum',
    // fixed: 'right',
    width: 180,
    render: (text, row) => {
      return (
        <div>
          <div>待售：<span > {row.carItemSkuStatis.sellingNum}</span> 台</div>
          <div>在库：<span > {row.carItemSkuStatis.storageNum}</span> 台</div>
          <div>在途：<span > {row.carItemSkuStatis.transitNum}</span> 台</div>
        </div>
      );
    },
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'storageNum',
    fixed: 'right',
    width: 120,
    render: (text, row) => { // eslint-disable-line
      return (
        <Fragment>
          <a href="">详情</a>
          <Divider type="vertical" />
          <a href="">编辑</a>
        </Fragment>
      );
    },
  },
];

@connect(({ carlist, loading }) => ({
  carlist,
  loading: loading.effects['carlist/queryList'],
}))
class CarListTable extends React.Component<BaseProps, any> {

  render() {
    const { loading, carlist, dispatch } = this.props;
    const paginationProps = {
      // showSizeChanger: true,
      current: carlist.searchParams.page - 0,
      showQuickJumper: true,
      defaultPageSize: 20,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'carlist/updateSearchParams',
          payload: { page, size: pageSize },
        });
      },
      total: carlist.total - 0,
    };
    return (
    <div className={styles.standardTable}>
      <Table
        loading={loading}
        bordered
        scroll={{ x: '1300px', y: '600px' }}
        rowKey={record => record.id}
        // rowSelection={rowSelection}
        dataSource={carlist.list}
        columns={columns}
        pagination={paginationProps}
        size="middle"
        // onChange={handleChange}
      />
    </div>);
  }
}
export default CarListTable;
