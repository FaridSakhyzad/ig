import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Unit.scss';
import { UNIT_EXPLOSION_DURATION } from '../../config/config';

const Unit = ({ id, type, turrets, value, angle, maxValue, idx, onClickHandler, exploding }) => {
  return (
    <div
      className={`unit ${type}`}
      id={id}
      data-index={idx}
      onClick={(e) => onClickHandler(e, id, idx)}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div className="unit-pivot">
        <div
          className={classnames('unit-image', { 'unit-image__exploding': exploding })}
          style={{
            '--unit-image--width': `${value * (100 / maxValue) / 2}%`,
            '--unit-image--explosion-duration': `${UNIT_EXPLOSION_DURATION}ms`
        }}
        />
        {turrets && turrets.map(({ angle, name}, turretIndex) => (
          <div className={`turret ${name}`} data-name={name} style={{ transform: `rotate(${angle}deg)` }} key={turretIndex}>
            <div className="weapon">
              <div className="gunpoint" />
            </div>
          </div>
        ))}

        <div className="unit-hitBox" />
      </div>
    </div>
  )
}

Unit.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number,
  angle: PropTypes.number,
  maxValue: PropTypes.number,
  turrets: PropTypes.array,
  onClickHandler: PropTypes.func,
  exploding: PropTypes.bool,
  idx: PropTypes.number
};

export default Unit;
