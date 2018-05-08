import React, { Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import BaseProps from 'src/declare/baseProps';
import { ColumnProps } from 'src/declare/antd/table';
import moment from 'moment';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Card, BackTop, Table, Divider, Button, Icon } from 'antd';
import styles from './suitLists.less';
import ContractService from '../service';
import AddModel from './addModel';
import JoinChan from './addChan';

@connect()
export default class SuitManagePage extends React.PureComponent <BaseProps, any> {
  state = {
    params: {
      page: 0,
      size: 10
    },
    isShowModal: false,
    isJoinShow: false,
    total: 0,
    list: [],
    editid: null,
    channel: [],
    loading: false,
    versionLists: []
  };
  constructor(props: BaseProps) {
    super(props);
  }
  handleEdit = (editid = null) => {
    this.setState({
      editid,
      isShowModal: true
    });
  }
  handleCancel = () => {
    this.setState({
      isShowModal: false
    });
  }
  handleEdit2 = (editid = null) => {
    this.setState({
      editid,
      isJoinShow: true
    });
  }
  handleCancel2 = () => {
    this.setState({
      isJoinShow: false
    });
  }
  queryList = async () => {
    this.setState({
      loading: true
    });
    const { data, status, total } = await ContractService.getSuitsLists(this.state.params);
    const state: any = {
      loading: false,
    };
    if (status === 200) {
      state.list = data;
      state.total = total;
    }
    this.setState(state);
  }
  getJoinChan = async () => {
    const { data, status } = await ContractService.getChannelTree();
    if (status === 200) {
      this.setState({
        channel: data.map(item => {
          item.chosen = false;
          item.key = item.id;
          item.title = item.name;
          return item;
        })
      });
    }
  }
  getVersionLists = async () => {
    const { data, status } = await ContractService.getContractVersion();
    if (status === 200) {
      this.setState({
        versionLists: data.map(item => {
          return { label: item.title, value: item.id };
        })
      });
    }
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['contract', '/contract/suit']
    });
    this.queryList();
    this.getJoinChan();
    this.getVersionLists();
  }
  render() {
    const columns: ColumnProps<any>[] = [
      {
        title: '合同套件ID',
        dataIndex: 'id',
        align: 'center',
        width: 200
      },
      {
        title: '套件标题',
        dataIndex: 'title',
        align: 'center',
        width: 300
      },
      {
        title: '合同数',
        dataIndex: 'contractNum',
        align: 'center',
        width: 200,
        render: (val, row) => {
          if (row.bindContractTemplates && row.bindContractTemplates instanceof Array) { 
            return row.bindContractTemplates.length;
          }
        }
      },
      {
        title: '合同标题',
        dataIndex: 'contractTemp',
        align: 'center',
        width: 400,
        render: (val, row) => {
          const { bindContractTemplates } = row;
          if (bindContractTemplates && bindContractTemplates instanceof Array) {
            const title = bindContractTemplates.map(item => {
                return item.second;
            }).join(',');
            return title;
          }
          return ;
        }
      },
      {
        title: '关联一级渠道数',
        dataIndex: 'organizationCount',
        align: 'center',
        width: 200
      },
      {
        title: '套件说明',
        dataIndex: 'remark',
        align: 'center',
        width: 250
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        align: 'center',
        width: 250,
        render: (val, row) => {
          return (
            <div>
              {row.gmtCreate && moment(row.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'operater',
        align: 'center',
        width: 250,
        render: (val, row) => {
          return (
            <Fragment>
              <a href="JavaScript:void(0)" onClick={(e) => {this.handleEdit(row.id); }}>
                编辑
              </a>
              <Divider type="vertical" />
              <a href="JavaScript:void(0)" onClick={(e) => {this.handleEdit2(row.id); }}>
                关联渠道
              </a>
            </Fragment>
          );
        }
      },
    ];
    const { special } = this.props;
    const { params, loading } = this.state;
    const paginationProps = {
      current: params.page + 1,
      showQuickJumper: true,
      defaultPageSize: params.size,
      onChange: async (page, pageSize) => {
        await this.setState({
          params: {
            page: page - 1,
            size: pageSize
          }
        });
        this.queryList();
      },
      total: this.state.total - 0,
    };
    return (
      <PageHeaderLayout title="套件列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={(e) => {this.handleEdit(); }}>
                <Icon type="plus" />&nbsp;创建合同套件
              </Button>
            </div>
            <Table
              loading={loading}
              rowKey="id"
              bordered
              size="middle"
              columns={columns}
              dataSource={this.state.list}
              pagination={paginationProps}
            />
          </div>
        </Card>
        <BackTop style={{ right: '10px' }} />
        <AddModel 
          isShowModal={this.state.isShowModal}
          editid={this.state.editid}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
          reload={this.queryList}
          versionLists={this.state.versionLists}
        />
        <JoinChan
          isShowModal={this.state.isJoinShow}
          editid={this.state.editid}
          onCancel={this.handleCancel2}
          onOk={this.handleCancel2}
          reload={this.queryList}
          channel={this.state.channel}
        />
      </PageHeaderLayout>
    );
  }
}
