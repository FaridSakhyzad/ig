import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentScreen } from './redux/ui/actions';
import Playground from './components/Playground';
import MapEdit from './components/MapEdit';
import { BASE_VIEWPORT_WIDTH } from './config/config';
import { SCREEN_MODES } from './constants/constants';
import './App.scss';

function App() {
  const dispatch = useDispatch();

  const { currentScreen } = useSelector((state) => state.ui);

  const handleStartClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.playground));
  };

  const handleLevelsClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.levelsList));
  };

  const handleSettingsClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.settings));
  };

  const [projectileMoveStep, setProjectileMoveStep] = useState(1);

  const setScreenSizeCssProperty = () => {
    const { width = 1 } = document.getElementById('screen')?.getBoundingClientRect() || {};

    const baseWidthUnit = (1 / BASE_VIEWPORT_WIDTH) * width;
    document.documentElement.style.setProperty('--base-width-unit', `${baseWidthUnit}`);

    setProjectileMoveStep(baseWidthUnit);
  };

  useEffect(() => {
    setScreenSizeCssProperty();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setScreenSizeCssProperty);

    return () => {
      window.removeEventListener('resize', setScreenSizeCssProperty);
    };
  });

  const [projectileExplosionDuration, setProjectileExplosionDuration] = useState();

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);

    setProjectileExplosionDuration(parseFloat(computedStyle.getPropertyValue('--projectile-explosion--duration')) * 1000);
  }, []);

  return (
    <div className="app">
      {currentScreen === SCREEN_MODES.levelsList && (
        <div className="serviceScreen" id="screen">
          <MapEdit />
        </div>
      )}
      {currentScreen === SCREEN_MODES.playground && (
        <div className="screen" id="screen">
          <Playground
            projectileExplosionDuration={projectileExplosionDuration}
            projectileMoveStep={projectileMoveStep}
          />
        </div>
      )}
      {currentScreen === SCREEN_MODES.menu && (
        <div className="screen" id="screen">
          <h2>Menu</h2>
          <button type="button" onClick={handleStartClick} className="button">Start</button>
          <button type="button" onClick={handleLevelsClick} className="button">Levels</button>
          <button type="button" onClick={handleSettingsClick} className="button">Settings</button>
        </div>
      )}
      {currentScreen === SCREEN_MODES.settings && (
        <div className="screen" id="screen">
          <h2>Settings</h2>
        </div>
      )}
    </div>
  );
}

export default App;
