import React from 'react';
import { Link } from 'dva/router';
import PageHeader, { PageHeaderProps } from '../components/PageHeader';
import styles from './PageHeaderLayout.less';
import BaseProps from '../declare/baseProps.d';

interface PageHeaderLayoutProps extends PageHeaderProps, BaseProps {

}

export default ({ children, wrapperClassName, top, ...restProps }: PageHeaderLayoutProps) => (
  <div style={{ margin: '-24px -24px 0' }} className={wrapperClassName}>
    {top}
    <PageHeader key="pageheader" {...restProps} linkElement={Link} />
    {children ? <div className={styles.content}>{children}</div> : null}
  </div>
);
