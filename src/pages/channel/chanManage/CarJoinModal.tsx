import React, { Fragment } from 'react';
import BaseProps, { BaseModalProps } from 'src/declare/baseProps.d';
import { Modal, Form, Card, Transfer, Row, Spin } from 'antd';
import CarService from 'src/pages/car/service';
import styles from './CarJoinModal.less';

const itemProps = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

export default class CarJoinModal extends React.Component<BaseModalProps & {bindCarItemList: any[]}> {
  state = {
    list: [],
    targetKeys: [],
    loading: false,
  };
  handleCancel = (e?) => {
    this.props.onCancel();
  };
  handleOk = e => {
    this.props.onOk(this.state.targetKeys);
    this.handleCancel();
  };
  // handleSearchChange = (e, f) => {
  //   // tslint:disable-next-line:no-console
  //   console.log(e);
  //   // tslint:disable-next-line:no-console
  //   console.log(f);
  // }
  handleChange = (targetKeys) => {
    this.setState({ targetKeys });
  }
  async queryCarItems() {
    this.setState({
      loading: true
    });
    const { data, status } = await CarService.queryCarItems({
      size: 500,
      status: 2
    });
    const list = data.map(item => {
      return {
        item,
        key: item.id,
        title: item.name,
        description: item.name,
        disabled: false,
      };
    });
    if (status === 200) {
      this.setState({
        list
      });
    }
    this.setState({
      loading: false
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isShowModal && nextProps.isShowModal !== this.props.isShowModal) {
      this.queryCarItems();
      this.setState({
        targetKeys: nextProps.bindCarItemList
      });
    }
  }
  renderItem = record => {
    const item = record.item;
    const customLabel = (
    <div className={styles.transferItem}  >
    <div  className={styles.block} >
    <div  className={styles.image} >
      <img src={item.feedsPicUrl}  />
    </div>
    <div className={styles.info}   >
      <p>{item.name}</p>
      <p>{item.gmtModified}</p>
    </div>
    </div>
    </div>
    );
    return {
      label: customLabel, // for displayed item
      value: item.name, // for title and filter matching
    };
    // return record.title;
  };
  render() {
    return (
      <Modal
        width="1200px"
        visible={this.props.isShowModal}
        title="关联车辆"
        onCancel={this.handleCancel}
        onOk={this.handleOk}
      >

        <Card  >
        <Spin size="large" tip="数据加载中请稍等..."  spinning={this.state.loading}  >
          <Transfer
            showSearch
            titles={['未关联', '已关联']}
            dataSource={this.state.list}
            listStyle={{
              width: 500,
              height: 600
            }}
            lazy={false}
            targetKeys={this.state.targetKeys}
            // onSearchChange={this.handleSearchChange}
            onChange={this.handleChange}
            render={this.renderItem}
          />
           </Spin>
        </Card>

      </Modal>
    );
  }
}
