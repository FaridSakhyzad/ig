import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';

import { setEditorMode } from './redux/user/actions';
import { setCurrentScreen } from './redux/ui/actions';
import Playground from './components/Playground';
import LevelEdit from './components/LevelEdit';
import { BASE_VIEWPORT_WIDTH } from './config/config';
import {
  CELL_EDIT_MODE,
  CELL_MULTISELECT_MODE,
  GAMEPLAY_MODE,
  PERSISTENT_DELETE_MODE,
  PERSISTENT_PLACING_MODE,
  PERSISTENT_ROTATE_MODE,
  SCREEN_MODES, SELECT_MODE,
  UNIT_EDIT_MODE,
} from './constants/constants';
import { LevelMap } from './maps/maps';
import { readLevels, updateLevel } from './api/api';
import LevelEditComponent from './components/LevelEdit/LevelEditComponent';

import './App.scss';
import './mainMenu.scss';
import UnitEdit from './components/LevelEdit/UnitEdit';
import CellEdit from './components/LevelEdit/CellEdit';
import PlaygroundEdit from './components/LevelEdit/PlaygroundEdit';
import {
  BASE_UNIT,
  BOBOMB,
  DEFLECTOR,
  HIDDEN,
  LASER,
  NPC, PORTAL, TELEPORT,
  WALL,
} from './constants/units';
import BaseUnit from './units/BaseUnit';
import Bobomb from './units/Bobomb';
import Laser from './units/Laser';
import Deflector from './units/Deflector';
import Wall from './units/Wall';
import Npc from './units/Npc';
import Hidden from './units/Hidden';
import { generatePortals, generateTeleports } from './units/unitFactory';

