import React from 'react';
import BaseProps from 'src/declare/baseProps';
class BaseComponent<P extends BaseProps = BaseProps, S = any> extends React.Component<P, S> {

}
export default BaseComponent;
