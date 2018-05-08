import React from 'react';
import { Modal, Form, Input, message, DatePicker, Table, Checkbox } from 'antd';
import BaseProps from '../../declare/baseProps.d';
import RolesService from './service';
import styles from './rolePage.less';
import moment from 'moment';
import { ColumnProps } from 'antd/lib/table';
const FormItem = Form.Item;
interface AuthModalProps extends BaseProps {
  isShowModal: boolean;
  roleId: number;
  /** 是否只是单纯的查看 */
  islook?: boolean;
  onCancel: Function;
  onOk: Function;
}
const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};
@(Form.create as any)()
export default class AuthModal extends React.Component<AuthModalProps> {
  state = {
    loading: false,
    authList: [],
    hasAuth: [],
    checks: []
  };

  componentWillMount() {
    this.getAuthList();
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.isShowModal) {
      this.getAuthOfRole(nextProps.roleId);
    }
  }
  async getAuthList() {
    const { data, status } = await RolesService.getAuthList();

    this.setState({
      authList: data
    });
  }

  async getAuthOfRole(id) {

    const { data, status } = await RolesService.getAuthOfRole(id);

    if (status === 200) {
      this.setState({
        hasAuth: data
      }, () => {
        this.initAuthChecks();
      });
    }
  }

  async editAuthList(param) {
    const { data, status } = await RolesService.editAuthList(param);
    if (status === 200) {
      message.success('角色编辑成功！');
    } else {
      message.error('角色编辑失败！');
    }
    this.props.onCancel();
  }

  handleCancel = () => {
    this.setState({
      checks: {}
    });
    this.props.onCancel();
  }

  handleOk = () => {
    const { roleId } = this.props;
    const param: any = {
      roleId,
      bindAuthorityList: [],
      unBindAuthorityList: []
    };
    const { authList, checks } = this.state;
    authList.map(auth => {
      if (checks[auth.id]) {
        param.bindAuthorityList.push(auth.id);
      } else {
        param.unBindAuthorityList.push(auth.id);
      }
    });

    this.editAuthList(param);
  }

  initAuthChecks = () => {
    const { authList, hasAuth } = this.state;

    const checks = {};
    authList.map(list => {
      list.authorityList.map(auth => {
        checks[auth.id] = false;
      });
    });

    hasAuth.map(auth => {
      checks[auth.authorityId] = true;
    });

    this.setState({
      checks
    });

  }

  render() {
    const params: any = {};
    if (this.props.islook) {
      params.footer = false;
    }
    const columns: ColumnProps<any>[] = [
      {
        title: '权限模块',
        dataIndex: 'name',
        width: 200,
        align: 'center'
      },
      {
        title: '权限内容',
        dataIndex: 'authorityList',
        width: 740,
        render: (val, row) => {
          return val.map((auth, index) => (
            <span className={styles.width100} key={index}>
              <Checkbox
                checked={this.state.checks[auth.id]}
                className={styles.padding10}
                disabled={this.props.islook}
                onChange={e => {

                  const checks: any = this.state.checks;
                  checks[auth.id] = e.target.checked;
                  this.setState({
                    checks
                  });
                }}
              />
              {auth.name}
            </span>
          ));
        }
      }
    ];
    return (
      <Modal
        visible={this.props.isShowModal}
        confirmLoading={this.state.loading}
        width={1000}
        title="关联权限"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        {...params}
      >
        <Table
          bordered
          size="middle"
          columns={columns}
          dataSource={this.state.authList}
          rowKey={auth => auth.id}
          pagination={false}
        />
      </Modal>
    );
  }
}
