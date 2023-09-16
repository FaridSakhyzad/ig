import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  CELL_EDIT_MODE, CELL_MULTISELECT_MODE,
  GAMEPLAY_MODE,
  PERSISTENT_PLACING_MODE,
  UNIT_DELETE_MODE,
  UNIT_EDIT_MODE,
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
  Units,
} from '../../constants/units';
import Unit from '../Unit';

export default function PlaygroundEdit(props) {
  const { onEdit, currentMode, currentCallback } = props;

  const [mode, setMode] = useState(currentMode);
  const [callback, setCallback] = useState(currentCallback);

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
    onEdit(CELL_MULTISELECT_MODE, { callback: id });
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
    if (mode === UNIT_DELETE_MODE) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);

      return;
    }

    setMode(UNIT_DELETE_MODE);
    onEdit(UNIT_DELETE_MODE);
  };

  const handleItemButtonClick = (id) => {
    if (callbacks[id]) {
      callbacks[id]();
    }
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
          onClick={handleDeleteUnitsClick}
          className={classnames('button', { selected: currentMode === UNIT_DELETE_MODE })}
        >
          Delete
        </button>
        <button
          type="button"
          onClick={handleEditUnitsClick}
          className={classnames('button', { selected: currentMode === UNIT_EDIT_MODE })}
        >
          Edit Unit
        </button>
        <button
          type="button"
          onClick={handleEditCellsClick}
          className={classnames('button', { selected: currentMode === CELL_EDIT_MODE })}
        >
          Edit Cell
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="button"
        >
          Toggle Units
        </button>
        <button
          type="button"
          onClick={() => {}}
          className="button"
        >
          Toggle Turrets
        </button>
      </div>

      <div className="levelEditItems">
        {Units.map((unit) => (
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
  onEdit: PropTypes.func,
};

PlaygroundEdit.defaultProps = {
  currentMode: '',
  currentCallback: '',
  onEdit: () => {},
};
