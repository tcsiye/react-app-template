import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import React from 'react';
import BaseProps from 'src/declare/baseProps';
import { Card, Col, Row } from 'antd';
import BannerItem from './bannerItem';
import Service from '../service';
import Func from './getURLObj';
import LinkModal from 'src/pages/homeConfig/banner/linkModal';

export default class BannerManage extends React.Component<BaseProps> {
  state = {
    loading: false,
    list: [],
    isShowModal: false,
    currIndex: null
  };
  menuChange = ({ value, index }) => {
    const { list } = this.state;
    const toItem = list[index]; // 当前位置
    const formItem = list[value]; // 移动到的位置
    list.splice(index, 1, formItem);
    list.splice(value, 1, toItem);
    this.setState({
      list
    });
  }
  handleCancel = () => {
    this.setState({
      isShowModal: false
    });
  }
  clickHandle = (index) => {
    this.setState({
      isShowModal: true,
      currIndex: index
    });
  }
  setValue = ({ index, value }) => {
    this.state.list[index].actionUrl = value;
  }
  handleCreate = (value) => {
    this.handleCancel();
    const { list } = this.state;
    const item = list[this.state.currIndex];
    item.actionUrl = value;
    item.newActionUrl = Func.getURLObj(value);
    this.setState({
      list
    });
  }
  handlerEditor = (url) => {
    const { list, currIndex } = this.state;
    const item = list[currIndex];
    item.picUrl = url;
    list.splice(currIndex, 1, item);
    this.setState({
      list
    });
  }
  async componentWillMount() {
    const { data, status } = await Service.getBannerList();
    if (status === 200) {
      data.content = data.content.map((item, i) => {
        if (item.picUrl) {
          item.newActionUrl = Func.getURLObj(item.actionUrl);
        }
        return item;
      });
      this.setState({
        list: data.content
      });
    }
  }
  render() {
    const { list, isShowModal, currIndex } = this.state;
    return (
      <PageHeaderLayout title="banner管理">
        <Card bordered={false}>
          <Row gutter={16}>
          {list.map((item, i) => 
            <Col span={8} key={i}>
              <BannerItem 
                banner={item} 
                len={list.length} 
                index={i} 
                menuChange={this.menuChange} 
                click={this.clickHandle}
                setValue={this.setValue}
                handlerEditor={this.handlerEditor}
              />
            </Col>
          )}
          </Row>
        </Card>
        <LinkModal 
          isShowModal={isShowModal} 
          index={currIndex} 
          onCancel={this.handleCancel}
          onOk={this.handleCreate}
        />
      </PageHeaderLayout>
    );
  }
}