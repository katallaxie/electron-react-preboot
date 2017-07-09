import { fromJS } from 'immutable';

const init = fromJS({
  isSetup: false
});

export default (state = init, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
