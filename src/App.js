import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentScreen } from './redux/ui/actions';
import Playground from './components/Playground';
import './App.scss';

import { BASE_VIEWPORT_WIDTH, SCREEN_MODES } from './config/config';

function App() {
  const dispatch = useDispatch();

  const { currentScreen } = useSelector(state => state.ui);

  const handleStartClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.playground));
  }

  const handleSettingsClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.settings));
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
          <button onClick={handleStartClick} className="button">Start</button>
          <button onClick={handleSettingsClick} className="button">Settings</button>
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
