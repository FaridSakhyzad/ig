import React from 'react';
import PropTypes from 'prop-types';
import { GAMEPLAY_MODE, MULTISELECT_MODE, SELECT_MODE } from '../../constants/constants';
import './UserMenu.scss';

const UserMenu = ({ gameMode, onModeChange, onRotate }) => {
  const handleToolButtonClick = (mode) => {
    onModeChange(mode);
  }

  const handleOkButtonClick = () => {
    onModeChange(GAMEPLAY_MODE);
  }

  const handleRotateClick = (direction) => {
    onRotate(direction);
  }

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button onClick={() => handleToolButtonClick(MULTISELECT_MODE)} className="button userMenu-button">Swap</button>
        <button onClick={() => handleToolButtonClick(SELECT_MODE)} className="button userMenu-button">Rotate</button>
      </div>
      {gameMode === SELECT_MODE && (
        <div className="userMenu-row">
          <button onClick={() => handleRotateClick('ccv')} className="button userMenu-button">&lt;-</button>
          <button onClick={() => handleRotateClick('cv')} className="button userMenu-button">-&gt;</button>
        </div>
      )}
      <div className="userMenu-row">
        <button onClick={handleOkButtonClick} className="button userMenu-button">Ok</button>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  gameMode: PropTypes.string,
  onModeChange: PropTypes.func,
  onRotate: PropTypes.func,
}

export default UserMenu;
