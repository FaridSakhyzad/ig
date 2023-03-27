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

  const [ projectileMoveStep, setProjectileMoveStep ] = useState(1);

  const setScreenSizeCssProperty = () => {
    const { width } = document.getElementById('screen').getBoundingClientRect();

    const baseWidthUnit = 1 / BASE_VIEWPORT_WIDTH * width;
    document.documentElement.style.setProperty('--base-width-unit', `${baseWidthUnit}`);

    setProjectileMoveStep(baseWidthUnit);
  }

  useEffect(() => {
    setScreenSizeCssProperty();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setScreenSizeCssProperty)

    return () => {
      window.removeEventListener('resize', setScreenSizeCssProperty);
    }
  });

  const [ projectileExplosionDuration, setProjectileExplosionDuration ] = useState();

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);

    setProjectileExplosionDuration(parseFloat(computedStyle.getPropertyValue('--projectile-explosion--duration')) * 1000);
  }, []);

  return (
    <div className="app">
      {currentScreen === 'playground' && (
        <div className="screen" id="screen">
          <Playground
            projectileExplosionDuration={projectileExplosionDuration}
            projectileMoveStep={projectileMoveStep}
          />
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
