import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { GAMEPLAY_MODE, MULTISELECT_MODE, PlACING_MODE, SELECT_MODE } from '../../constants/constants';
import Unit from '../Unit';
import './UserMenu.scss';
import { useSelector } from "react-redux";
import {rotate} from "../../utils";

const UserMenu = ({ userInputMode, onModeChange, onRotate, onConfirm, onCancel, onPlacementTypeChange }) => {
  const { bobombs, defaults, lasers, swaps, rotates } = useSelector(state => state.user);

  const [ onConfirmAction, setOnConfirmAction ] = useState(null);

  const [ placementUnitType, setPlacementUnitType ] = useState(null)
  const handleModeChange = (mode, action) => {
    onModeChange(mode, { callback: action });
    setOnConfirmAction(action);
  }

  const handleCancelClick = () => {
    onCancel();
    onModeChange(GAMEPLAY_MODE);
  }

  const handlePlacementModeChange = (unitType) => {
    if (unitType === 'default' && defaults < 1) {
      return;
    }

    if (unitType === 'bobomb' && bobombs < 1) {
      return;
    }

    if (unitType === 'laser' && lasers < 1) {
      return;
    }

    handleModeChange(PlACING_MODE, 'placing');
    onPlacementTypeChange(unitType);
    setPlacementUnitType(unitType);
    setOnConfirmAction('place');
  }

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button disabled={swaps < 1} onClick={() => handleModeChange(MULTISELECT_MODE, 'swap')} className="button userMenu-button">Swap</button>
        <button disabled={rotates < 1} onClick={() => handleModeChange(SELECT_MODE, 'rotate')} className="button userMenu-button">Rotate</button>
      </div>

      {userInputMode === SELECT_MODE && (
        <>
          <div className="userMenu-row">
            <button onClick={() => onRotate('ccv')} className="button userMenu-button">&lt;-</button>
            <button onClick={() => onRotate('cv')} className="button userMenu-button">-&gt;</button>
          </div>
          <div className="userMenu-row">
            <button onClick={handleCancelClick} className="button userMenu-button">Cancel</button>
            <button onClick={() => onConfirm({ type: onConfirmAction })} className="button userMenu-button">Ok</button>
          </div>
        </>
      )}

      <div className="userMenu-row">
        <div className="userMenu-unitsBox">
          <Unit
              key="default"
              isSelected={placementUnitType === 'default'}
              isDisabled={defaults < 1}
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
          <h2>defaults: {defaults}</h2>

          <Unit
              key="bobomb"
              isSelected={placementUnitType === 'bobomb'}
              isDisabled={bobombs < 1}
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
          <h2>bobombs: {bobombs}</h2>

          <Unit
              key="laser"
              isSelected={placementUnitType === 'laser'}
              isDisabled={lasers < 1}
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
          <h2>lasers: {lasers}</h2>
        </div>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  userInputMode: PropTypes.string,
  onModeChange: PropTypes.func,
  onRotate: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  onPlacementTypeChange: PropTypes.func,
}

export default UserMenu;
