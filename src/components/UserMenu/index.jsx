import React, { useState } from 'react';
import PropTypes, {string} from 'prop-types';
import classnames from 'classnames';
import { GAMEPLAY_MODE, MULTISELECT_MODE, PlACING_MODE, SELECT_MODE } from 'constants/constants';
import Unit from '../Unit';
import './UserMenu.scss';
import { useSelector } from "react-redux";

const UserMenu = ({ onModeChange, afterInputAction }) => {
  const { bobombs, defaults, lasers, portals, swaps, jumps, rotates } = useSelector(state => state.user);

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        <button
          disabled={swaps < 1}
          onClick={() => onModeChange(MULTISELECT_MODE, { callback: 'swap' })}
          className={classnames('button userMenu-button', { selected: afterInputAction === 'swap' })}
        >Swap {swaps}</button>
        <button
          disabled={jumps < 1}
          onClick={() => onModeChange(SELECT_MODE, { callback: 'jump' })}
          className={classnames('button userMenu-button', { selected: afterInputAction === 'jump' })}
        >Jumps {jumps}</button>
        <button
          disabled={rotates < 1}
          onClick={() => onModeChange(SELECT_MODE, { callback: 'rotate_ccv' })}
          className={classnames('button userMenu-button userMenu-button_rotate-ccv', { selected: afterInputAction === 'rotate_ccv' })}
        >&lt;-</button>
        <button className="button userMenu-button userMenu-button_rotates-count" disabled={rotates < 1}>{rotates}</button>
        <button
          disabled={rotates < 1}
          onClick={() => onModeChange(SELECT_MODE, { callback: 'rotate_cv' })}
          className={classnames('button userMenu-button userMenu-button_rotate-cv', { selected: afterInputAction === 'rotate_cv' })}
        >-&gt;</button>
      </div>

      <div className="userMenu-row">
        <div className="userMenu-unitsBox">
          <div
            className="userMenu-unit"
            onClick={() => onModeChange(PlACING_MODE, { callback: 'default' })}
          >
            <Unit
                key="default"
                isSelected={afterInputAction === 'default'}
                isDisabled={defaults < 1}
                id="default"
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

          <div
            className="userMenu-unit"
            onClick={() => onModeChange(PlACING_MODE, { callback: 'bobomb' })}
          >
            <Unit
                key="bobomb"
                isSelected={afterInputAction === 'bobomb'}
                isDisabled={bobombs < 1}
                id="bobomb"
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

          <div
            className="userMenu-unit"
            onClick={() => onModeChange(PlACING_MODE, { callback: 'laser' })}
          >
            <Unit
                key="laser"
                isSelected={afterInputAction === 'laser'}
                isDisabled={lasers < 1}
                id="laser"
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

          <div
            className="userMenu-unit"
            onClick={() => onModeChange(MULTISELECT_MODE, { callback: 'portal' })}
          >
            <Unit
              key="portal"
              isSelected={afterInputAction === 'portal'}
              isDisabled={portals < 1}
              id="portal"
              type="portal"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              exploding={false}
              idx={0}
            />
            <div className="userMenu-unitCount">{portals}</div>
          </div>

          <div
            className="userMenu-unit"
            onClick={() => onModeChange(PlACING_MODE, { callback: 'deflector' })}
          >
            <Unit
              key="deflector"
              isSelected={afterInputAction === 'deflector'}
              isDisabled={portals < 1}
              id="deflector"
              type="deflector"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              exploding={false}
              idx={0}
            />
            <div className="userMenu-unitCount">&infin;</div>
          </div>

          <div
            className="userMenu-unit"
            onClick={() => onModeChange(MULTISELECT_MODE, { callback: 'teleport' })}
          >
            <Unit
              key="teleport"
              isSelected={afterInputAction === 'teleport'}
              id="teleport"
              type="teleport"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              exploding={false}
              idx={0}
            />
            <div className="userMenu-unitCount">&infin;</div>
          </div>

          <div
            className="userMenu-unit"
            onClick={() => onModeChange(PlACING_MODE, { callback: 'wall' })}
          >
            <Unit
              key="wall"
              kind="stone"
              isSelected={afterInputAction === 'wall'}
              id="wall"
              type="wall"
              angle={0}
              value={1}
              maxValue={1}
              turrets={[]}
              exploding={false}
              idx={0}
            />
            <div className="userMenu-unitCount">&infin;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  onModeChange: PropTypes.func,
  afterInputAction: string,
}

export default UserMenu;
