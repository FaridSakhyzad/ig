import React from 'react';
import PropTypes from 'prop-types';

const Unit = ({ turrets, value, maxValue, id, idx, onClickHandler }) => {
  return (
    <div className="unit-pivot" id={id} data-index={idx}>
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
  turrets: PropTypes.array,
  value: PropTypes.number,
  maxValue: PropTypes.number,
  id: PropTypes.string,
  idx: PropTypes.number,
  onClickHandler: PropTypes.func
};

export default Unit;