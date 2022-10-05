import React from 'react';

const Unit = ({ turrets, value, id, idx, onClickHandler }) => {
  return (
    <div className="unit-pivot" id={id} data-index={idx}>
      <div className="unit" onClick={(e) => onClickHandler(e, id)}>
        <div className="unit-hitBox" />
        <div className="unit-image" style={{ '--unit-image--radius': `${value * 25 / 2}%` }} />
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

export default Unit;