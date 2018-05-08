import React, { Fragment } from 'react';
import BaseProps from 'src/declare/baseProps.d';
import styles from './indexPage.less';
import {
  Card,
  Button,
  Icon,
  Table,
  Row,
  Input,
  Divider,
  Form,
  Modal,
  Select,
  message,
  Popconfirm,
  Upload
} from 'antd';
import { ColumnProps } from 'antd/lib/table';
import ChannelService from './service';
import AuthModel from '../AuthModel';
import RolesService from '../service';

function editModal(this: MemberTab, props: BaseProps) {
  const itemProps = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  };
  const { getFieldDecorator } = props.form;
  const handleCancel = () => {
    this.setState({
      isShowModal: false
    });
  };
  const handleOk = () => {
    props.form.validateFields({ force: true }, async (err, values) => {
      if (!err) {
        this.setState({
          modalLoading: true
        });
        const params = { ...values };
        params.userId = this.state.formData.userId;
        params.updateId = this.props.channelId;
        const { data, status } = await ChannelService.updateOrganizationMembers(
          params
        );
        this.setState({
          modalLoading: false
        });
        if (status === 200 || status === 201) {
          message.success('修改成功');
          this.setState({
            isShowModal: false
          });
          this.queryOrganizationMembers(this.props.channelId);
        }
      }
    });
  };
  return (
    <Modal
      title="编辑"
      visible={this.state.isShowModal}
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form>
        <Form.Item {...itemProps} label="姓名">
          <Input
            placeholder="请输入姓名"
            value={this.state.formData.memberName}
            disabled
          />
        </Form.Item>
        <Form.Item {...itemProps} label="选择角色">
          {getFieldDecorator('roleId', {
            initialValue: this.state.formData.roleId,
            rules: [{ required: true, message: '请选择角色' }]
          })(
            <Select>
              {this.state.roleList.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item {...itemProps} label="选择渠道">
          {getFieldDecorator('organizationId', {
            initialValue: this.state.formData.organizationId,
            rules: [{ required: true, message: '请选择渠道' }]
          })(
            <Select>
              {this.state.organList.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default class MemberTab extends React.PureComponent<
  BaseProps & { channelId: string }
> {
  state = {
    loading: false,
    addLoading: false,
    modalLoading: false,
    list: [],
    isShowRoleModal: false,
    roleId: null,
    isShowModal: false,
    formData: {} as any,
    roleList: [],
    organList: [],
    csvStr: ''
  };
  editModal = null;
  source = null;
  constructor(props) {
    super(props);
    this.editModal = Form.create({})(editModal.bind(this));
  }
  getColumns(): ColumnProps<any>[] {
    return [
      {
        title: '成员名',
        dataIndex: 'memberName',
        align: 'center',
        width: 100
      },
      {
        title: '成员电话',
        dataIndex: 'memberPhone',
        align: 'center',
        width: 100
      },
      {
        title: '添加人',
        dataIndex: 'addUserName',
        align: 'center',
        width: 100
      },
      {
        title: '成员相关信息',
        dataIndex: 'op',
        align: 'center',
        width: 400,
        render: (val, row) => {
          const { roleId, roleName, memberName, userId, organizationId } = row;
          return (
            <Fragment>
              <a
                href="JavaScript:void(0)"
                onClick={() => {
                  this.handleShowRole(roleId);
                }}
              >
                {roleName}
              </a>
              <Divider type="vertical" />
              <a
                href="JavaScript:void(0)"
                onClick={() => {
                  this.setState({
                    isShowModal: true,
                    formData: row
                  });
                  this.queryUserOrganizations(userId);
                }}
              >
                编辑
              </a>
              <Divider type="vertical" />
              <Popconfirm
                title="确认要删除该成员吗"
                onConfirm={() => this.handleDelete(row.userId)}
              >
                <a href="JavaScript:void(0)">删除</a>
              </Popconfirm>
            </Fragment>
          );
        }
      }
    ];
  }
  handleEdit = () => {
    //
  };
  handleDelete = async userid => {
    const { data, status } = await ChannelService.deleteOrganizationMembers(
      this.props.channelId,
      userid
    );
    if (status === 200) {
      message.success('删除成功');
    }
  };
  handleShowRole = roleId => {
    this.setState({
      roleId,
      isShowRoleModal: true
    });
  };
  handleCancleRole = e => {
    this.setState({
      roleId: null,
      isShowRoleModal: false
    });
  };
  handleSaveMember = async e => {
    if (!this.state.csvStr) {
      message.warning('未添加信息!');
      return;
    }
    this.setState({
      addLoading: true
    });
    const { data, status } = await ChannelService.addOrganizationMembers({
      csvStr: this.state.csvStr,
      organizationId: this.props.channelId
    });
    this.setState({
      addLoading: false
    });
    message.info(data.msg);

  };
  queryOrganizationMembers(channelId) {
    if (this.source) {
      this.source.cancel();
    }
    this.setState({
      loading: true
    });
    ChannelService.queryOrganizationMembers(
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
  async queryUserOrganizations(id) {
    // tslint:disable-next-line:no-shadowed-variable
    RolesService.queryRoles({}).then(({ data, status }) => {
      if (status === 200) {
        this.setState({
          roleList: data
        });
      }
    });
    const { data, status } = await ChannelService.queryUserOrganizations(id);
    if (status === 200) {
      this.setState({
        organList: data
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.channelId !== this.props.channelId) {
      this.queryOrganizationMembers(nextProps.channelId);
    }
  }
  componentWillMount() {
    this.queryOrganizationMembers(this.props.channelId);
  }
  render() {
    const { loading, list } = this.state;
    const columns = this.getColumns();
    const EditModal = this.editModal;
    return (
      <Fragment>
        <Card
          className={styles.listCard}
          bordered={false}
          title="已关联角色成员ID"
          style={{ height: 600 }}
          bodyStyle={{ padding: '0 10px 10px 25px' }}
        >
          <div className={styles.tableList}>
            <Table
              loading={loading}
              rowKey="id"
              bordered
              size="small"
              columns={columns}
              dataSource={list}
              pagination={false}
              scroll={{ y: '500px' }}
            />
          </div>
        </Card>
        <Card
          style={{ display: this.props.channelId === '0' ? 'none' : 'block' }}
          className={styles.listCard}
          bordered={false}
          title="添加角色成员ID"
          // style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 10px 10px 25px' }}
        >
          <Input.TextArea
            value={this.state.csvStr}
            onChange={e => this.setState({ csvStr: e.target.value })}
            placeholder="姓名和手机号码使用英文逗号隔开，不同用户使用换行分隔，参考CSV格式"
          />
          <div style={{ marginTop: 10 }}>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={this.handleSaveMember}
            >
              确定
            </Button>
            <Upload
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              showUploadList={false}
              action={`/usercenter/api/v0.1/organization-members/add/csv?organizationId=${this.props.channelId}`}
            >
            <Button icon="cloud-upload-o">批量导入成员</Button>
            </Upload>
          </div>
        </Card>
        <AuthModel
          isShowModal={this.state.isShowRoleModal}
          onCancel={this.handleCancleRole}
          onOk={this.handleCancleRole}
          roleId={this.state.roleId}
          islook
        />
        <EditModal />
      </Fragment>
    );
  }
}
