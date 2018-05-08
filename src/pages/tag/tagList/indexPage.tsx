import React from 'react';
import router from 'umi/router';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import {
  BackTop,
  Table,
  Button,
  Input,
  Row,
  Col,
  Icon,
  Popconfirm,
  message
} from 'antd';
import { connect } from 'dva';
import styles from '../tag.less';
import { ColumnProps } from 'src/declare/antd/table';
import BaseProps from 'src/declare/baseProps';
import tagetService from 'src/pages/tag/service';
import _ from 'lodash';
import moment from 'moment';
import Link from 'umi/link';

const { Search } = Input;

@connect()
export default class TagetManage extends React.PureComponent<BaseProps, any> {
  state = {
    list: [],
    total: 0,
    historySearch: '',
    searchParams: {
      keyword: '',
      page: 1,
      size: 20
    }
  };

  constructor(props) {
    super(props);

    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['operate', '/tag/tagList']
    });
    this.initData();
  }

  // @debounce(300)

  async deltag(id: number) {
    const { status, data } = await tagetService.delHotTag(id);
    // tslint:disable-next-line:no-console
    console.log(status);
    if (status === 200) {
      this.initData();
      message.success('删除成功！');
    }
  }

  handleConfirm = id => {
    this.deltag(id);
  }

  // tslint:disable-next-line:member-ordering
  handleSearch = _.debounce(value => {
    this.state.searchParams.keyword = value;
    this.setState({});
    this.initData();
  }, 300);

  render() {
    const tabOption: ColumnProps<any> = { align: 'center', sorter: true };
    const columns: ColumnProps<any>[] = [
      {
        title: '序号',
        dataIndex: 'id',
        width: 70,
        key: 'id',
        ...tabOption,
        render: (text, record, index) => {
          const { page, size } = this.state.searchParams;
          return (page - 1) * size + index + 1;
        }
      },
      {
        title: 'Tag内容',
        dataIndex: 'name',
        key: 'name',
        ...tabOption
      },
      {
        title: '添加时间',
        dataIndex: 'gmtCreate',
        key: 'gmtCreate',
        ...tabOption,
        render: val => {
          return <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
      {
        title: '操作',
        dataIndex: 'act',
        key: 'act',
        width: 140,
        ...tabOption,
        render: (val, row) => {
          const { id } = row;
          // const path = { pathname: `/tag/creatTag?${id}`, state: { id } };
          return (
            <div>
              <Link className={styles.a_btn} to={`/tag/creatTag?id=${id}`}>
                <Icon type="edit" />
                编辑
              </Link>
              <Popconfirm
                title={`确认要删除这个标签吗?`}
                onConfirm={() => {
                  this.handleConfirm(id);
                }}
              >
                <a className={styles.a_btn} style={{ color: '#ff4949' }}>
                  <Icon type="delete" /> 删除
                </a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    const paginationProps = {
      // showSizeChanger: true,
      current: this.state.searchParams.page - 0,
      showQuickJumper: true,
      defaultPageSize: 20,
      onChange: (page, size) => {
        this.state.searchParams = { ...this.state.searchParams, page, size };
        this.initData();
      },
      total: this.state.total - 0
    };

    return (
      <PageHeaderLayout title="Tag列表">
        <div className={styles.body}>
          <Row gutter={{ xs: '20', sm: '20', md: '20', lg: '20' }}>
            <Col xs={4} sm={4} md={4} lg={4} className={styles.padding_b}>
              <Search
                placeholder="请输入关键字"
                onChange={value => this.handleSearch(value.target.value)}
              />
            </Col>
            <Col xs={4} sm={4} md={4} lg={4}>
              <Button
                type={'primary'}
                onMouseUp={() => {
                  router.push('/tag/creatTag');
                }}
              >
                新增
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <Table
                  className={styles.table_body}
                  columns={columns}
                  bordered
                  size={'small'}
                  // scroll={{ x: '1280px' }}
                  rowKey={record => record.id}
                  // rowSelection={rowSelection}
                  dataSource={this.state.list}
                  pagination={paginationProps}
                />
              </div>
            </Col>
          </Row>
          <BackTop />
        </div>
      </PageHeaderLayout>
    );
  }

  async initData() {
    // tslint:disable-next-line:no-console

    const { data, status, total } = await tagetService.queryHotTagList({
      ...this.state.searchParams,
      page: this.state.searchParams.page - 1
      // tslint:disable-next-line:no-console
    });

    this.setState({ total, list: data });
  }
}
