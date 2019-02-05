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
  state = {
    on: false,
  };

  toggle = () => {
    this.setState(
      ({ on }) => ({ on: !on }),
      () => {
        this.props.onToggle(this.state.on);
      }
    );
  };

  getStateAndHelpers() {
    return {
      on: this.state.on,
      toggle: this.toggle,
      togglerProps: {
        onClick: this.toggle,
        'aria-pressed': this.state.on,
      },
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

function Usage({ onToggle = (...args) => console.log('onToggle', ...args) }) {
  return (
    <Toggle onToggle={onToggle}>
      {({ on, togglerProps }) => (
        <div>
          {on ? 'The b utton is on' : 'The button is off'}
          <Switch on={on} {...togglerProps} />
          <hr />
          <button area-label="custom-button" {...togglerProps}>
            {on ? 'on' : 'off'}
          </button>
        </div>
      )}
    </Toggle>
  );
}

export default Usage;