function App() {
  const dispatch = useDispatch();

  const { currentScreen } = useSelector((state) => state.ui);
  const { editorMode } = useSelector((state) => state.user);

  const levels = readLevels() || [];

  const [currentLevel, setCurrentLevel] = useState(new LevelMap(levels[0]));
  const [levelEditMode, setLevelEditMode] = useState(false);

  const handleAdminModeChange = ({ target: { checked } }) => {
    localStorage.setItem('editorMode', checked);
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

  const saveEditedUnits = () => {
    updateLevel(currentLevel);
  };

  const saveLevelParams = (levelParams = {}) => {
    const newLevel = new LevelMap({
      ...currentLevel,
      ...levelParams,
    });

    newLevel.rescaleGrid();

    updateLevel(newLevel);

    setCurrentLevel(newLevel);
  };

  const onLevelParamsEdit = () => {
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

  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);

  const onLevelUnitEdit = (index) => {
    setEditedUnitIndex(index);
  };

  const onLevelCellEdit = (row, col) => {
    setEditedCellCoords([row, col]);
  };

  const editedUnit = editedUnitIndex !== null ? currentLevel.units[editedUnitIndex] : null;

  const editedCell = editedCellCoords !== null
    ? currentLevel.grid[editedCellCoords[0]][editedCellCoords[1]] : null;

  const [userInputMode, setUserInputMode] = useState(GAMEPLAY_MODE);
  const [afterInputData, setAfterInputData] = useState(null);

  const onUnitEditClose = () => {
    setEditedUnitIndex(null);
    setUserInputMode(GAMEPLAY_MODE);
  };

  const onUnitEditApply = (params, turrets) => {
    currentLevel.units[editedUnitIndex] = {
      ...currentLevel.units[editedUnitIndex],
      ...params,
      turrets,
    };

    setCurrentLevel(currentLevel);
    saveLevelParams();
    setEditedUnitIndex(null);
  };

  const getUnitParamsForEdit = () => {
    const {
      id,
      angle,
      maxValue,
      minValue,
      selectable,
      type,
      value,
      valueCountable,
      kind,
      meta,
    } = editedUnit;

    return {
      id,
      angle,
      maxValue,
      minValue,
      selectable,
      type,
      value,
      valueCountable,
      kind,
      meta,
    };
  };

  const getUnitTurretsForEdit = () => structuredClone(editedUnit.turrets);

  const onPlaygroundEdit = (mode, data = {}) => {
    setAfterInputData(data);
    setUserInputMode(mode);
  };

  const placeUnit = (newUnitTop, newUnitLeft) => {
    const generators = {
      [BASE_UNIT.id]: (unitTop, unitLeft, params) => new BaseUnit(unitTop, unitLeft, params),
      [BOBOMB.id]: (unitTop, unitLeft, params) => new Bobomb(unitTop, unitLeft, params),
      [LASER.id]: (unitTop, unitLeft, params) => new Laser(unitTop, unitLeft, params),
      [DEFLECTOR.id]: (unitTop, unitLeft, params) => new Deflector(unitTop, unitLeft, params),
      [WALL.id]: (unitTop, unitLeft, params) => new Wall(unitTop, unitLeft, params),
      [NPC.id]: (unitTop, unitLeft, params) => new Npc(unitTop, unitLeft, params),
      [HIDDEN.id]: (unitTop, unitLeft, params) => new Hidden(unitTop, unitLeft, params),
    };

    const newUnit = generators[afterInputData.callback](newUnitTop, newUnitLeft, { value: 4 });

    currentLevel.units.push(newUnit);

    setCurrentLevel({ ...currentLevel });
  };

  const removeUnit = (index) => {
    currentLevel.units.splice(parseInt(index, 10), 1);

    setCurrentLevel({ ...currentLevel });
  };

  const moveUnit = (unitIndex, top, left) => {
    const newUnits = [...units];

    newUnits[unitIndex].top = top;
    newUnits[unitIndex].left = left;

    currentLevel.units = newUnits;

    setCurrentLevel({ ...currentLevel });
  };

  const rotateUnit = (unitIndex, angle = 45) => {
    const newUnits = [...units];

    const directionMultiplier = afterInputData.direction === 'ccv' ? -1 : 1;

    newUnits[unitIndex].angle += (angle * directionMultiplier);

    currentLevel.units = newUnits;

    setCurrentLevel({ ...currentLevel });
  };

  const onUnitClick = (unitId, unitIndex) => {
    if (userInputMode === UNIT_EDIT_MODE) {
      onLevelUnitEdit(unitIndex, units[unitIndex]);
    }

    if (userInputMode === PERSISTENT_DELETE_MODE) {
      removeUnit(unitIndex);
    }

    if (userInputMode === PERSISTENT_ROTATE_MODE) {
      rotateUnit(unitIndex);
    }

    if (userInputMode === SELECT_MODE) {
      if (selectedUnits[0] && selectedUnits[0].unitIndex) {
        currentLevel.units[selectedUnits[0].unitIndex].selected = false;
      }

      setSelectedUnits([{ unitId, unitIndex }]);
      currentLevel.units[unitIndex].selected = true;

      if (afterInputData.callback === 'moveUnit' && selectedCells.length > 0) {
        const { top, left } = selectedCells[0];

        moveUnit(unitIndex, top, left);

        selectedCells.forEach((cell) => {
          currentLevel.grid[cell.top][cell.left].selected = false;
        });

        currentLevel.units[unitIndex].selected = false;

        setSelectedCells([]);
        setSelectedUnits([]);
      }
    }
  };

  const placePortals = () => {
    const newUnits = [...units];

    const { top: top0, left: left0 } = selectedCells[0];
    const { top: top1, left: left1 } = selectedCells[1];

    const [portal1, portal2] = generatePortals(top0, left0, top1, left1);

    newUnits.push(portal1);
    newUnits.push(portal2);

    currentLevel.units = newUnits;

    setCurrentLevel({ ...currentLevel });
  };

  const placeTeleports = () => {
    const newUnits = [...units];

    const { top: top0, left: left0 } = selectedCells[0];
    const { top: top1, left: left1 } = selectedCells[1];

    const [teleport1, teleport2] = generateTeleports(top0, left0, top1, left1);

    newUnits.push(teleport1);
    newUnits.push(teleport2);

    currentLevel.units = newUnits;

    setCurrentLevel({ ...currentLevel });
  };

  const onCellClick = (id, top, left) => {
    if (userInputMode === SELECT_MODE) {
      selectedCells.forEach((cell) => {
        currentLevel.grid[cell.top][cell.left].selected = false;
      });

      const newSelectedCells = [{ id, top, left }];

      setSelectedCells(newSelectedCells);

      newSelectedCells.forEach((cell) => {
        currentLevel.grid[cell.top][cell.left].selected = true;
      });

      if (afterInputData.callback === 'moveUnit' && selectedUnits.length > 0) {
        moveUnit(selectedUnits[0].unitIndex, top, left);

        newSelectedCells.forEach((cell) => {
          currentLevel.grid[cell.top][cell.left].selected = false;
        });

        if (selectedUnits[0] && selectedUnits[0].unitIndex) {
          currentLevel.units[selectedUnits[0].unitIndex].selected = false;
        }

        setSelectedCells([]);
        setSelectedUnits([]);
      }
    }

    if (userInputMode === CELL_EDIT_MODE) {
      onLevelCellEdit(top, left);
    }

    if (userInputMode === PERSISTENT_PLACING_MODE) {
      placeUnit(top, left);
    }

    if (userInputMode === CELL_MULTISELECT_MODE) {
      selectedCells.push({ id, top, left });
      setSelectedCells([...selectedCells]);

      selectedCells.forEach((cell) => {
        currentLevel.grid[cell.top][cell.left].selected = true;
      });

      if (selectedCells.length >= afterInputData.maxMultiSelect) {
        if (afterInputData.callback === PORTAL.id) {
          placePortals();

          selectedCells.forEach((cell) => {
            currentLevel.grid[cell.top][cell.left].selected = false;
          });
          setSelectedCells([]);
        }

        if (afterInputData.callback === TELEPORT.id) {
          placeTeleports();

          selectedCells.forEach((cell) => {
            currentLevel.grid[cell.top][cell.left].selected = false;
          });
          setSelectedCells([]);
        }
      }
    }
  };

  const [hideUnits, setHideUnits] = useState(false);
  const [hideTurrets, setHideTurrets] = useState(true);

  const toggleUnits = () => {
    setHideUnits(!hideUnits);
  };

  const toggleTurrets = () => {
    setHideTurrets(!hideTurrets);
  };

  const renderPlayGroundEdit = () => (
    <PlaygroundEdit
      onLevelParamsEdit={onLevelParamsEdit}
      onEdit={onPlaygroundEdit}
      currentMode={userInputMode}
      afterInputData={afterInputData}
      onSave={saveEditedUnits}
      currentLevel={currentLevel}
      levels={levels}
      changeCurrentLevel={changeCurrentLevel}
      toggleUnits={toggleUnits}
      toggleTurrets={toggleTurrets}
    />
  );

  const getPortalExitPoints = () => {
    const portals = currentLevel.units.filter(({ type }) => type === PORTAL.id);

    const exitPoints = [];

    portals.forEach(({ id, top, left }) => {
      exitPoints.push({
        top,
        left,
        exitPortalId: id,
      });
    });

    return exitPoints;
  };

  const getTeleportExitPoints = () => {
    const teleports = currentLevel.units.filter(({ type }) => type === TELEPORT.id);

    const exitPoints = [];

    teleports.forEach(({ id, top, left }) => {
      exitPoints.push({
        top,
        left,
        exitTeleportId: id,
      });
    });

    return exitPoints;
  };

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
                portalExitPoints={getPortalExitPoints()}
                teleportExitPoints={getTeleportExitPoints()}
                unitParams={getUnitParamsForEdit()}
                unitTurrets={getUnitTurretsForEdit()}
                onApply={onUnitEditApply}
                onClose={onUnitEditClose}
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
          <div
            className={classnames('screen', { hideUnits, hideTurrets })}
            id="screen"
          >
            <Playground
              projectileExplosionDuration={projectileExplosionDuration}
              projectileMoveStep={projectileMoveStep}
              level={currentLevel}
              onPlayNextLevel={setNextLevel}
              renderPlayGroundEdit={renderPlayGroundEdit}
              onUnitClick={onUnitClick}
              onCellClick={onCellClick}
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
