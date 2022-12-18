import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

import './App.scss';
import './Playground/Playground.scss';
import './components/Unit/Unit.scss';
import './components/Projectile/Projectile.scss';

import Playground from './Playground/Playground';

function App() {
  const [ currentScreen, setCurrentScreen ] = useState('menu');

  const handleStartClick = () => {
    setCurrentScreen('playground');
  }

  const handleSettingsClick = () => {
    setCurrentScreen('settings');
  }

  return (
    <Provider store={store}>
      <div className="app">
        {currentScreen === 'playground' && (
          <div className="screen">
            <Playground />
          </div>
        )}
        {currentScreen === 'menu' && (
          <div className="screen">
            <h2>Menu</h2>
            <button onClick={handleStartClick}>Start</button>
            <button onClick={handleSettingsClick}>Settings</button>
          </div>
        )}
        {currentScreen === 'settings' && (
          <div className="screen">
            <h2>Settings</h2>
          </div>
        )}
      </div>
    </Provider>
  );
}

export default App;
