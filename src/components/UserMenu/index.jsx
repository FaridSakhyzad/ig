import React from 'react';
import PropTypes, { bool, string } from 'prop-types';
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

function UserMenu({ onModeChange, afterInputAction, disabled }) {
  const {
    swaps,
    rotates,
    jumps,
    deletes,

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

  const handleMenuButtonClick = (ammoItem, mode, options) => {
    if (ammoItem < 1) {
      return;
    }

    onModeChange(mode, options);
  };

  return (
    <div className={classnames('userMenu', { disabled })}>
      <div className="userMenu-row">
        {!ammoRestrictions.deletes && (
          <button
            type="button"
            disabled={deletes < 1}
            onClick={() => handleMenuButtonClick(deletes, SELECT_MODE, { callback: 'delete' })}
            className={classnames('button userMenu-button', { selected: afterInputAction === 'delete' })}
          >
            Dels {deletes}
          </button>
        )}

        {!ammoRestrictions.swaps && (
          <button
            type="button"
            disabled={swaps < 1}
            onClick={() => handleMenuButtonClick(swaps, ITEM_MULTISELECT_MODE, { callback: 'swap' })}
            className={classnames('button userMenu-button', { selected: afterInputAction === 'swap' })}
          >
            Swaps {swaps}
          </button>
        )}

        {!ammoRestrictions.jumps && (
          <button
            type="button"
            disabled={jumps < 1}
            onClick={() => handleMenuButtonClick(jumps, SELECT_MODE, { callback: 'jump' })}
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
              onClick={() => handleMenuButtonClick(rotates, SELECT_MODE, { callback: 'rotate_ccv' })}
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
              onClick={() => handleMenuButtonClick(rotates, SELECT_MODE, { callback: 'rotate_cv' })}
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
              onClick={() => handleMenuButtonClick(defaults, PLACING_MODE, { callback: 'default' })}
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
              onClick={() => handleMenuButtonClick(bobombs, PLACING_MODE, { callback: 'bobomb' })}
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
              onClick={() => handleMenuButtonClick(lasers, PLACING_MODE, { callback: 'laser' })}
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
              onClick={() => handleMenuButtonClick(portals, CELL_MULTISELECT_MODE, { callback: 'portal' })}
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
              onClick={() => handleMenuButtonClick(deflectors, PLACING_MODE, { callback: 'deflector' })}
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
              onClick={() => handleMenuButtonClick(teleports, CELL_MULTISELECT_MODE, { callback: 'teleport' })}
            >
              <Unit
                key="teleport"
                isSelected={afterInputAction === 'teleport'}
                isDisabled={teleports < 1}
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
              onClick={() => handleMenuButtonClick(walls, PLACING_MODE, { callback: 'wall' })}
            >
              <Unit
                key="wall"
                kind="stone"
                isSelected={afterInputAction === 'wall'}
                isDisabled={walls < 1}
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
  disabled: bool,
};

UserMenu.defaultProps = {
  afterInputAction: null,
  disabled: false,
};

export default UserMenu;
