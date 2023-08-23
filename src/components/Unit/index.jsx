import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Unit.scss';
import { UNIT_EXPLOSION_DURATION } from '../../config/config';

function Unit(props) {
  const {
    id,
    top,
    left,
    width,
    height,
    kind,
    type,
    isSelected,
    isDisabled,
    turrets,
    value,
    angle,
    maxValue,
    idx,
    onClickHandler,
    exploding,
    hitBoxRadius,
  } = props;

  if (id === undefined || top === undefined || left === undefined) {
    return null;
  }

  return (
    <div
      className={classnames('unit', type, kind, { 'unit--selected': isSelected, 'unit--disabled': isDisabled })}
      id={id}
      data-index={idx}
      onClick={(e) => onClickHandler(e, id, idx)}
      style={{
        transform: `rotate(${angle}deg)`,
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}%`,
        height: `${height}%`,
      }}
    >
      <div className="unit-pivot">
        {exploding && (
        <div
          className="unit-image unit-image--exploding"
          style={{ '--unit-image--explosion-duration': `${UNIT_EXPLOSION_DURATION}ms` }}
        />
        )}
        <div
          className="unit-image"
          style={{ '--unit-image--width': `${(value * 100) / (maxValue / 2)}%` }}
        />
        {turrets && turrets.map(({ angle: turretAngle, name }, turretIndex) => (
          <div
            className={`turret ${name}`}
            data-name={name}
            style={{ transform: `rotate(${turretAngle}deg)` }}
            key={turretIndex} // eslint-disable-line react/no-array-index-key
          >
            <div className="weapon">
              <div className="gunpoint" />
            </div>
          </div>
        ))}

        <div
          className="_unit-hit-box unit-hitBox"
          style={{
            '--unit-hitBox--radius': `${hitBoxRadius}px`,
          }}
        />
      </div>
    </div>
  );
}

Unit.propTypes = {
  id: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  hitBoxRadius: PropTypes.number,
  isSelected: PropTypes.bool,
  isDisabled: PropTypes.bool,
  type: PropTypes.string.isRequired,
  kind: PropTypes.string,
  value: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  turrets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    angle: PropTypes.number,
    speed: PropTypes.number,
  })).isRequired,
  onClickHandler: PropTypes.func,
  exploding: PropTypes.bool.isRequired,
  idx: PropTypes.number.isRequired,
};

Unit.defaultProps = {
  isSelected: false,
  isDisabled: false,
  onClickHandler: () => {},
  kind: null,
  hitBoxRadius: null,
  width: null,
  height: null,
};

export default Unit;
