import React from 'react';
import { Switch } from './Switch';

const ToggleContext = React.createContext();

function ToggleConsumer(props) {
  return (
    <ToggleContext.Consumer>
      {context => {
        if (!context) {
          throw new Error(
            'Toggle compond components must be rendered within a Provider component.'
          );
        }
        return props.children(context);
      }}
    </ToggleContext.Consumer>
  );
}

class Toggle extends React.Component {
  static On = ({ children }) => (
    <ToggleConsumer>
      {contextValue => (contextValue.on ? children : null)}
    </ToggleConsumer>
  );
  static Off = ({ children }) => (
    <ToggleConsumer>
      {contextValue => (contextValue.on ? null : children)}
    </ToggleConsumer>
  );
  static Button = ({ ...props }) => (
    <ToggleConsumer>
      {contextValue => (
        <Switch on={contextValue.on} onClick={contextValue.toggle} {...props} />
      )}
    </ToggleConsumer>
  );

  toggle = () => {
    this.setState(
      ({ on }) => ({ on: !on }),
      () => {
        this.props.onToggle(this.state.on);
      }
    );
  };

  state = {
    on: false,
    toggle: this.toggle,
  };

  render() {
    return this.props.children({
      on: this.state.on,
      toggle: this.toggle,
    });
  }
}

function CommonToggle(props) {
  return (
    <Toggle {...props}>
      {({ on, toggle }) => <Switch on={on} onClick={toggle} />}
    </Toggle>
  );
}

function Usage({ onToggle = (...args) => console.log('onToggle', ...args) }) {
  return (
    <Toggle onToggle={onToggle}>
      {({ on, toggle }) => (
        <div>
          {on ? 'The b utton is on' : 'The button is off'}
          <Switch on={on} onClick={toggle} />
          <hr />
          <button area-label="custom-button" onClick={toggle}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
