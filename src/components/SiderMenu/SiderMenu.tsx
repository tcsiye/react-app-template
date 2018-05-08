import { Form, Icon, Layout, Menu } from 'antd';
import pathToRegexp from 'path-to-regexp';
import React, { Component } from 'react';
import menuData from 'src/common/menu';
// import { urlToList } from '../utils/pathTools';
import MenuBean, { MenuType } from 'src/common/MenuBean';
import Link from 'umi/link';
import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;
const { ItemGroup } = Menu;
const getIcon = (icon) => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};
class SiderMenu extends Component<any, any> {
  constructor(props) {
    super(props);
  }
  public handleOpenChange = (openKeys: string []) => {
    this.props.onOpenChange(openKeys);
  }
  public getNavMenuItems = (menusData: MenuBean[]) => {
    if (!menusData) {
      return [];
    }
    function renderTitle(item) {
      return item.icon ? (
          <span>
            {getIcon(item.icon)}
            <span>{item.name}</span>
          </span>
        ) : (
          item.name
        );
    }
    return menusData.map((item) => {
      let view = null;
      switch (item.type) {
        case MenuType.SubMenu:
          view = (<SubMenu title={renderTitle(item)} key={item.path} >{this.getNavMenuItems(item.children)}</SubMenu>);
          break;
        case MenuType.ItemGroup:
          view = (
              <ItemGroup title={renderTitle(item)} key={item.name}  >
                {this.getNavMenuItems(item.children)}
              </ItemGroup>);
          break;
        case MenuType.Item:
          view = (
              <Menu.Item  key={item.path}   >
                <Link to={item.path}  >
                  {renderTitle(item)}
                </Link>
              </Menu.Item>);
          break;
        default:
          view = (
            <Menu.Item  key={item.path}   >
              <Link to={item.path}  >
                {renderTitle(item)}
              </Link>
            </Menu.Item>);
          break;
      }
      return view;
    });
  }
  public render() {
    const  { collapsed, onCollapse, logo, openKeys,  selectedKeys } = this.props;
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>淘汽电商管理平台</h1>
          </Link>
        </div>
        <Menu
          key="Menu"
          theme="dark"
          mode="inline"
          // {...menuProps}
          openKeys={openKeys}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(menuData)}
        </Menu>
      </Sider>
    );
  }
}
export default SiderMenu;
