import React from 'react';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import UserLayout from 'src/layouts/UserLayout';
import withRouter from 'umi/withRouter';
import BasicLayout from './BasicLayout';

class MainLayout extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  public render() {
    const props = this.props;
    let layout = null;
    if (props.location.pathname === '/user/login') {
      layout = <UserLayout {...props} />;
    } else {
      layout = <BasicLayout {...props} />;
    }
    return (<LocaleProvider locale={zh_CN}>{layout}</LocaleProvider>);
  }
}

export default withRouter(MainLayout);
