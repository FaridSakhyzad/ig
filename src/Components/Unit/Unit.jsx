import React from 'react';

const Unit = ({ turrets, id, onClickHandler }) => {
  return (
    <div className="unit-pivot" id={id}>
      <div className="unit" onClick={(e) => onClickHandler(e, id)}>
        <div className="unit-hitBox" />
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