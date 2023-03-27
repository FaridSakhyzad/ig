import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { GAMEPLAY_MODE, MULTISELECT_MODE, SELECT_MODE } from '../../constants/constants';
import './UserMenu.scss';

const UserMenu = ({ userInputMode, onModeChange, onRotate, onConfirm }) => {
  const [ onConfirmAction, setOnConfirmAction ] = useState(null)
  const handleModeChange = (mode, action) => {
    onModeChange(mode);
    setOnConfirmAction(action);
  }

  const handleCancelClick = () => {
    onModeChange(GAMEPLAY_MODE);
  }

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button onClick={() => handleModeChange(MULTISELECT_MODE, 'swap')} className="button userMenu-button">Swap</button>
        <button onClick={() => handleModeChange(SELECT_MODE, 'rotate')} className="button userMenu-button">Rotate</button>
      </div>
      {userInputMode === SELECT_MODE && (
        <div className="userMenu-row">
          <button onClick={() => onRotate('ccv')} className="button userMenu-button">&lt;-</button>
          <button onClick={() => onRotate('cv')} className="button userMenu-button">-&gt;</button>
        </div>
      )}
      {userInputMode !== GAMEPLAY_MODE && (
        <div className="userMenu-row">
          <button onClick={handleCancelClick} className="button userMenu-button">Cancel</button>
          <button onClick={() => onConfirm(onConfirmAction)} className="button userMenu-button">Ok</button>
        </div>
      )}
    </div>
  );
}

UserMenu.propTypes = {
  userInputMode: PropTypes.string,
  onModeChange: PropTypes.func,
  onRotate: PropTypes.func,
  onConfirm: PropTypes.func,
}

export default UserMenu;
