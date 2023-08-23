import React from 'react';
import PropTypes, { string } from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import {
  CELL_MULTISELECT_MODE,
  ITEM_MULTISELECT_MODE,
  PLACING_MODE,
  SELECT_MODE,
} from 'constants/constants';
import Unit from '../Unit';
import './UserMenu.scss';

function UserMenu({ onModeChange, afterInputAction }) {
  const {
    swaps,
    rotates,
    jumps,
    defaults,
    bobombs,
    lasers,
    deflectors,
    walls,
    // npc,
    // hidden,
    portals,
    teleports,
    ammoRestrictions,
  } = useSelector((state) => state.user);

  return (
    <div className="userMenu">
      <div className="userMenu-row">
        {!ammoRestrictions.swaps && (
          <button
            type="button"
            disabled={swaps < 1}
            onClick={() => onModeChange(ITEM_MULTISELECT_MODE, { callback: 'swap' })}
            className={classnames('button userMenu-button', { selected: afterInputAction === 'swap' })}
          >
            Swap {swaps}
          </button>
        )}

        {!ammoRestrictions.jumps && (
          <button
            type="button"
            disabled={jumps < 1}
            onClick={() => onModeChange(SELECT_MODE, { callback: 'jump' })}
            className={classnames('button userMenu-button', { selected: afterInputAction === 'jump' })}
          >
            Jumps {jumps}
          </button>
        )}

        {!ammoRestrictions.rotates && (
          <>
            <button
              type="button"
              disabled={rotates < 1}
              onClick={() => onModeChange(SELECT_MODE, { callback: 'rotate_ccv' })}
              className={classnames('button userMenu-button userMenu-button_rotate-ccv', { selected: afterInputAction === 'rotate_ccv' })}
            >
              &lt;-
            </button>
            <button
              type="button"
              className="button userMenu-button userMenu-button_rotates-count"
              disabled={rotates < 1}
            >
              {rotates}
            </button>
            <button
              type="button"
              disabled={rotates < 1}
              onClick={() => onModeChange(SELECT_MODE, { callback: 'rotate_cv' })}
              className={classnames('button userMenu-button userMenu-button_rotate-cv', { selected: afterInputAction === 'rotate_cv' })}
            >
              -&gt;
            </button>
          </>
        )}
      </div>

      <div className="userMenu-row">
        <div className="userMenu-unitsBox">
          {!ammoRestrictions.defaults && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(PLACING_MODE, { callback: 'default' })}
            >
              <Unit
                key="default"
                isSelected={afterInputAction === 'default'}
                isDisabled={defaults < 1}
                id="default"
                type="default"
                top={0}
                left={0}
                angle={0}
                value={1}
                maxValue={1}
                turrets={[]}
                exploding={false}
                idx={0}
              />
              <div className="userMenu-unitCount">{defaults}</div>
            </div>
          )}

          {!ammoRestrictions.bobombs && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(PLACING_MODE, { callback: 'bobomb' })}
            >
              <Unit
                key="bobomb"
                isSelected={afterInputAction === 'bobomb'}
                isDisabled={bobombs < 1}
                id="bobomb"
                top={0}
                left={0}
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
          )}

          {!ammoRestrictions.lasers && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(PLACING_MODE, { callback: 'laser' })}
            >
              <Unit
                key="laser"
                isSelected={afterInputAction === 'laser'}
                isDisabled={lasers < 1}
                id="laser"
                top={0}
                left={0}
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
          )}

          {!ammoRestrictions.portals && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(CELL_MULTISELECT_MODE, { callback: 'portal' })}
            >
              <Unit
                key="portal"
                isSelected={afterInputAction === 'portal'}
                isDisabled={portals < 1}
                id="portal"
                top={0}
                left={0}
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
          )}

          {!ammoRestrictions.deflectors && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(PLACING_MODE, { callback: 'deflector' })}
            >
              <Unit
                key="deflector"
                isSelected={afterInputAction === 'deflector'}
                isDisabled={deflectors < 1}
                id="deflector"
                top={0}
                left={0}
                type="deflector"
                angle={0}
                value={1}
                maxValue={1}
                turrets={[]}
                exploding={false}
                idx={0}
              />
              <div className="userMenu-unitCount">{deflectors}</div>
            </div>
          )}

          {!ammoRestrictions.teleports && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(CELL_MULTISELECT_MODE, { callback: 'teleport' })}
            >
              <Unit
                key="teleport"
                isSelected={afterInputAction === 'teleport'}
                id="teleport"
                top={0}
                left={0}
                type="teleport"
                angle={0}
                value={1}
                maxValue={1}
                turrets={[]}
                exploding={false}
                idx={0}
              />
              <div className="userMenu-unitCount">{teleports}</div>
            </div>
          )}

          {!ammoRestrictions.walls && (
            <div
              className="userMenu-unit"
              onClick={() => onModeChange(PLACING_MODE, { callback: 'wall' })}
            >
              <Unit
                key="wall"
                kind="stone"
                isSelected={afterInputAction === 'wall'}
                id="wall"
                top={0}
                left={0}
                type="wall"
                angle={0}
                value={1}
                maxValue={1}
                turrets={[]}
                exploding={false}
                idx={0}
              />
              <div className="userMenu-unitCount">{walls}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

UserMenu.propTypes = {
  onModeChange: PropTypes.func.isRequired,
  afterInputAction: string,
};

UserMenu.defaultProps = {
  afterInputAction: null,
};

export default UserMenu;
