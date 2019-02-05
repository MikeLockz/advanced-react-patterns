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

  internalSetState(changes, callback) {
    this.setState(state => {
      const changesObject =
        typeof changes === 'function' ? changes(state) : changes;
      const reducedChanges = this.props.stateReducer(state, changesObject);

      return reducedChanges;
    }, callback);
  }

  toggle = () => {
    this.internalSetState(
      ({ on }) => ({ on: !on }),
      () => {
        this.props.onToggle(this.state.on);
      }
    );
  };

  reset = () => {
    this.internalSetState(this.initialState, () =>
      this.props.onReset(this.state.on)
    );
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

class Usage extends React.Component {
  initialState = { timesClicked: 0 };
  state = this.initialState;

  handleToggle = (...args) => {
    this.setState(({ timesClicked }) => ({
      timesClicked: timesClicked + 1,
    }));
  };

  handleReset = (...args) => {
    this.setState(this.initialState);
  };

  toggleStateReducer = (state, changes) => {
    if (this.state.timesClicked >= 4) {
      return { ...changes, on: false };
    }
    return changes;
  };

  render() {
    const { timesClicked } = this.state;

    return (
      <Toggle
        stateReducer={this.toggleStateReducer}
        onToggle={this.handleToggle}
        onReset={this.handleReset}
      >
        {({ getTogglerProps, reset, toggle, on }) => (
          <div>
            <Switch {...getTogglerProps({ on })} />
            {timesClicked > 4 ? (
              <div>Whoa, you clicked too much!</div>
            ) : timesClicked > 0 ? (
              <div> click count: {timesClicked}</div>
            ) : null}
            <button onClick={reset}>Reset</button>
          </div>
        )}
      </Toggle>
    );
  }
}

export default Usage;
