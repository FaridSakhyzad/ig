import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentScreen } from './redux/ui/actions';
import Playground from './components/Playground';
import LevelList from './components/LevelList';
import { BASE_VIEWPORT_WIDTH } from './config/config';
import { SCREEN_MODES } from './constants/constants';
import './App.scss';
import { LevelMap } from './maps/maps';
import { readMaps, writeMaps } from './api/api';
import LevelEditComponent from './components/LevelList/LevelEditComponent';

function App() {
  const dispatch = useDispatch();

  const { currentScreen } = useSelector((state) => state.ui);

  const levels = readMaps() || [];

  const [currentLevel, setCurrentLevel] = useState(new LevelMap(levels[0]));

  const handlePlayClick = () => {
    setCurrentLevel(new LevelMap(levels[0]));
    dispatch(setCurrentScreen(SCREEN_MODES.playground));
  };

  const getNextLevel = () => {
    const currentLevelIndex = levels.findIndex((item) => item.id === currentLevel.id);

    const nextLevelIndex = currentLevelIndex === levels.length - 1 ? 0 : currentLevelIndex + 1;

    return new LevelMap(levels[nextLevelIndex]);
  };

  const setNextLevel = () => {
    setCurrentLevel(getNextLevel());
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

  const saveEditedLevel = (level, units) => {
    const maps = readMaps();

    const currentMapIndex = maps.findIndex((item) => item.id === level.id);

    maps[currentMapIndex] = {
      ...level,
      units: [...units],
    };

    writeMaps(maps);
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
          <LevelList />
        </div>
      )}
      {currentScreen === SCREEN_MODES.playground && (
        <>
          {false && (
            <div className="serviceScreen">
              <div className="container">
                <LevelEditComponent level={currentLevel} />
              </div>
            </div>
          )}
          <div className="screen" id="screen">
            <Playground
              projectileExplosionDuration={projectileExplosionDuration}
              projectileMoveStep={projectileMoveStep}
              level={currentLevel}
              onPlayNextLevel={setNextLevel}
              onEditStart={() => {}}
              onSave={saveEditedLevel}
            />
          </div>
        </>
      )}
      {currentScreen === SCREEN_MODES.menu && (
        <div className="screen" id="screen">
          <h2>Menu</h2>
          <button type="button" onClick={handlePlayClick} className="button">Play</button>
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
