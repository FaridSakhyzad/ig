import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

import './App.scss';
import './Playground/Playground.scss';
import './Components/Unit/Unit.scss';
import './Components/Projectile/Projectile.scss';

import Playground from './Playground/Playground';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Playground />
      </div>
    </Provider>
  );
}

export default App;
