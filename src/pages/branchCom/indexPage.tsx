import React, { Fragment } from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import { Card, BackTop, Table, Divider, Button, Icon, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import BranchComService from './service';
import BranchComModal from './Modal';

@connect()
class BranchComPage extends React.PureComponent <BaseProps, any> {
  state = {
    isShowModal: false,
    modalLoading: false,
    loading: false,
    list: [],
    modalType: 1,
    test: 0,
    formData: {

    } as any
  };
  constructor(props: BaseProps) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/branchCom']
    });
    this.queryCompaniesList();
  }
  handleEdit = (modalType: number, row = {}) => {
    this.setState({
      modalType,
      isShowModal: true
    });
    if (modalType !== 1) {
      this.setState({
        formData: row
      });
    } else {
      this.setState({
        formData: {}
      });
    }
  }
  handleSave = (form) => {
    if (this.state.modalType === 3) {
      this.setState({
        isShowModal: false
      });
      return;
    }
    form.validateFields({ force: true }, (err, values) => {
      this.setState({
        modalLoading: true
      });
      if (!err) {
        // tslint:disable-next-line:no-console
        console.log(values);
        if (this.state.formData.id) {
          values.id = this.state.formData.id;
        }
        const params = {  ...this.state.formData, ...values };
        BranchComService.saveCompanies(params).then(({ data, status }) => {
          this.setState({
            modalLoading: false
          });
          if (status === 200 || status === 201) {
            message.success(this.state.formData.id ? '编辑成功' : '添加成功');
            this.setState({
              isShowModal: false
            });
            this.queryCompaniesList();
          }
        });

      }
    });
  }
  handleDelete = (id) => {
    BranchComService.removeCompanies(id).then(({ data }) => {
      message.success('删除成功');
    });
  }
  handleCancel = (form) => {
    this.setState({
      isShowModal: false
    });
    setTimeout(() => {
      form.resetFields();
    }, 1);
  }
  async queryCompaniesList() {
    this.setState({
      loading: true
    });
    const { data, status } = await BranchComService.queryCompaniesList();
    const state: any = {
      loading: false,
    };
    if (status === 200) {
      state.list = data;
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
        title: '分公司名称',
        dataIndex: 'name',
        // sorter: true,
        align: 'center',
        width: 300,
      },
      {
        title: '分公司印章',
        dataIndex: 'sealUrl',
        align: 'center',
            // sorter: true,
        width: 200,
        render(val, row) {
          return <img src={val}  style={{ height: '80px', width: 'auto' }} />;
        }
      },
      {
        title: 'email',
        dataIndex: 'email',
        width: 200,
        align: 'center',
      },
      {
        title: '组织机构代码',
        dataIndex: 'organizationCode',
        width: 200,
        align: 'center',
      },
      {
        title: '合同签署公司名称',
        dataIndex: 'signName',
        width: 200,
        align: 'center',
      },
      {
        title: 'ERP地区(分公司)',
        dataIndex: 'erpCarAreaName',
        width: 200,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
            // sorter: true,
        width: 300,
        render: (val, row) => {
          const { filePath } = row;

          return (
            <Fragment>
              <Button size="small" onClick={(e) => {this.handleEdit(3, row); }}  >查看</Button>
              <Divider type="vertical" />
              <Button size="small" onClick={(e) => {this.handleEdit(2, row); }} >编辑</Button>
              <Divider type="vertical" />
              <Popconfirm title="确定要删除分公司吗" onConfirm={(e) => { this.handleDelete(row.id); }} >
              <Button type="danger"  size="small" >删除</Button>
              </Popconfirm>

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
    return (
      <PageHeaderLayout  title="分公司管理"  >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
            <Button type="primary" onClick={(e) => {this.handleEdit(1); }} >
              <Icon type="plus" />&nbsp;创建分公司
            </Button>
            </div>
                <Table
                    loading={loading}
                    rowKey="id"
                    bordered
                    size="middle"
                    columns={columns}
                    dataSource={list}
                />
          </div>
        </Card>
        {/* {MBranchComModal()} */}
        {/* <MBranchComModal/> */}
        <BranchComModal
          isShowModal={this.state.isShowModal}
          modalLoading={this.state.modalLoading}
          modalType={this.state.modalType}
          onCancel={this.handleCancel}
          onOk={this.handleSave}
          {...this.state.formData}
        />
        <BackTop   style={{ right: '10px' }} />
      </PageHeaderLayout>
    );
  }
}
export default BranchComPage;
