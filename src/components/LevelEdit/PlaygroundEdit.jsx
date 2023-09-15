import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import {
  CELL_EDIT_MODE,
  GAMEPLAY_MODE,
  ITEM_EDIT_MODE,
} from '../../constants/constants';

export default function PlaygroundEdit(props) {
  const { onEdit, currentMode } = props;

  const [mode, setMode] = useState(currentMode);

  const handleEditUnitsClick = () => {
    if (mode === ITEM_EDIT_MODE) {
      setMode(GAMEPLAY_MODE);
      onEdit(GAMEPLAY_MODE);

      return;
    }

    setMode(ITEM_EDIT_MODE);
    onEdit(ITEM_EDIT_MODE);
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

  return (
    <div>
      <button
        type="button"
        onClick={handleEditUnitsClick}
        className={classnames('button', { selected: currentMode === ITEM_EDIT_MODE })}
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
  );
}

PlaygroundEdit.propTypes = {
  currentMode: PropTypes.string,
  onEdit: PropTypes.func,
};

PlaygroundEdit.defaultProps = {
  currentMode: '',
  onEdit: () => {},
};
