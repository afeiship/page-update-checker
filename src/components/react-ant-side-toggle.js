import React,{PureComponent} from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'noop';
import objectAssign from 'object-assign';
import { Icon } from 'antd';
export default class extends PureComponent{
  /*===properties start===*/
  static propTypes = {
    className: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func,
    template: PropTypes.func,
  };

  static defaultProps = {
    value: false,
    onChange: noop,
    template: noop
  };
  /*===properties end===*/

  constructor(inProps){
    super(inProps);
    this.state = {
      value: inProps.value
    };
  }

  componentWillReceiveProps(inProps){
    const { value } = inProps;
    if( value !== this.state.value ){
      this.setState({ value });
    }
  }


  _onClick = e =>{
    const { value } = this.state;
    const { onChange } = this.props;
    const target = { value: !value };
    this.setState(target,()=>{
      onChange({ target });
    });
  };

  render(){
    const {className, children, ...props} = this.props;
    const { value } = this.state;

    return (
      <button {...props} onClick={this._onClick} className={ classNames("react-ant-side-toggle", className) }>
        { template(value) || <Icon type={value ? 'menu-unfold' : 'menu-fold'}/>}
      </button>
    )
  }
}
