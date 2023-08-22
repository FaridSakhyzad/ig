import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentScreen } from './redux/ui/actions';
import Playground from './components/Playground';
import { Map } from './maps/maps';
import { readMaps, writeMaps } from './api/api';

import { BASE_VIEWPORT_WIDTH, SCREEN_MODES } from './config/config';

import './App.scss';
import './mapList.css';

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

  const [ maps, setMaps ] = useState(readMaps() || []);

  const setScreenSizeCssProperty = () => {
    const { width = 1 } = document.getElementById('screen')?.getBoundingClientRect() || {};

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

  const createNewLevel = () => {
    const savedMaps = readMaps() || [];

    const newMap = new Map({ name: `New Map #${savedMaps.length + 1}` });

    savedMaps.push(newMap);

    writeMaps(savedMaps);
    setMaps(savedMaps);
  }

  const handleDeleteMap = (mapIndex) => {
    deleteMap(mapIndex);
  }

  const handleEditMap = (mapIndex) => {
    console.log(maps[mapIndex]);
  }

  const deleteMap = (mapIndex) => {
    const savedMaps = readMaps() || [];

    savedMaps.splice(mapIndex, 1);

    writeMaps(savedMaps);
    setMaps(savedMaps);
  }

  return (
    <div className="app">
      {currentScreen === SCREEN_MODES.levelsList && (
        <div className="screen" id="screen">
          <div className="mapList">
            {maps.map((mapItem, idx) => (
              <div
                key={mapItem.id}
                className="mapList-item"
              >
                <div className="mapList-itemName">{mapItem.name || mapItem.id}</div>
                <div className="mapList-itemControls">
                  <button
                    className="button"
                    onClick={() => handleDeleteMap(idx)}
                  >Delete</button>
                  <button
                    className="button"
                    onClick={() => handleEditMap(idx)}
                  >Edit</button>
                </div>
              </div>
            ))}
          </div>
          <button className="button" onClick={createNewLevel}>New Level</button>
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
          <button onClick={handleStartClick} className="button">Start</button>
          <button onClick={handleSettingsClick} className="button">Settings</button>
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
