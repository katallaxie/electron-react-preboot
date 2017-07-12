import { routerMiddleware } from "react-router-redux";
import { applyMiddleware, compose, createStore } from "redux";
import { createLogger } from "redux-logger";
import { createEpicMiddleware } from "redux-observable";
import { offline } from "redux-offline";
import defaultConfig from 'redux-offline/lib/defaults';
import 'rxjs';
import epics from './epics';
import history from './history';
import reducers from './reducers';

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
