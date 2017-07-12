import { Action as App } from './epics';
import { combineEpics } from 'redux-observable';
import { setup } from './epics/app';

export const Action = {
  App
};

export default combineEpics(setup);
