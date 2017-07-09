export class Action {
  static Setup = 'APP:SETUP';
  static Done = 'APP:DONE';
}

export const setup = action$ =>
  action$.ofType(Action.Setup).delay(1000).mapTo({ type: Action.Done });
