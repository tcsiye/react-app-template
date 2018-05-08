import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Select, Button, Icon, Spin } from 'antd';
import service from '../service';
import { FormCreateOption } from 'antd/lib/form';
import { debounce } from 'lodash';

const FormItem = Form.Item;

export default class IconBox extends PureComponent <any, any> {
  constructor(props) {
    super(props);
  }
}
