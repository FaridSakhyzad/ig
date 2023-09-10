import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setEditorMode } from './redux/user/actions';
import { setCurrentScreen } from './redux/ui/actions';
import Playground from './components/Playground';
import LevelEdit from './components/LevelEdit';
import { BASE_VIEWPORT_WIDTH } from './config/config';
import { SCREEN_MODES } from './constants/constants';
import { LevelMap } from './maps/maps';
import { readLevels, updateLevel } from './api/api';
import LevelEditComponent from './components/LevelEdit/LevelEditComponent';

import './App.scss';
import './mainMenu.scss';
import UnitEdit from './components/LevelEdit/UnitEdit';
import CellEdit from './components/LevelEdit/CellEdit';

function App() {
  const dispatch = useDispatch();

  const { currentScreen } = useSelector((state) => state.ui);
  const { editorMode } = useSelector((state) => state.user);

  const levels = readLevels() || [];

  const [currentLevel, setCurrentLevel] = useState(new LevelMap(levels[0]));
  const [levelEditMode, setLevelEditMode] = useState(false);

  const handleAdminModeChange = ({ target: { checked } }) => {
    dispatch(setEditorMode(checked));
  };

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

  const handleMenuClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  };

  const [projectileMoveStep, setProjectileMoveStep] = useState(1);

  const setScreenSizeCssProperty = () => {
    const { width = 1 } = document.getElementById('screen')?.getBoundingClientRect() || {};

    const baseWidthUnit = (1 / BASE_VIEWPORT_WIDTH) * width;
    document.documentElement.style.setProperty('--base-width-unit', `${baseWidthUnit}`);

    setProjectileMoveStep(baseWidthUnit);
  };

  const saveEditedUnits = (level, units) => {
    updateLevel({ ...currentLevel, units: [...units] });
  };

  const saveLevelParams = (levelParams) => {
    const newLevel = new LevelMap({
      ...currentLevel,
      ...levelParams,
    });

    newLevel.rescaleGrid();

    updateLevel(newLevel);

    setCurrentLevel(newLevel);
  };

  const onLevelParamsEditStart = () => {
    setLevelEditMode(true);
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

  const changeCurrentLevel = (newLevelId) => {
    const storedLevels = readLevels();

    const newLevelIndex = storedLevels.findIndex((item) => item.id === newLevelId);

    const newLevel = new LevelMap(storedLevels[newLevelIndex]);
    setCurrentLevel(newLevel);
  };

  useEffect(() => {
    const computedStyle = getComputedStyle(document.documentElement);

    setProjectileExplosionDuration(parseFloat(computedStyle.getPropertyValue('--projectile-explosion--duration')) * 1000);
  }, []);

  const {
    units,
    grid,
    ...levelParams
  } = currentLevel;

  const [editedUnitIndex, setEditedUnitIndex] = useState(null);
  const [editedCellCoords, setEditedCellCoords] = useState(null);

  const onLevelUnitEdit = (index) => {
    setEditedUnitIndex(index);
  };

  const onLevelCellEdit = (row, col) => {
    setEditedCellCoords([row, col]);
  };

  const editedUnit = editedUnitIndex !== null ? currentLevel.units[editedUnitIndex] : null;

  const editedCell = editedCellCoords !== null
    ? currentLevel.grid[editedCellCoords[0]][editedCellCoords[1]] : null;

  return (
    <div className="app">
      {currentScreen === SCREEN_MODES.levelsList && (
        <div className="serviceScreen" id="screen">
          <LevelEdit />
        </div>
      )}
      {currentScreen === SCREEN_MODES.playground && (
        <>
          {levelEditMode && (
            <div className="serviceScreen">
              <LevelEditComponent
                levelParams={levelParams}
                onSave={saveLevelParams}
                onClose={() => { setLevelEditMode(false); }}
              />
            </div>
          )}
          {editedUnit !== null && (
            <div className="serviceScreen">
              <UnitEdit
                unit={editedUnit}
                onApply={() => {}}
                onClose={() => { setEditedUnitIndex(null); }}
              />
            </div>
          )}
          {editedCell !== null && (
            <div className="serviceScreen">
              <CellEdit
                cell={editedCell}
                onApply={() => {}}
                onClose={() => { setEditedCellCoords(null); }}
              />
            </div>
          )}
          <div className="screen" id="screen">
            <Playground
              projectileExplosionDuration={projectileExplosionDuration}
              projectileMoveStep={projectileMoveStep}
              level={currentLevel}
              levels={levels}
              onChangeLevel={changeCurrentLevel}
              onPlayNextLevel={setNextLevel}
              onLevelParamsEditStart={onLevelParamsEditStart}
              onLevelUnitEdit={onLevelUnitEdit}
              onLevelCellEdit={onLevelCellEdit}
              onSaveUnits={saveEditedUnits}
            />
          </div>
        </>
      )}
      {currentScreen === SCREEN_MODES.menu && (
        <div className="screen" id="screen">
          <h2>Menu</h2>
          <ul className="mainMenu">
            <li className="mainMenu-item">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="mainMenu-editorModeSwitcher">
                Editor Mode
                <input
                  type="checkbox"
                  className="checkbox mainMenu-editorModeSwitcherInput"
                  checked={editorMode}
                  onChange={handleAdminModeChange}
                />
              </label>
            </li>
            <li className="mainMenu-item">
              <button type="button" onClick={handlePlayClick} className="button">Play</button>
            </li>
            {editorMode && (
              <li className="mainMenu-item">
                <button type="button" onClick={handleLevelsClick} className="button">Levels</button>
              </li>
            )}
            <li className="mainMenu-item">
              <button type="button" onClick={handleSettingsClick} className="button">Settings</button>
            </li>
          </ul>
        </div>
      )}
      {currentScreen === SCREEN_MODES.settings && (
        <div className="screen" id="screen">
          <h2>Settings</h2>
          <button type="button" onClick={handleMenuClick} className="button">Back to Menu</button>
        </div>
      )}
    </div>
  );
}

export default App;
