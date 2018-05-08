import React, { Fragment } from 'react';
import { ColumnProps } from 'antd/lib/table';
import OrderTable from 'src/pages/order/OrderTable';

export function getColumns(this: OrderTable): ColumnProps<any>[] {
  return [
    {
      title: '订单号',
      dataIndex: 'order.tradeNo',
      width: 200,
      align: 'center',
    },
    {
      title: '车源名称',
      dataIndex: 'order.orderName',
      width: 200,
      align: 'center',
    },
    {
      title: '客户姓名',
      dataIndex: 'userDTO.realName',
      align: 'center',
      width: 180,
    },
    {
      title: '客户电话',
      dataIndex: 'userDTO.phoneNum',
      align: 'center',
      width: 140,
    },
    {
      title: '客户渠道',
      dataIndex: 'customOrganization',
      align: 'center',
      width: 180,
    },
    {
      title: '订单类型',
      dataIndex: 'order.type',
      align: 'center',
      width: 180,
    },
    {
      title: '已支付',
      align: 'center',
      dataIndex: 'order.payMoney',
        // fixed: 'right',
      width: 180,
      render (value , row) {
        return value / 100;
      }
    },
    {
      title: '销售员姓名',
      dataIndex: 'salerDTO.employeeName',
      align: 'center',
      width: 180,
    },
    {
      title: '销售员渠道（显示多级渠道）',
      dataIndex: 'sellerOrganizationNodeTreeDesc',
      align: 'center',
      width: 300,
    },
    // {
    //   title: '订单最后支付时间',
    //   dataIndex: 'order.payTime',
    //   align: 'center',
    //   width: 180,
    // },
    {
      title: '车辆状态',
      dataIndex: 'orderDetail.carItemStatus',
      align: 'center',
      width: 180,
      render (value , row) {
        // let status = row.orderDetail.carItemStatus;
        switch (value) {
          case 1: return '待售'; break;
          case 2: return '在库'; break;
          case 3: return '在途'; break;
          case 4: return '待采'; break;
          case 5: return '车源释放'; break;
          case 6: return '售出'; break;
          default: return '';
        }
      }
    },
    {
      title: '提车时长',
      dataIndex: 'order.payTime',
      align: 'center',
      width: 180,
      render(value, row) {
        return row.orderDetail.expectFetchTime && row.orderDetail.expectFetchTime + '天';
      }
    },
    {
      title: '操作',
      align: 'center',
      dataIndex: 'op',
      fixed: 'right',
      width: 120,
    },
  ];
}
