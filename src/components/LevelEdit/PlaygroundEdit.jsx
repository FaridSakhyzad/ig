import React from 'react';
import PropTypes from 'prop-types';
import {
  CELL_EDIT_MODE,
  GAMEPLAY_MODE,
  ITEM_EDIT_MODE,
} from '../../constants/constants';

export default function PlaygroundEdit(props) {
  const { onEdit } = props;

  const handleEditCellsClick = () => {
    onEdit(CELL_EDIT_MODE);
  };

  const handleEditUnitsClick = () => {
    onEdit(ITEM_EDIT_MODE);
  };

  const handleOkClick = () => {
    onEdit(GAMEPLAY_MODE);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleEditUnitsClick}
        className="button"
      >
        Edit Unit
      </button>
      <button
        type="button"
        onClick={handleEditCellsClick}
        className="button"
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
      <button
        type="button"
        onClick={handleOkClick}
        className="button"
      >
        OK
      </button>
    </div>
  );
}

PlaygroundEdit.propTypes = {
  onEdit: PropTypes.func,
};

PlaygroundEdit.defaultProps = {
  onEdit: () => {},
};
