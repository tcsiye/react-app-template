import BaseProps from '../../../declare/baseProps';
import React from 'react';
import { Card, Menu, Icon, Dropdown } from 'antd';
import { connect } from 'dva';
import styles from './indexPage.less';
import LinkGener from 'src/components/Linkgener';
import EditorTool from './editorTool';

export default class BannerItem extends React.Component<BaseProps> {
  state = {
    isShowModal: false
  };
  menuChange = (value) => {
    this.props.menuChange({ value, index: this.props.index });
  }
  render() {
    const { banner, len, index } = this.props;
    const { isShowModal } = this.state;
    let arr = [];
    // tslint:disable-next-line:prefer-array-literal
    arr = new Array(len).fill('');
    const menu = (
      <Menu>
          {arr.map((item, i) => 
            <Menu.Item key={i}>
              <div onClick={() => this.menuChange(i)}>{i}</div>
            </Menu.Item>
          )}
        </Menu>
    );
    return (
      <div className={styles.banner_item}>
        {banner.picUrl && <img src={banner.picUrl} alt=""/>}
        <div className={styles.url_info}>
          <h4>{banner.newActionUrl.typeName}</h4>
          {banner.newActionUrl.msgList.map((item, i) => 
            <div className={styles.text} key={i}>{item}</div>
          )}
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
            <a>
                banner 排序 (当前序号) {index}
                {' '}
                <Icon type="caret-down" style={{ fontSize: 12 }}/>
            </a>
        </Dropdown>
        <LinkGener 
          value={banner.actionUrl} 
          click={() => this.props.click(index)} 
          setValue={({ value }) => this.props.setValue({ index, value })}
        />
        <EditorTool width={750} height={380} onChange={this.props.handlerEditor}/>
      </div>
    );
  }
}