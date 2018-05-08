import { Icon } from 'antd';
import { Link, Redirect, Route, Switch } from 'dva/router';
import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import logo from '../assets/logo.svg';
// import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
// import { getRoutes } from '../utils/utils';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: ''
  },
  {
    key: 'privacy',
    title: '隐私',
    href: ''
  },
  {
    key: 'terms',
    title: '条款',
    href: ''
  }
];

const copyright = (
    <Fragment>
        Copyright <Icon type="copyright" /> 2018 蚂蚁金服体验技术部出品
    </Fragment>
);

class UserLayout extends React.PureComponent<any, any> {
  public render() {
    const { routerData, match } = this.props;
    return (
            <DocumentTitle title={'淘汽电商管理平台'}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.top}>
                            <div className={styles.header}>
                                <Link to="/">
                                    <img
                                        alt="logo"
                                        className={styles.logo}
                                        src={logo}
                                    />
                                    <span className={styles.title}>
                                        淘汽电商管理平台
                                    </span>
                                </Link>
                            </div>
                            {/* <div className={styles.desc}>Ant Design 是西湖区最具影响力的 Web 设计规范</div> */}
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </DocumentTitle>
    );
  }
}

export default UserLayout;
