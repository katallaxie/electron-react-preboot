import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import App from './app';

configure({ adapter: new Adapter() });

test('App renders the welcome test inside', () => {
  const wrapper = mount(<App />);
  const div = wrapper.find('div');
  expect(div.text()).toBe('Welcome Electron + React Adventurer');
});
