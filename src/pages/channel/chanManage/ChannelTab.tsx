import React, { Fragment } from 'react';
import BaseProps from 'src/declare/baseProps.d';
import styles from './indexPage.less';
import { Card, Button, Icon, Table, message, Popconfirm } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ChannelService from './service';
import ChannelEditModal from './ChannelEditModal';

export default class ChannelTab extends React.PureComponent<
  BaseProps & { channelId: string }
> {
  state = {
    loading: false,
    list: [],
    isShowModal: false,
    formData: {}
  };
  source = null;
  getColumns(): ColumnProps<any>[] {
    return [
      {
        title: '渠道ID',
        dataIndex: 'id',
        align: 'center',
        width: 100
      },
      {
        title: '渠道名',
        dataIndex: 'name',
        align: 'center',
        width: 100
      },
      {
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        width: 100,
        render() {
          return '销售';
        }
      },
      {
        title: '渠道层级数',
        dataIndex: 'levelNum',
        align: 'center',
        width: 100
      },
      {
        title: '下级渠道数',
        dataIndex: 'subNodeNum',
        align: 'center',
        width: 100
      },
      {
        title: '关联人数',
        dataIndex: 'relatedMemberNum',
        align: 'center',
        width: 100
      },
      {
        title: '关联总人数（包括下级渠道）',
        dataIndex: 'relatedTotalMemberNum',
        align: 'center',
        width: 200
      },
      {
        title: '关联商品数',
        dataIndex: 'relatedCarItemNum',
        align: 'center',
        width: 100
      },
      {
        title: '操作',
        dataIndex: 'op',
        align: 'center',
        width: 100,
        render: (val, row) => {
          return (
            <Fragment>
              <Button
                size="small"
                onClick={e => {
                  this.handleEdit(row);
                }}
              >
                编辑渠道
              </Button>
              <Popconfirm
                title="是否删除该渠道?"
                onConfirm={() => this.handleDelete(row.id)}
              >
                <Button
                  style={{ marginTop: 5 }}
                  size="small"
                  type="danger"
                >
                  删除
                </Button>
              </Popconfirm>
            </Fragment>
          );
        }
      }
    ];
  }
  handleEdit = (formData = {}) => {
    this.setState({
      formData,
      isShowModal: true
    });
  };
  handleCancel = () => {
    this.setState({
      formData: {},
      isShowModal: false
    });
  };
  handleOk = () => {
    this.setState({
      formData: {},
      isShowModal: false
    });
    this.queryOrganizations(this.props.channelId);
  };
  handleDelete = async id => {
    const { data, status } = await ChannelService.deleteOrganization(id);
    if (status === 200) {
      message.success('删除成功');
      this.queryOrganizations(this.props.channelId);
    }
  };
  queryOrganizations(channelId) {
    if (this.source) {
      this.source.cancel();
    }
    this.setState({
      loading: true
    });
    ChannelService.queryOrganizations(
      channelId,
      source => (this.source = source)
    )
      .then(({ data, status }) => {
        this.setState({
          loading: false
        });
        if (status === 200) {
          this.setState({
            list: data
          });
        }
      })
      .catch(error => {
        // tslint:disable-next-line:no-console
        console.log(error);
        this.setState({
          loading: false
        });
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.channelId !== this.props.channelId) {
      this.queryOrganizations(nextProps.channelId);
    }
  }
  render() {
    const { loading, list } = this.state;
    const columns = this.getColumns();
    return (
      <Card bordered={false} bodyStyle={{ padding: '0 10px 10px 25px' }}>
        <div className={styles.tableList}>
          <div className={styles.tableListOperator}>
            <Button
              type="primary"
              onClick={e => {
                this.handleEdit();
              }}
            >
              <Icon type="plus" />&nbsp;添加渠道
            </Button>
            <Button
              type="primary"
              onClick={e => {
                this.handleEdit();
              }}
            >
              <Icon type="plus" />&nbsp;下载二维码
            </Button>
          </div>
          <Table
            loading={loading}
            rowKey="id"
            bordered
            size="small"
            columns={columns}
            dataSource={list}
            // pagination={false}
            scroll={{ y: '600px' }}
          />
        </div>
        <ChannelEditModal
          isShowModal={this.state.isShowModal}
          formData={this.state.formData}
          channelId={this.props.channelId}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </Card>
    );
  }
}
