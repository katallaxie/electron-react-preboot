import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import history from './history';
import setupStore from './store';
import App from './app';

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isHydrating: true,
      store: setupStore(() => this.setState({ isHydrating: false }))
    };
  }

  render() {
    const { isHydrating, store } = this.state;

    if (isHydrating) {
      return null;
    }

    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );
  }
}
