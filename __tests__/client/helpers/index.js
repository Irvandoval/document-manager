import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

const middleware = [];

/**
 * @param { object } Component React component
 * @param { object } initialState Component store initial state
 * @returns { object } props and component
 */
function setup(Component, initialState = {}) {
  const mockStore = configureStore(middleware);
  const store = mockStore(initialState);

  const component = mount((
    <BrowserRouter>
      <Component store={store} />
    </BrowserRouter>
  ));

  return {
    component
  };
}

export default {
  setup
};
