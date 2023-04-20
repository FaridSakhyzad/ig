import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { GAMEPLAY_MODE, MULTISELECT_MODE, PlACING_MODE, SELECT_MODE } from '../../constants/constants';
import Unit from '../Unit';
import './UserMenu.scss';

const UserMenu = ({ userInputMode, onModeChange, onRotate, onConfirm, onPlacementTypeChange }) => {
  const [ onConfirmAction, setOnConfirmAction ] = useState(null)
  const handleModeChange = (mode, action) => {
    onModeChange(mode);
    setOnConfirmAction(action);
  }

  const handleCancelClick = () => {
    onModeChange(GAMEPLAY_MODE);
  }

  const handlePlacementModeChange = (unitType) => {
    onPlacementTypeChange(unitType);
    setOnConfirmAction('place');
  }

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button onClick={() => handleModeChange(MULTISELECT_MODE, 'swap')} className="button userMenu-button">Swap</button>
        <button onClick={() => handleModeChange(SELECT_MODE, 'rotate')} className="button userMenu-button">Rotate</button>
        <button onClick={() => handleModeChange(PlACING_MODE, 'placing')} className="button userMenu-button">Place Item</button>
      </div>
      {userInputMode === SELECT_MODE && (
        <div className="userMenu-row">
          <button onClick={() => onRotate('ccv')} className="button userMenu-button">&lt;-</button>
          <button onClick={() => onRotate('cv')} className="button userMenu-button">-&gt;</button>
        </div>
      )}
      {userInputMode === PlACING_MODE && (
        <div className="userMenu-row">
          <div className="userMenu-unitsBox">
            <Unit
              key="default"
              isSelected={false}
              id="1"
              type="default"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              onClickHandler={() => handlePlacementModeChange('default')}
              exploding={false}
              idx={0}
            />
            <Unit
              key="bobomb"
              isSelected={false}
              id="2"
              type="bobomb"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              onClickHandler={() => handlePlacementModeChange('bobomb')}
              exploding={false}
              idx={0}
            />
            <Unit
              key="laser"
              isSelected={false}
              id="3"
              type="laser"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              onClickHandler={() => handlePlacementModeChange('laser')}
              exploding={false}
              idx={0}
            />
          </div>
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
  onPlacementTypeChange: PropTypes.func,
}

export default UserMenu;
