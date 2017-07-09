import 'rxjs';
import { createEpicMiddleware } from 'redux-observable';
import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { offline } from 'redux-offline';
import history from './history';
import defaultConfig from 'redux-offline/lib/defaults';
import reducers from './reducers';
import epics from './epics';

const middlewares = [routerMiddleware(history), createEpicMiddleware(epics)];

if (process.env.NODE_ENV === 'development') {
  middlewares.unshift(createLogger());
}

export default onComplete => {
  const customConfig = {
    ...defaultConfig,
    persistCallback: onComplete
  };

  const offlineMiddleware = compose(
    applyMiddleware(...middlewares),
    offline(customConfig)
  );

  return createStore(reducers, compose(offlineMiddleware));
};
