import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import {
    Card,
    BackTop,
    Table,
    Divider,
    Button,
    Icon,
    message,
    Popconfirm,
    Badge,
    Modal,
    Form,
    Input
} from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import PushService from './service';
import moment from 'moment';
import PushModal from './Modal';
const  FormItem  = Form.Item;

@connect()
export default class PushListPage extends React.PureComponent <BaseProps, any> {
  state = {
    isShowModal: false,
    isShowPreviewsModal: false,
    previewsModalLoading: false,
    list: [],
    editid: null,
    loading: false,
    size: 20,
    page: 1,
    total: 0,
    pushEventId: null as number,
    phoneList: null as string
  };
  constructor(props: BaseProps) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/push/pushList']
    });
    this.queryList();
  }
  handleEdit = (editid = null) => {
    this.setState({
      editid,
      isShowModal: true
    });
  }
  handleCancel = () => {
    this.setState({
      isShowModal: false,
      editid: null,
    });
  }
  handlePush = (id) => {
    PushService.push(id).then(({ data, status }) => {
      message.success('推送成功！');
      this.queryList();
    });
  }
  handlePreviews = () => {
    if (!this.state.phoneList) {
      message.warning('信息未填写');
      return;
    }
    this.setState({
      previewsModalLoading: true
    });
    const params = {
      phoneList: this.state.phoneList.split(','),
      pushEventId: this.state.pushEventId
    };
    PushService.preview(params).then(({ data, status }) => {
      this.setState({
        previewsModalLoading: false
      });
      if (status === 200 || status === 201) {
        message.success('设置成功!');
      }
    });
  }
  async queryList() {
    this.setState({
      loading: true
    });
    const { data, status, total } = await PushService.queryList({ page: this.state.page - 1, size: this.state.size });
    const state: any = {
      loading: false,
    };
    if (status === 200) {
      state.list = data;
      state.total = total;
    }
    this.setState(state);
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
        title: '标题',
        dataIndex: 'messageDTO.title',
        // sorter: true,
        align: 'center',
        width: 300,
      },
      {
        title: '副标题',
        dataIndex: 'messageDTO.subTitle',
        align: 'center',
            // sorter: true,
        width: 300,
      },
      {
        title: '推送对象',
        dataIndex: 'pushObjectType',
        width: 100,
        align: 'center',
        render(val, row) {
          return row.pushObjectType === 0 ? '全部用户' : row.pushObjectType === 1 ? '指定标签' : '指定regID';
        }
      },
      {
        title: '推送时间',
        dataIndex: 'opPushTime',
        width: 200,
        align: 'center',
        render: (val) => {
          if (!val) {
            return '-';
          }
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'pushStatus',
        width: 100,
        align: 'center',
        render: (val, row) => {
          if (val) {
            return <Badge status="success" text="已推送" />;
          }
          return (
          <Fragment><Badge status="default" />
           <Popconfirm title="确定立即推送？" onConfirm={(e) => { this.handlePush(row.id); }} >
            <a href="JavaScript:void(0)" onClick={this.handlePreviews} >立即推送</a>
           </Popconfirm>
          </Fragment>
          );
        },
      },
      {
        title: '预览',
        dataIndex: 'previews',
        width: 100,
        align: 'center',
        render: (val, row) => {

          return (
                 <a
                  href="JavaScript:void(0)"
                  onClick={() => {this.setState({ isShowPreviewsModal: true, pushEventId: row.id }); }}
                 >
                  预览
                 </a>
          );

        },
      },
      {
        title: '操作',
        dataIndex: 'op',
        align: 'center',
            // sorter: true,
        width: 100,
        render: (val, row) => {
          const { id } = row;

          return (
            <Fragment>
              <Button icon="edit" size="small" onClick={(e) => {this.handleEdit(id); }} />
            </Fragment>);
        }
      },
    ];
    const { list, loading } = this.state;
    // const MBranchComModal = () => (
    // <BranchComModal
    //   isShowModal={this.state.isShowModal}
    //   onCancel={this.handleCancel}
    //   onOk={this.handleSave}
    //   {...this.state.formData}
    // />);
    const paginationProps = {
      // showSizeChanger: true,
      current: this.state.page,
      showQuickJumper: true,
      defaultPageSize: this.state.size,
      onChange: async (page, pageSize) => {
        await this.setState({
          page,
          size: pageSize
        });

        // tslint:disable-next-line:no-console
        this.queryList();
      },
      total: this.state.total - 0,
    };
    const itemProps = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    return (
      <PageHeaderLayout  title="推送管理"  >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
            <Button type="primary" onClick={(e) => {this.handleEdit(); }} >
              <Icon type="plus" />&nbsp;新增推送
            </Button>
            </div>
                <Table
                    loading={loading}
                    rowKey="id"
                    bordered
                    size="middle"
                    columns={columns}
                    dataSource={list}
                    pagination={paginationProps}
                />
          </div>
        </Card>
        <BackTop   style={{ right: '10px' }} />
        <PushModal
          isShowModal={this.state.isShowModal}
          onCancel={this.handleCancel}
          onOk={this.handleCancel}
          editid={this.state.editid}
        />
        <Modal
          title="推送预览"
          confirmLoading={this.state.previewsModalLoading}
          onCancel={() => {
            this.setState({
              isShowPreviewsModal: false,
              phoneList: null,
              pushEventId: null,
            });
          }}
          onOk={this.handlePreviews}
          visible={this.state.isShowPreviewsModal}
        >
        <FormItem {...itemProps} label="电话列表">
          <Input
            placeholder="请输入电话列表"
            value={this.state.phoneList}
            onChange={(e) => {
              this.setState({
                phoneList: e.target.value
              });
            }}
          />
        </FormItem>
        <span>电话列表以','隔开,类似'131xxxxxxxx,131xxxxxxxx,131xxxxxxxx'</span>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
