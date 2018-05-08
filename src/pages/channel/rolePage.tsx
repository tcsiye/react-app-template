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
  Form,
  Row,
  Col,
  Input,
  Modal,
  message
} from 'antd';
import { connect } from 'dva';
import styles from './rolePage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import RolesService from './service';
import EditModal from './EditModel';
import AuthModal from 'src/pages/channel/AuthModel';

const FormItem = Form.Item;

const confirm = Modal.confirm;

@connect()
class RoleManage extends React.PureComponent<BaseProps, any> {
  constructor(props: BaseProps) {
    super(props);
    this.state = {
      isShowEditModal: false,
      isShowAuthModal: false,
      name: null,
      list: [],
      curRole: {},
      curRoleAuth: null,
      curId: null
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['channel', '/channel/role']
    });
    this.queryRoles();
  }

  async queryRoles() {
    this.setState({
      loading: true
    });

    const params = {
      name: this.state.name
    };
    const { data, status } = await RolesService.queryRoles(params);
    const state: any = {
      loading: false
    };
    if (status === 200) {
      state.list = data;
    }
    this.setState(state);
  }

  async deleteRoles(id) {
    const { data, status } = await RolesService.deleteRoles(id);
    if (status === 200) {
      message.success('角色删除成功！');
      this.queryRoles();
    } else {
      message.error(data.message);
    }
  }

  async getAuthOfRole(id) {

    const { data, status } = await RolesService.getAuthOfRole(id);

    if (status === 200) {
      this.setState({
        curRoleAuth: data,
        isShowAuthModal: true,
        curId: id
      });
    }
  }

  handleEdit = (row?: any) => {
    this.setState({
      isShowEditModal: true,
      curRole: row
    });
  }

  handleDelete = (row, that) => {
    const { id } = row;
    confirm({
      title: '确认删除角色',
      content: '是否确认删除？',
      onOk() {
        return that.deleteRoles(id);
      },
      onCancel() {
        //
      },
    });
  }

  handleAuth = (row) => {
    const { id } = row;
    // this.getAuthOfRole(id);
    this.setState({
      curId: id,
      isShowAuthModal: true
    });
  }

  handleFormReset = () => {
    this.setState({
      name: null
    });
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   const falg = JSON.stringify(nextProps) !== JSON.stringify(this.props);
  //   const falg2 = JSON.stringify(nextState) !== JSON.stringify(this.state);
  //   return falg || falg2;
  // }
  render() {
    const columns: ColumnProps<any>[] = [
      {
        title: '角色ID',
        dataIndex: 'id',
        // sorter: true,
        align: 'center',
        width: 100
      },
      {
        title: '角色类型',
        dataIndex: 'name',
        align: 'center',
        width: 200
      },
      {
        title: '角色操作',
        dataIndex: 'operation',
        align: 'center',
        // sorter: true,
        width: 200,
        render: (val, row) => {
          return (
            <Fragment>
              <a href="JavaScript:void(0)" onClick={() => this.handleEdit(row)}>
                编辑
              </a>
              <Divider type="vertical" />
              <a href="JavaScript:void(0)" onClick={() => this.handleDelete(row, this)}>
                删除
              </a>
            </Fragment>
          );
        }
      },
      {
        title: '角色管理',
        dataIndex: 'manage',
        align: 'center',
        // sorter: true,
        width: 200,
        render: (val, row) => {
          return (
            <Fragment>
              <a href="JavaScript:void(0)" onClick={() => this.handleAuth(row)}>
              关联权限
              </a>
            </Fragment>
          );
        }
      }
    ];
    const { list, submitting } = this.state;
    const itemProps = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    };
    return (
      <PageHeaderLayout title="角色管理">
        <Card bordered={false}>
          <Form>
            <Row gutter={{ md: '8', lg: '24', xl: '48' }}>
              <Col md={8} sm={24}>
                <FormItem label="角色类型" {...itemProps}>
                  <Input
                    value={this.state.name}
                    onChange={e => {
                      this.setState({
                        name: e.currentTarget.value
                      });
                    }}
                    placeholder=""
                  />
                </FormItem>
              </Col>
              <span style={{ float: 'right' }}>
              <Button
                type="primary"
                loading={this.state.loading}
                onClick={() => this.queryRoles()}
              >
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
            </Row>

          </Form>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleEdit()}>
                <Icon type="plus" />&nbsp;添加角色
              </Button>
            </div>
            <Table
              loading={submitting}
              bordered
              size="middle"
              columns={columns}
              dataSource={list}
              rowKey={record => record.id}
            />
          </div>
        </Card>
        <EditModal
          isShowModal={this.state.isShowEditModal}
          data={this.state.curRole}
          onOk={() => {
            this.setState({
              isShowEditModal: false,
              curRole: {}
            });
            this.queryRoles();
          }}
          onCancel={() => {
            this.setState({
              isShowEditModal: false,
              curRole: {}
            });
          }}
        />
        <AuthModal
         isShowModal={this.state.isShowAuthModal}
         roleId={this.state.curId}
         onOk={() => {
           this.setState({
             isShowAuthModal: false
           });
           this.queryRoles();
         }}
         onCancel={() => {
           this.setState({
             isShowAuthModal: false
           });
         }}
        />
        <BackTop style={{ right: '10px' }} />
      </PageHeaderLayout>
    );
  }
}
export default RoleManage;
