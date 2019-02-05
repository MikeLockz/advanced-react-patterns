import React from 'react';
import { Switch } from './Switch';

const callAll = (...fns) => (...args) => fns.forEach(fn => fn && fn(...args));

class Toggle extends React.Component {
  static defaultProps = {
    initialOn: false,
    onReset: () => {},
  };
  initialState = { on: this.props.initialOn };
  state = this.initialState;

  toggle = () => {
    this.setState(
      ({ on }) => ({ on: !on }),
      () => {
        this.props.onToggle(this.state.on);
      }
    );
  };

  reset = () => {
    this.setState(this.initialState, () => this.props.onReset(this.state.on));
  };

  getTogglerProps = ({ onClick, ...props }) => {
    return {
      onClick: callAll(onClick, this.toggle),
      'aria-pressed': this.state.on,
      ...props,
    };
  };

  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      getTogglerProps: this.getTogglerProps,
      reset: this.reset,
    };
  }

  render() {
    return this.props.children(
      this.getStateAndHelpers({
        on: this.state.on,
        toggle: this.toggle,
      })
    );
  }
}

function Usage({
  initialOn = true,
  onToggle = (...args) => console.log('onToggle', ...args),
  onReset = (...args) => console.log('onReset', ...args),
}) {
  return (
    <Toggle onToggle={onToggle} initialOn={initialOn} onReset={onReset}>
      {({ getTogglerProps, on, reset }) => (
        <div>
          <Switch {...getTogglerProps({ on })} />
          <hr />
          <button onClick={reset}>Reset</button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
