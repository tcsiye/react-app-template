import React from 'react';
import BaseProps from 'src/declare/baseProps';

export abstract class DvaComponent<T = BaseProps > extends React.Component<T & BaseProps> {
  abstract modelName: string;
  handleAfterClose = () => {
    this.props.form.resetFields();
  }
  async setDvaState(state) {
    await this.props.dispatch({
      type: `${this.modelName}/updateState`,
      payload: state
    });
  }
}
