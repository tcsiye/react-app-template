import { Icon, Layout, message } from 'antd';
import classNames from 'classnames';
import { connect } from 'dva';
import { enquireScreen } from 'enquire-js';
import React, { Fragment } from 'react';
import { ContainerQuery } from 'react-container-query';
import DocumentTitle from 'react-document-title';
import logo from 'src/assets/logo.svg';
import GlobalHeader from 'src/components/GlobalHeader';
import SiderMenu from 'src/components/SiderMenu';
import styles from './BasicLayout.less';
const { Content, Header, Footer } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile: boolean;
enquireScreen(b => {
  isMobile = b;
});

@connect(({ app }) => ({
  app,
}))
class BasicLayout extends React.PureComponent<any, any> {
    // tslint:disable-next-line:typedef
  constructor(props) {
    super(props);
    this.state = {
      isMobile,
    };
  }
  public componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.props.dispatch({
        type: 'app/updateSelectedKeys',
        payload: [nextProps.location.pathname],
      });
    }
  }
  public handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: 'app/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  public handleOpenChange = openKeys => {
    this.props.dispatch({
      type: 'app/updateOpenKeys',
      payload: openKeys,
    });
  }
  public getLayout(props) {
    const { app } = props;
    return (
            <Layout>
                <SiderMenu
                    logo={logo}
                    isMobile={this.state.isMobile}
                    collapsed={this.props.app.collapsed}
                    openKeys={this.props.app.openKeys}
                    selectedKeys={this.props.app.selectedKeys}
                    onCollapse={this.handleMenuCollapse}
                    onOpenChange={this.handleOpenChange}
                />
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <GlobalHeader
                            isMobile={this.state.isMobile}
                            collapsed={this.props.app.collapsed}
                            onCollapse={this.handleMenuCollapse}
                        />
                    </Header>
                    <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
    );
  }
  public render() {
    const layout = (
            <Layout>
                <SiderMenu
                    logo={logo}
                    isMobile={this.state.isMobile}
                    collapsed={this.props.app.collapsed}
                    openKeys={this.props.app.openKeys}
                    selectedKeys={this.props.app.selectedKeys}
                    onCollapse={this.handleMenuCollapse}
                    onOpenChange={this.handleOpenChange}
                />
                <Layout>
                    <Header style={{ padding: 0 }}>
                        <GlobalHeader
                            isMobile={this.state.isMobile}
                            collapsed={this.props.app.collapsed}
                            onCollapse={this.handleMenuCollapse}
                        />
                    </Header>
                    <Content style={{ margin: '24px 24px 0', height: '100%' }}>
                        {this.props.children}
                    </Content>
                </Layout>
            </Layout>
        );
    return (
            <DocumentTitle title={'淘汽电商管理平台'}>
                <ContainerQuery query={query}>
                    {params => (<div className={classNames(params)}>{layout}</div>)}
                </ContainerQuery>
            </DocumentTitle>
    );
  }
}

export default BasicLayout;
