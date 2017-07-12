import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import App from './app';
import history from './history';
import setupStore from './store';

interface Props {}

interface State {
  isHydrating: boolean;
  store: any;
}

export default class Setup extends React.Component<Props, State> {
  public state: State = {
    isHydrating: true,
    store: setupStore(() => this.setState({ isHydrating: false }))
  };

  constructor() {
    super();
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
