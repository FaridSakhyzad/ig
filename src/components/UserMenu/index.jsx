import React, { useState } from 'react';
import PropTypes, {string} from 'prop-types';
import classnames from 'classnames';
import { GAMEPLAY_MODE, MULTISELECT_MODE, PlACING_MODE, SELECT_MODE } from 'constants/constants';
import Unit from '../Unit';
import './UserMenu.scss';
import { useSelector } from "react-redux";

const UserMenu = ({ onModeChange, onPlacementTypeChange, afterInputAction }) => {
  const { bobombs, defaults, lasers, swaps, rotates } = useSelector(state => state.user);

  const [ placementUnitType, setPlacementUnitType ] = useState(null)
  const handleModeChange = (mode, action) => {
    onModeChange(mode, { callback: action });
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
  }

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button
          disabled={swaps < 1}
          onClick={() => handleModeChange(MULTISELECT_MODE, 'swap')}
          className={classnames('button userMenu-button', { selected: afterInputAction === 'swap' })}
        >Swap {swaps}</button>
        <button
          disabled={rotates < 1}
          onClick={() => handleModeChange(SELECT_MODE, 'rotate_ccv')}
          className={classnames('button userMenu-button', { selected: afterInputAction === 'rotate_ccv' })}
        >&lt;-</button>
        <button disabled={rotates < 1}>{rotates}</button>
        <button
          disabled={rotates < 1}
          onClick={() => handleModeChange(SELECT_MODE, 'rotate_cv')}
          className={classnames('button userMenu-button', { selected: afterInputAction === 'rotate_cv' })}
        >-&gt;</button>
      </div>

      <div className="userMenu-row">
        <div className="userMenu-unitsBox">
          <div className="userMenu-unit" onClick={() => handlePlacementModeChange('default')}>
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
                exploding={false}
                idx={0}
            />
            <div className="userMenu-unitCount">{defaults}</div>
          </div>

          <div className="userMenu-unit" onClick={() => handlePlacementModeChange('bobomb')}>
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
                exploding={false}
                idx={0}
            />
            <div className="userMenu-unitCount">{bobombs}</div>
          </div>

          <div className="userMenu-unit" onClick={() => handlePlacementModeChange('laser')}>
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
                exploding={false}
                idx={0}
            />
            <div className="userMenu-unitCount">{lasers}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  onModeChange: PropTypes.func,
  onPlacementTypeChange: PropTypes.func,
  afterInputAction: string,
}

export default UserMenu;
