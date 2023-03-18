import React from 'react';
import PropTypes from 'prop-types';
import { GAMEPLAY_MODE, MULTISELECT_MODE, SELECT_MODE } from '../../constants/constants';
import './UserMenu.scss';

const UserMenu = ({ gameMode, onModeChange, onRotate, onConfirm }) => {
  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button onClick={() => onModeChange(MULTISELECT_MODE)} className="button userMenu-button">Swap</button>
        <button onClick={() => onModeChange(SELECT_MODE)} className="button userMenu-button">Rotate</button>
      </div>
      {gameMode === SELECT_MODE && (
        <div className="userMenu-row">
          <button onClick={() => onRotate('ccv')} className="button userMenu-button">&lt;-</button>
          <button onClick={() => onRotate('cv')} className="button userMenu-button">-&gt;</button>
        </div>
      )}
      <div className="userMenu-row">
        <button onClick={onConfirm} className="button userMenu-button">Ok</button>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  gameMode: PropTypes.string,
  onModeChange: PropTypes.func,
  onRotate: PropTypes.func,
  onConfirm: PropTypes.func,
}

export default UserMenu;
