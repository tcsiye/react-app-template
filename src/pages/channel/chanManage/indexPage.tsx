import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Card, Layout, Input, Tree, Tabs, Icon, Switch } from 'antd';
import styles from './indexPage.less';
import PageHeaderLayout from 'src/layouts/PageHeaderLayout';
import ChannelService from './service';
import BaseProps from '../../../declare/baseProps.d';
import { Bind } from 'lodash-decorators/bind';
import { Debounce } from 'lodash-decorators/debounce';
import ChannelTab from './ChannelTab';
import MemberTab from './MemberTab';
const { TreeNode } = Tree;

interface Trees {
  id: string;
  parentId: string;
  name: string;
  leaf: boolean;
  payType: number;
  children?: Trees[];
}
@connect()
export default class ChannelPage extends React.Component<BaseProps> {
  state = {
    treeList: [] as Trees[],
    search: '',
    isShowTree: true,
    autoExpandParent: false,
    channelId: null
  };
  expandedKeys = [];
  treeList: Trees[] = [];
  componentWillMount() {
    this.props.dispatch({
      type: 'app/updateMenukey',
      payload: ['channel', '/channel/chanManage']
    });
    setTimeout(() => {
      this.setState({
        channelId: '0'
      });
    }, 0);
    this.getTreeList();
  }
  getTreeNode(children: Trees[]) {
    if (!children) {
      return null;
    }
    // tslint:disable-next-line:no-debugger
    // debugger;
    return children
      .map(item => {
        const mchilder = this.getTreeNode(item.children);

        if (
          (mchilder && mchilder.length > 0) ||
          item.name.indexOf(this.state.search) >= 0
        ) {
          const index = item.name.indexOf(this.state.search);
          const beforeStr = item.name.substr(0, index);
          const afterStr = item.name.substr(index + this.state.search.length);
          // if (this.state.search !== '') { this.expandedKeys.push(item.id); }

          const title =
            index > -1 ? (
              <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{this.state.search}</span>
                {afterStr}
              </span>
            ) : (
              <span>{item.name}</span>
            );
          return (
            <TreeNode title={title} key={item.id}>
              {mchilder}
            </TreeNode>
          );
        }
        return null;
      })
      .filter(item => item);
  }
  async getTreeList() {
    const { data, status } = await ChannelService.queryTreeList();
    if (status === 200) {
      // this.treeList = data;
      this.setState({
        treeList: data
      });
    }
  }

  @Bind()
  handleSearch(e) {
    const value = e.target.value;
    this.upSearch(value);
  }
  @Debounce(300)
  upSearch(value) {
    this.expandedKeys = [];
    this.setState({
      search: value,
      autoExpandParent: true
    });
  }

  @Bind()
  // @Debounce(100)
  onSelect(selectedKeys, info) {
    // tslint:disable-next-line:no-console
    if (selectedKeys.length === 0) {
      return;
    }
    this.setState({
      channelId: selectedKeys[0]
    });
  }
  render() {
    // tslint:disable-next-line:no-console
    // console.log(this.getTreeNode(this.state.treeList));
    const title = (
      <div>
        渠道管理{' '}
        <Switch
          checked={this.state.isShowTree}
          onChange={v => this.setState({ isShowTree: v })}
          checkedChildren="展开"
          unCheckedChildren="收起"
        />
      </div>
    );
    return (
      <PageHeaderLayout title={title}>
        <div className={styles.container}>
          <div
            style={{ display: this.state.isShowTree ? 'block' : 'none' }}
            className={styles.leftBlock}
          >
            <Input.Search
              style={{ marginBottom: 8 }}
              onChange={this.handleSearch}
            />
            <div className={styles.treeBlock}>
              <Tree
                showLine
                // expandedKeys={this.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                defaultExpandedKeys={['0']}
                onSelect={this.onSelect}
              >
                <TreeNode title={'淘汽互联'} key={'0'}>
                  {this.getTreeNode(this.state.treeList)}
                </TreeNode>
              </Tree>
            </div>
          </div>
          <div className={styles.rightBlock}>
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type="fork" />渠道管理
                  </span>
                }
                key="1"
              >
                <ChannelTab channelId={this.state.channelId} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={
                  <span>
                    <Icon type="user" />成员管理
                  </span>
                }
                key="2"
              >
                <MemberTab channelId={this.state.channelId} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
