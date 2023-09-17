import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  CELL_EDIT_MODE,
  CELL_MULTISELECT_MODE,
  GAMEPLAY_MODE,
  PERSISTENT_PLACING_MODE,
  PERSISTENT_DELETE_MODE,
  UNIT_EDIT_MODE,
  SELECT_MODE,
} from 'constants/constants';
import {
  BASE_UNIT,
  BOBOMB,
  DEFLECTOR,
  HIDDEN,
  LASER,
  NPC,
  PORTAL,
  TELEPORT,
  WALL,
  UNITS,
} from '../../constants/units';
import Unit from '../Unit';
import { setEditorMode } from '../../redux/user/actions';

export default function PlaygroundEdit(props) {
  const {
    onEdit,
    onSave,
    onLevelParamsEdit,
    currentMode,
    currentCallback,
    currentLevel,
    levels,
    changeCurrentLevel,
  } = props;
  const dispatch = useDispatch();

  const [mode, setMode] = useState(currentMode);
  const [callback, setCallback] = useState(currentCallback);

  const { editorMode } = useSelector((state) => state.user);

  const handleAdminModeChange = ({ target: { checked } }) => {
    localStorage.setItem('editorMode', checked);
    dispatch(setEditorMode(checked));
  };

  const placeUnit = (id) => {
    if (mode === PERSISTENT_PLACING_MODE && currentCallback === id) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);
      setCallback(null);

      return;
    }

    setMode(PERSISTENT_PLACING_MODE);
    setCallback(id);
    onEdit(PERSISTENT_PLACING_MODE, { callback: id });
  };

  const placeBoundedUnits = (id) => {
    if (mode === CELL_MULTISELECT_MODE && currentCallback === id) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);
      setCallback(null);

      return;
    }

    setMode(CELL_MULTISELECT_MODE);
    setCallback(id);
    onEdit(CELL_MULTISELECT_MODE, { callback: id, maxMultiSelect: 2 });
  };

  const callbacks = {
    [BASE_UNIT.id]: () => placeUnit(BASE_UNIT.id),
    [BOBOMB.id]: () => placeUnit(BOBOMB.id),
    [LASER.id]: () => placeUnit(LASER.id),
    [DEFLECTOR.id]: () => placeUnit(DEFLECTOR.id),
    [WALL.id]: () => placeUnit(WALL.id),
    [NPC.id]: () => placeUnit(NPC.id),
    [HIDDEN.id]: () => placeUnit(HIDDEN.id),
    [PORTAL.id]: () => placeBoundedUnits(PORTAL.id),
    [TELEPORT.id]: () => placeBoundedUnits(TELEPORT.id),
  };

  const handleEditUnitsClick = () => {
    if (mode === UNIT_EDIT_MODE) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);

      return;
    }

    setMode(UNIT_EDIT_MODE);
    onEdit(UNIT_EDIT_MODE);
  };

  const handleEditCellsClick = () => {
    if (mode === CELL_EDIT_MODE) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);

      return;
    }

    setMode(CELL_EDIT_MODE);
    onEdit(CELL_EDIT_MODE);
  };

  const handleDeleteUnitsClick = () => {
    if (mode === PERSISTENT_DELETE_MODE) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);

      return;
    }

    setMode(PERSISTENT_DELETE_MODE);
    onEdit(PERSISTENT_DELETE_MODE);
  };

  const handleMoveUnitsClick = () => {
    if (mode === SELECT_MODE) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);

      return;
    }

    setMode(SELECT_MODE);
    onEdit(SELECT_MODE, { callback: 'moveUnit' });
  };

  const handleItemButtonClick = (id) => {
    if (callbacks[id]) {
      callbacks[id]();
    }
  };

  const handleLevelParamsClick = () => {
    onLevelParamsEdit();
  };

  const handleSaveClick = () => {
    onSave();
  };

  const handleLevelSelectorChange = (e) => {
    changeCurrentLevel(e.target.value);
  };

  const renderUnitButton = (id) => (
    <Unit
      key={id}
      isSelected={callback === id}
      isDisabled={false}
      id={id}
      type={id}
      top={0}
      left={0}
      angle={0}
      value={1}
      maxValue={1}
      turrets={[]}
      exploding={false}
      idx={0}
    />
  );

  useEffect(() => {
    setCallback(currentCallback);
  }, [
    currentCallback,
  ]);

  return (
    <div className="levelEditToolbar">
      <div className="levelEditButtons">
        <button
          type="button"
          onClick={handleMoveUnitsClick}
          className={classnames('button levelEditButton', { selected: currentMode === SELECT_MODE })}
        >
          Move Units
        </button>
        <button
          type="button"
          onClick={handleDeleteUnitsClick}
          className={classnames('button levelEditButton', { selected: currentMode === PERSISTENT_DELETE_MODE })}
        >
          Del Units
        </button>
        <button
          type="button"
          onClick={handleEditUnitsClick}
          className={classnames('button levelEditButton', { selected: currentMode === UNIT_EDIT_MODE })}
        >
          Edit Units
        </button>
        <button
          type="button"
          onClick={handleEditCellsClick}
          className={classnames('button levelEditButton', { selected: currentMode === CELL_EDIT_MODE })}
        >
          Edit Cells
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="button levelEditButton"
        >
          Tgl Units
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="button levelEditButton"
        >
          Tgl Turrets
        </button>
        <button
          type="button"
          onClick={handleLevelParamsClick}
          className="button levelEditButton"
        >
          Lvl Params
        </button>
        <button
          type="button"
          onClick={handleSaveClick}
          className="button levelEditButton"
        >
          Save
        </button>
        <select
          className="select"
          onChange={handleLevelSelectorChange}
          value={currentLevel.id}
        >
          {levels.map(({ id, name }) => (
            <option
              id={id}
              key={id}
              value={id}
            >
              {name || id}
            </option>
          ))}
        </select>

        <label className="mainMenu-editorModeSwitcher">
          Editor Mode
          <input
            type="checkbox"
            className="checkbox mainMenu-editorModeSwitcherInput"
            checked={editorMode}
            onChange={handleAdminModeChange}
          />
        </label>
      </div>

      <div className="levelEditItems">
        {UNITS.map((unit) => (
          <div className="levelEditItems-itemButton" key={unit.id} onClick={() => handleItemButtonClick(unit.id)}>
            {renderUnitButton(unit.id)}
          </div>
        ))}
      </div>

    </div>
  );
}

PlaygroundEdit.propTypes = {
  currentMode: PropTypes.string,
  currentCallback: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  currentLevel: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  levels: PropTypes.array,
  onLevelParamsEdit: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  changeCurrentLevel: PropTypes.func,
};

PlaygroundEdit.defaultProps = {
  currentMode: '',
  currentCallback: '',
  currentLevel: {},
  levels: [],
  onLevelParamsEdit: () => {},
  onEdit: () => {},
  onSave: () => {},
  changeCurrentLevel: () => {},
};
