import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const Unit = ({ id, type, turrets, value, angle, maxValue, idx, onClickHandler, exploding }) => {
  return (
    <div className={`unit-pivot ${type}`} id={id} data-index={idx} style={{ transform: `rotate(${angle}deg)` }}>
      <div className="unit" onClick={(e) => onClickHandler(e, id, idx)}>
        <div className="unit-hitBox" />
        <div className={classnames('unit-image', { 'unit-image__exploding': exploding })} style={
          { '--unit-image--radius': `${value * (100 / maxValue) / 2}%` }} />

        {turrets && turrets.map(({ angle, name}, turretIndex) => (
          <div className={`turret ${name}`} data-name={name} style={{ transform: `rotate(${angle}deg)` }} key={turretIndex}>
            <div className="weapon">
              <div className="gunpoint" />
            </div>
          </div>
        ))}
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