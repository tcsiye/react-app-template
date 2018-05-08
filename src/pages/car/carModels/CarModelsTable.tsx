import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Alert, Table, Tag, Icon, Divider, Button, message } from 'antd';
import styles from './indexPage.less';
import BaseProps from '../../../declare/baseProps';
import { ColumnProps } from 'src/declare/antd/table';
import { ButtonType, ButtonSize, ButtonProps } from 'antd/lib/button';
import CarService from '../service';

// const columns: ColumnProps<any>[] =
@connect(({ carModels, loading }) => ({
  carModels,
  loading: loading.effects['carModels/queryList']
}))
class CarModelsTable extends React.Component<BaseProps> {
  columns: ColumnProps<any>[] = [
    {
      title: '编号',
      dataIndex: 'typeId',
      sorter: true,
      width: 100,
      align: 'center',
      render: (val, row) => {
        return row.carType.id;
      }
    },
    {
      title: '品牌',
      dataIndex: 'brandId',
      sorter: true,
      width: 130,
      align: 'center',
      render: (val, row) => {
        return row.carBrand ? row.carBrand.name : '-';
      }
    },
    {
      title: '车系',
      dataIndex: 'seriesId',
      sorter: true,
      align: 'center',
      width: 180,
      render: (val, row) => {
        return row.carSeries ? row.carSeries.name : '-';
      }
    },
    {
      title: '型号',
      dataIndex: 'carType.name',
      sorter: true,
      align: 'center',
      width: 200
    },
    {
      title: '状态',
      dataIndex: 'carType.status',
      sorter: true,
      align: 'center',
      width: 180,
      render: val => {
        return val ? '有效' : '无效';
      }
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'storageNum',
      // fixed: 'right',
      width: 120,
      render: (text, row) => {
        // eslint-disable-line
        const status = row.carType.status;
        const props: ButtonProps = {
          loading: row.loading,
          size: 'small',
          style: { width: 100 },
          onClick: async () => {
            row.loading = true;
            this.forceUpdate();
            // tslint:disable-next-line:no-shadowed-variable
            const { data, status } =  await CarService.switchCarTypeStatus({
              id: row.carType.id,
              status: row.carType.status ? 0 : 1
            });
            setTimeout(() => {
              row.carType.status = data.status;
              if (status === 200) {
                row.loading = false;
                message.success('修改成功');
              }
              this.forceUpdate();
            }, 1000);

          },

          type: status === 0 ? 'danger' : 'dashed'
        };
        return (
          <Button  {...props}>{status === 0 ? '标为有效' : '标为无效'}</Button>
        );
      }
    }
  ];
  render() {
    const { carModels, loading, dispatch } = this.props;
    const paginationProps = {
      // showSizeChanger: true,
      current: carModels.searchParams.page - 0,
      showQuickJumper: true,
      defaultPageSize: 20,
      onChange: (page, pageSize) => {
        dispatch({
          type: 'carModels/updateSearchParams',
          payload: { page, size: pageSize }
        });
      },
      total: carModels.total - 0
    };
    return (
      <div className={styles.standardTable}>
        {/* <div className={styles.tableAlert}>
        <Alert
          message={(
            <div>
              <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>清空</a>
            </div>
            )}
          type="info"
          showIcon
        />
      </div> */}
        <Table
          loading={loading}
          bordered
          // scroll={{ x: '400px' }}
          rowKey={record => record.carType.id}
          // rowSelection={rowSelection}
          dataSource={carModels.list}
          columns={this.columns}
          // onChange={handleChange}
          pagination={paginationProps}
        />
      </div>
    );
  }
}

export default CarModelsTable;
