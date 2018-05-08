import {
    Avatar,
    Button,
    Divider,
    Dropdown,
    Icon,
    Menu,
    Spin,
    Tag,
    Tooltip
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';
@connect()
export default class GlobalHeader extends PureComponent<any, any> {
  constructor(props) {
    super(props);
  }
  componentWillUnmount() {
        // tslint:disable-next-line
        this.triggerResizeEvent['cancel']();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  handleLogout = () => {
    this.props.dispatch({
      type: 'user/logout'
    });
  }
  @Debounce(600)
    triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  render() {
    const menu = (
            <Menu className={styles.menu} selectedKeys={[]}>
                {/* <Menu.Item key="userCenter">
                    <Icon type="user" />个人中心
                </Menu.Item>
                <Menu.Item key="userinfo">
                    <Icon type="setting" />设置
                </Menu.Item> */}
                {/* <Menu.Divider /> */}
                <Menu.Item key="logout"   >
                    <div onClick={this.handleLogout}  ><Icon type="logout" />退出登录</div>
                </Menu.Item>
            </Menu>
        );
    const isMobile = false;
    const collapsed = false;
    return (
            <div className={styles.header}>
                {isMobile && [
                  <Link to="/" className={styles.logo} key="logo">
                        {/* <img src={logo} alt="logo" width="32" /> */}
                    </Link>,
                  <Divider type="vertical" key="line" />
                ]}
                <Icon
                    className={styles.trigger}
                    type={collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                />
                <div className={styles.right}>
                    <Dropdown overlay={menu}>
                        <span className={`${styles.action} ${styles.account}`}>
                            <Avatar
                                size="small"
                                className={styles.avatar}
                                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                            />
                            <span className={styles.name}>管理员</span>
                        </span>
                    </Dropdown>
                </div>
            </div>
    );
  }
}
