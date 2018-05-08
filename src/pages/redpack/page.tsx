import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Card, BackTop, Table, Divider, Button, Icon, message, Popconfirm, Tag, Badge } from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
// import PushService from './service';
import moment from 'moment';
import RedpackService from './service';
import RedpackModal from './Modal';

interface States {
  isShowModal: boolean;
  list: any[];
  loading: boolean;
  editid: number;
}
@connect()
export default class RedpackPage extends React.PureComponent <BaseProps, States> {
  state = {
    isShowModal: false,
    list: [],
    loading: false,
    editid: null
  };
  constructor(props: BaseProps) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/redpack']
    });
    this.queryList();
  }
  handleEdit = (editId = null as number) => {
    this.setState({
      editid: editId,
      isShowModal: true
    });
  }
  handleCancel = () => {
    this.setState({
      editid: null,
      isShowModal: false
    });
  }
  handleOk = () => {
    this.handleCancel();
    this.queryList();
  }
  async queryList() {
    this.setState({
      loading: true
    });
    const { data, status, total } = await RedpackService.queryList();
    const state: any = {
      loading: false,
    };
    if (status === 200) {
      state.list = data;
      // state.total = total;
    }
    this.setState(state);
  }
  handleConfirm = (id) => {
    RedpackService.toggleStatus(id).then(({ data, status }) => {
      if (status === 200) {
        message.success('操作成功');
        this.queryList();
      }
    });
  }
  render() {
    const columns: ColumnProps<any>[] = [
      {
        title: 'ID',
        dataIndex: 'id',
        // sorter: true,
        align: 'center',
        width: 100,
      },
      {
        title: '红包标题',
        dataIndex: 'title',
        // sorter: true,
        align: 'center',
        width: 300,
      },
      {
        title: '使用条件',
        dataIndex: 'description',
        align: 'center',
            // sorter: true,
        width: 400,
      },
      {
        title: '参加立得【分】',
        dataIndex: 'amount',
        width: 200,
        align: 'center',
      },
      {
        title: '邀请获得【分】',
        dataIndex: 'shareAmount',
        width: 200,
        align: 'center',
      },
      {
        title: '封顶金额【分】',
        dataIndex: 'limitAmount',
        width: 200,
        align: 'center',
      },
      {
        title: '图片',
        dataIndex: 'image',
        width: 200,
        align: 'center',
        render(value) {
          return <img style={{ height: '100px', width: 'auto' }} src={value} />;
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 200,
        align: 'center',
        render: (val) => {
          let colors: any = 'error';
          let content = '';
          if (val === 1) {
            colors = 'success';
            content = '已激活';
          }
          if (val === 2) {
            colors = 'error';
            content = '已禁用';
          }
          return <Badge status={colors} text={content} />;
          // return <Tag  color={colors}>{content}</Tag>;
        },
      },
      {
        title: '操作',
        dataIndex: 'op',
        align: 'center',
            // sorter: true,
        width: 300,
        render: (val, row) => {
          const { status, id } = row;
          const text =  status === 2 ? '激活' : '禁用';
          return (
            <Fragment>
              <Popconfirm
                title={`确认要${text}此红包吗?`}
                onConfirm={() => {this.handleConfirm(id); }}
              >
                <Button
                  size="small"
                  type={status === 2 ? 'primary' : 'danger'}
                  // onClick={(e) => {this.handleEdit(id); }}
                >
                {text}
                </Button>
              </Popconfirm>
              <Divider type="vertical" />
              <Button size="small" onClick={(e) => {this.handleEdit(id); }} >编辑</Button>
            </Fragment>);
        }
      },
    ];
    const { list, loading } = this.state;
    return (
      <PageHeaderLayout  title="红包管理"  >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
            <Button type="primary" onClick={(e) => {this.handleEdit(); }} >
              <Icon type="plus" />&nbsp;新增红包
            </Button>
            </div>
                <Table
                    loading={loading}
                    rowKey="id"
                    bordered
                    size="middle"
                    columns={columns}
                    dataSource={list}
                    pagination={false}
                />
          </div>
        </Card>
        <BackTop   style={{ right: '10px' }} />
        <RedpackModal
          isShowModal={this.state.isShowModal}
          editid={this.state.editid}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </PageHeaderLayout>
    );
  }
}
