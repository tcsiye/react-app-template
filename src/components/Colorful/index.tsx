import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import styles from './index.less';
import { connect } from 'dva';
import BaseModel from 'src/declare/baseModel';
import { join } from 'path';
import { Input, Button, Popover } from 'antd';
import _ from 'lodash';
export interface ColorfulProps {
  style?: React.CSSProperties;
  onChange?: any;
  size?: number;
  value?: string;
  title?: string;
  isShowInp?: boolean;
}

@connect()
class Colorful extends Component<ColorfulProps> {
  state = {
    isOpen: false,
    colorHex: { r: '255', g: '255', b: '255', a: '1' },
    colorStr: '255,255,255,1',
    isError: false
  };
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  handleClose = () => {
    this.setState({ isOpen: false });
  }

  hexToStr = hex => {
    const { r, g, b, a } = hex;
    const colorStr = `${r},${g},${b},${a}`;
    const colorArr = [];
    // tslint:disable-next-line:forin
    for (const key in hex) {
      colorArr.push(hex[key]);
    }
    return colorArr.join(',');
  }

  strToHex(hex: string) {
    // tslint:disable-next-line:prefer-array-literal
    let hexArr = new Array(4);
    if (hex) {
      hexArr = hex.split(',');
    }

    if (hexArr.length < 4) {
      hexArr.fill('0');
    }
    const colorHex = { r: '0', g: '0', b: '0', a: '0' };

    hexArr.forEach((item, index) => {
      const value = item.trim();
      switch (index) {
        case 0:
          return (colorHex.r = value);
        case 1:
          return (colorHex.g = value);
        case 2:
          return (colorHex.b = value);
        case 3:
          return (colorHex.a = value);
        default:
          return;
      }
    });
    return colorHex;
  }

  handleChange = color => {
    const hexStr = this.hexToStr(color.rgb);
    this.props.onChange(hexStr);
  }

  // tslint:disable-next-line:member-ordering
  changeInput = _.debounce((value) => {
    const hex = this.strToHex(value);
    // tslint:disable-next-line:no-console
    const hexArr = value.split(',');
    if (hexArr.length !== 4) {
      this.state.isError = true;
    } else {
      this.state.isError = false;
    }

    this.props.onChange(value);

  }, 100);

  render() {
    const { style, isShowInp, title, value } = this.props;
    const { isOpen, isError } = this.state;
    // tslint:disable-next-line:no-console
    console.log(value);

    const colorHex = this.strToHex(value);
    const { r, g, b, a } = colorHex;
    return (
      <div className={styles.colorBox}>
      <div style={{ display: 'inline-block', verticalAlign: 'bottom' }}>
        {title ? <label className={styles.title}>{title}</label> : null}
        {!isShowInp ? (
          <Popover
               placement="top"
               content={<span className={styles.warnText}>请输入数字且用逗号分隔，格式如：“255,255,255,1”(red,green,blue,alpha)</span>}
               visible={isError}
          >
          <Input
            value={value}
            style={{
              width: '128px',
              display: 'inline-block',
              marginRight: '10px',
              verticalAlign: 'bottom'
            }}
            onChange={e => {this.changeInput(e.target.value); }}
          />
          </Popover>
        ) : (
          ''
        )}
          <div className={styles.color}>
            <Button
              className={styles.swatch}
              onClick={this.handleClick}
              style={{ ...style, background: `rgba(${r}, ${g},${b}, ${a})` }}
            />

            {isOpen ? (
              <div className={styles.popover}>
                <div className={styles.cover} onClick={this.handleClose} />
                <SketchPicker
                  style={{ transition: 'all .3s' }}
                  color={this.state.colorHex}
                  onChange={this.handleChange}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Colorful;
