import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Card, BackTop, Table, Divider, Button, Icon } from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import { SubjectBean } from 'src/pages/activityManage/service';
import ContractService from '../service';
import moment from 'moment';
import AddModel from './indexPageModel';

@connect()
class SpecialManage extends React.PureComponent<BaseProps, any> {
  state = {
    list: [],
    loading: false,
    editid: null,
    isShowModal: false,
    total: 0,
    params: {
      page: 0,
      size: 10
    }
  };
  constructor(props: BaseProps) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['contract', '/contract/list']
    });
    this.queryList();
  }
  queryList = async () => {
    this.setState({
      loading: true
    });
    const { data, status, total } = await ContractService.getContractLists(this.state.params);
    const state: any = {
      loading: false
    };
    if (status === 200) {
      state.list = data;
      state.total = total;
    }
    this.setState(state);
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
  readContract(fileName) {
    const _fileName = fileName.split('/');
    const _file = _fileName[_fileName.length - 1];
    return '/usercenter/api/v0.1/aliyun/oss/mall-cms/' + _file;
  }
  render() {
    const columns: ColumnProps<any>[] = [
      {
        title: '合同ID',
        dataIndex: 'templateId',
        align: 'center',
        width: 250
      },
      {
        title: '合同标题',
        dataIndex: 'title',
        align: 'center',
        width: 300
      },
      {
        title: '所属套件',
        dataIndex: 'suites',
        align: 'center',
        width: 600,
        render: (val, row) => {
          const { suites } = row; 
          if (suites && suites instanceof Array) {
            return (
              <div>
                {
                  suites.map(item => {
                    return item.title;
                  }).join('')
                }
              </div>
            );
          }
          return ;
        }
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreate',
        align: 'center',
        width: 350,
        render: (val, row) => {
          const { gmtCreate } = row;
          return (
            <div>
              {gmtCreate && moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
            </div>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 300,
        render: (val, row) => {
          const { filePath } = row;
          return (
            <Fragment>
              {filePath && (
                <a href={this.readContract(filePath)} target="_blank">
                  查看
                </a>
              )}
              {filePath && <Divider type="vertical" />}
              <a href="JavaScript:void(0)" onClick={(e) => {this.handleEdit(row.id); }}>
                编辑
              </a>
            </Fragment>
          );
        }
      }
    ];
    const { special } = this.props;
    const { loading, params } = this.state;
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
      <PageHeaderLayout title="合同管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={(e) => {this.handleEdit(); }}>
                <Icon type="plus" />&nbsp;创建合同模板
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
        />
      </PageHeaderLayout>
    );
  }
}
export default SpecialManage;
