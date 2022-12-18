import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLogo } from '../../redux/ui/actions';
import Projectile from '../Projectile/Projectile';
import Unit from '../Unit/Unit';
import { findCircleLineIntersections } from '../../utils';
import { UNIT_MAX_VALUE, MAP_WIDTH, MAP_HEIGHT } from '../../Config/config';
import MOCK_UNITS from './mockUnits';

const Playground = () => {
  const dispatch = useDispatch();
  const { ui }  = useSelector(state => state);
  const { showLogo } = ui;

  const [ units, setUnits ] = useState(MOCK_UNITS);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ fieldInfo, setFieldInfo ] = useState({});
  const [ unitsMap, setUnitsMap ] = useState([]);

  const [ moves, setMoves ] = useState(10);

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { dataset } = unit;
      const { index } = dataset;

      const { top, left } = unit.getBoundingClientRect();

      const turretsData = [];

      const { turrets, angle: unitAngle, value, type } = units[index];

      unit.querySelectorAll('.turret').forEach(turret => {
        const gunpoint = turret.querySelector('.gunpoint');
        const { name: turretName } = turret.dataset;
        const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

        const { angle, type, maxDistance, speed } = turrets.find(({ name }) => (name === turretName));

        turretsData.push({
          turretName,
          gunpointTop: gunpointTop - fieldTop,
          gunpointLeft: gunpointLeft - fieldLeft,
          angle: unitAngle + angle,
          type,
          maxDistance,
          speed,
        })
      });

      return {
        id: unit.id,
        type,
        index: parseInt(index, 10),
        value,
        top: top - fieldTop,
        left: left - fieldLeft,
        turrets: turretsData,
      };
    })
  }

  const dischargeAllTurrets = (unitIndex, unitsMap) => {
    const { turrets } = unitsMap[unitIndex];

    turrets.forEach(turret => {
      const { gunpointTop: top, gunpointLeft: left, angle, type, maxDistance, speed } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
        id,
        top,
        left,
        angle,
        type,
        maxDistance,
        speed,
      });
    })

    Playground.actingProjectilesNumber += turrets.length;

    setProjectiles(projectiles);
  }

  const explodeUnit = (unitIndex) => {
    const newUnits = [ ...units ];
    newUnits[unitIndex].exploding = true;
    setUnits(newUnits);
  };

  const setUnitValue = (unitIndex, newValue, onValueExceed) => {
    const newUnits = [ ...units ];
    const { maxValue, minValue } = newUnits[unitIndex];

    if (newValue > maxValue) {
      onValueExceed();
      newUnits[unitIndex].value = minValue;
    } else {
      newUnits[unitIndex].value = newValue;
      newUnits[unitIndex].exploding = false;
    }

    setUnits(newUnits);
  }

  const detectUserMoveOutcome = (moves) => {
    if (Playground.actingProjectilesNumber === 0 && moves <= 0) {
      setTimeout(() => { alert('On Click You Loose') }, 300);
    }
  }

  const onClick = (e, unitId, unitIndex) => {
    if (Playground.actingProjectilesNumber > 0) {
      return;
    }

    setProjectiles([]);

    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    const fieldInfo = { fieldTop, fieldLeft, fieldWidth, fieldHeight };
    const unitsMap = generateUnitsMap(fieldTop, fieldLeft);

    setFieldInfo(fieldInfo);
    setUnitsMap(unitsMap);

    const { altKey, shiftKey } = e;

    let newValue = units[unitIndex].value + 1;

    if (altKey) {
      newValue = 0;
    }

    if (shiftKey) {
      newValue = UNIT_MAX_VALUE;
    }

    const newMoves = moves - 1;

    if (!shiftKey && !altKey) {
      setMoves(newMoves);
    }

    const callbacks = {
      default: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        detectUserMoveOutcome(newMoves);
      },
      wall: () => {},
      portal: () => {},
      hidden: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        detectUserMoveOutcome(newMoves);
      },
      laser: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        detectUserMoveOutcome(newMoves);
      },
      bobomb: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        detectUserMoveOutcome(newMoves);
      },
    }

    callbacks[units[unitIndex].type]();
  }

  const detectGameOutcome = () => {
    if (Playground.actingProjectilesNumber !== 0) {
      return;
    }

    const unitsLeft = units.some((unit) => unit.valueCountable && unit.value > 0);

    if (moves < 1 && unitsLeft) {
      setTimeout(() => { alert('You Loose') }, Playground.projectileExplosionDuration + 300)
      return;
    }

    if (moves > 0 && !unitsLeft) {
      setTimeout(() => { alert('You win') }, Playground.projectileExplosionDuration + 300);
    }
  }

  const onOutOfFiled = () => {
    --Playground.actingProjectilesNumber;

    detectGameOutcome();
  }

  const onImpact = (projectileType, impactedUnitIndex) => {
    const callbacks = {
      default: () => {
        if (projectileType === 'default') {
          --Playground.actingProjectilesNumber;

          setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
          });
        }

        if (projectileType === 'laser') {
          setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
          });
        }

        if (projectileType === 'bobomb') {
          --Playground.actingProjectilesNumber;

          setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
          });
        }
      },
      wall: () => {
        --Playground.actingProjectilesNumber;
      },
      laser: () => {
        --Playground.actingProjectilesNumber;

        setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
        });
      },
      bobomb: () => {
        --Playground.actingProjectilesNumber;

        setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
        });
      },
    }

    callbacks[units[impactedUnitIndex].type]();

    detectGameOutcome();
  }

  const makePotentialTargetsMap = (projectileProps) => {
    const { parentId, angle, left: projectileX, top: projectileY } = projectileProps;

    if (angle / 90 % 2 === 0) {
      return unitsMap.filter(unit => {
        const { left: circleX } = unit;
        return Math.abs(circleX - projectileX) <= Playground.unitHitBoxRadius;
      });
    } else if (angle / 90 % 2 === 1) {
      return unitsMap.filter(unit => {
        const { top: circleY } = unit;
        return Math.abs(circleY - projectileY) <= Playground.unitHitBoxRadius;
      });
    }

    const theK = Math.tan((Math.PI / 180) * (90 + angle));
    const theB = projectileY - theK * projectileX;

    return unitsMap.filter(unit => {
      const { id, left: circleX, top: circleY } = unit;

      if (id === parentId) {
        return false;
      }

      const intersection = findCircleLineIntersections(Playground.unitHitBoxRadius, circleX, circleY, theK, theB);

      return intersection.length > 0;
    });
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--map-width', MAP_WIDTH);
    document.documentElement.style.setProperty('--map-height', MAP_HEIGHT);

    Playground.unitHitBoxRadius = parseInt(getComputedStyle(document.body).getPropertyValue('--unit-hitBox--radius'));

    Playground.projectileExplosionDuration = parseFloat(getComputedStyle(document.body).getPropertyValue('--projectile-explosion--duration')) * 1000;
  }, []);

  const handleToggleLogo = () => {
    dispatch(toggleLogo(!showLogo));
  }

  return (
    <>
    {showLogo && (
      <hr />
    )}
    <h1>{moves}</h1>
    <button onClick={handleToggleLogo}>asdf</button>
    <div className="field" id="field">
      <div className="projectileLayer">
        {projectiles && projectiles.map((projectileProps) => (
          <Projectile
            key={projectileProps.id}
            units={units}
            potentialTargetsMap={makePotentialTargetsMap(projectileProps)}
            fieldInfo={fieldInfo}
            onOutOfFiled={onOutOfFiled}
            onImpact={onImpact}
            {...projectileProps}
          />
        ))}
      </div>
      <div className="unitLayer">
        {units.map(({ id, type, angle, value, maxValue, turrets, exploding }, index) => (
          <Unit
            key={id}
            id={id}
            type={type}
            angle={angle}
            value={value}
            maxValue={maxValue}
            turrets={turrets}
            onClickHandler={onClick}
            exploding={exploding}
            idx={index}
          />
        ))}
      </div>
    </div>
    </>
  )
}

Playground.projectileExplosionDuration = 0;
Playground.actingProjectilesNumber = 0;

export default Playground;