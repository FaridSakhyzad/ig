import React from 'react';
import PropTypes from 'prop-types';

const Unit = ({ id, type, turrets, value, angle, maxValue,  idx, onClickHandler }) => {
  return (
    <div className={`unit-pivot ${type}`} id={id} data-index={idx} style={{ transform: `rotate(${angle}deg)` }}>
      <div className="unit" onClick={(e) => onClickHandler(e, id, idx)}>
        <div className="unit-hitBox" />
        <div className="unit-image" style={{ '--unit-image--radius': `${value * (100 / maxValue) / 2}%` }} />

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
  idx: PropTypes.number
};

export default Unit;