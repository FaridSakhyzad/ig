import React, { useEffect, useState } from 'react';

import './App.scss';
import Playground from './components/Playground';

import { BASE_VIEWPORT_WIDTH } from './config/config';

function App() {
  const [ currentScreen, setCurrentScreen ] = useState('playground');

  const handleStartClick = () => {
    setCurrentScreen('playground');
  }

  const handleSettingsClick = () => {
    setCurrentScreen('settings');
  }

  const setScreenSizeCssProperty = () => {
    const { width } = document.getElementById('screen').getBoundingClientRect();
    document.documentElement.style.setProperty('--screen-width', `${width}`);
    document.documentElement.style.setProperty('--base-width-unit', `${1 / BASE_VIEWPORT_WIDTH * width}`);
  }

  useEffect(() => {
    setScreenSizeCssProperty();

    window.addEventListener('resize', setScreenSizeCssProperty)

    return () => {
      window.removeEventListener('resize', setScreenSizeCssProperty);
    }
  });

  return (
    <div className="app">
      {currentScreen === 'playground' && (
        <div className="screen" id="screen">
          <Playground />
        </div>
      )}
      {currentScreen === 'menu' && (
        <div className="screen" id="screen">
          <h2>Menu</h2>
          <button onClick={handleStartClick}>Start</button>
          <button onClick={handleSettingsClick}>Settings</button>
        </div>
      )}
      {currentScreen === 'settings' && (
        <div className="screen" id="screen">
          <h2>Settings</h2>
        </div>
      )}
    </div>
  );
}

export default App;
