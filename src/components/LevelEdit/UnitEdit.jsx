import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

import { Units } from '../../constants/units';
import { TURRETS } from '../../constants/turrets';
import BaseTurret from '../../turrets/BaseTurret';

export default function UnitEdit(props) {
  const {
    unitParams: paramsFromProps,
    unitTurrets: turretsFromProps,
    onApply,
    onClose,
  } = props;

  const [unitParams, setUnitParams] = useState(paramsFromProps);
  const [unitTurrets, setUnitTurrets] = useState(turretsFromProps);

  const handleParamChange = (value, param) => {
    console.log(param, value);

    setUnitParams({
      ...unitParams,
      [param]: value,
    });
  };

  const handleTurretParamChange = (turretIdx, value, param) => {
    unitTurrets[turretIdx][param] = value;

    setUnitTurrets([...unitTurrets]);
  };

  const handleApplyClick = () => {
    onApply(unitParams, unitTurrets);
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleAddTurretClick = () => {
    unitTurrets.push(new BaseTurret());
    setUnitTurrets([...unitTurrets]);
  };

  const handleDeleteTurretClick = (idx) => {
    unitTurrets.splice(idx, 1);
    setUnitTurrets([...unitTurrets]);
  };

  const unitType = Units.find(({ id }) => id === unitParams.type);

  return (
    <div className="levelEdit">
      <div className="container">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12}>Type: {unitType.label}</Grid>

          <Grid item xs={6}>Value</Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              type="number"
              value={unitParams.value}
              onChange={(e) => handleParamChange(parseInt(e.target.value, 10), 'value')}
              classes={{
                root: 'levelEditInput',
              }}
            />
          </Grid>

          <Grid item xs={6}>Max Value</Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              type="number"
              value={unitParams.maxValue}
              onChange={(e) => handleParamChange(parseInt(e.target.value, 10), 'maxValue')}
              classes={{
                root: 'levelEditInput',
              }}
            />
          </Grid>

          <Grid item xs={6}>Min Value</Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              type="number"
              value={unitParams.minValue}
              onChange={(e) => handleParamChange(parseInt(e.target.value, 10), 'minValue')}
              classes={{
                root: 'levelEditInput',
              }}
            />
          </Grid>

          <Grid item xs={6}>Angle</Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              type="number"
              value={unitParams.angle}
              onChange={(e) => handleParamChange(parseInt(e.target.value, 10), 'angle')}
              classes={{
                root: 'levelEditInput',
              }}
            />
          </Grid>

          <Grid item xs={6}>Selectable</Grid>
          <Grid item xs={6}>
            <Checkbox
              checked={unitParams.selectable}
              onChange={(e, data) => handleParamChange(data, 'selectable')}
            />
          </Grid>
          <Grid item xs={6}>Value Countable in Win and Loss</Grid>
          <Grid item xs={6}>
            <Checkbox
              checked={unitParams.valueCountable}
              onChange={(e, data) => handleParamChange(data, 'valueCountable')}
            />
          </Grid>

          {(unitTurrets && unitTurrets.length > 0) && (
            <>
              <Grid item xs={12}><hr /></Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}><h2>Turrets</h2></Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      onClick={handleAddTurretClick}
                    >
                      Add Turret
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  {unitTurrets.map((turret, turretIdx) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Grid item key={`${turret.name}_${turretIdx}`} xs={12}>
                      <Grid container spacing={1} padding={1}>
                        <Grid item xs={6}>Name:</Grid>
                        <Grid item xs={6}>{turret.name}</Grid>
                      </Grid>
                      <Grid container spacing={1} padding={1}>
                        <Grid item xs={6}>Type:</Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth className="levelEditSelectRoot">
                            <InputLabel id="turret-type-label">Turret Type</InputLabel>
                            <Select
                              labelId="turret-type-label"
                              id="turret-type"
                              value={turret.type}
                              label="Turret Type"
                              onChange={(e) => handleTurretParamChange(turretIdx, e.target.value, 'type')}
                              classes={{
                                select: 'levelEditSelect',
                              }}
                            >
                              {TURRETS.map(({ id, label }) => (
                                <MenuItem value={id} key={id}>{label}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={6}>Angle:</Grid>
                        <Grid item xs={6}>
                          <TextField
                            size="small"
                            type="number"
                            value={turret.angle}
                            onChange={(e) => handleTurretParamChange(turretIdx, parseInt(e.target.value, 10), 'angle')}
                            classes={{
                              root: 'levelEditInput',
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>Bullet pass Delay (ms/screen unit):</Grid>
                        <Grid item xs={6}>
                          <TextField
                            size="small"
                            type="number"
                            value={turret.speed}
                            onChange={(e) => handleTurretParamChange(turretIdx, parseInt(e.target.value, 10), 'speed')}
                            classes={{
                              root: 'levelEditInput',
                            }}
                          />
                        </Grid>

                        <Grid item xs={6}>Bullet Max Distance:</Grid>
                        <Grid item xs={6}>
                          <TextField
                            size="small"
                            type="number"
                            value={turret.maxDistance}
                            onChange={(e) => handleTurretParamChange(turretIdx, parseInt(e.target.value, 10), 'maxDistance')}
                            classes={{
                              root: 'levelEditInput',
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} />
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            onClick={handleDeleteTurretClick}
                          >
                            Delete Turret
                          </Button>
                        </Grid>
                      </Grid>
                      <hr />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </div>

      <div className="levelEdit-footer">
        <div className="container">
          <Grid container spacing={1}>
            <Grid item>
              <Button variant="contained" classes={{ root: 'mapList-newLevelButton' }} onClick={handleApplyClick}>Apply</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleCloseClick}>Close</Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

UnitEdit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  unitParams: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  unitTurrets: PropTypes.object.isRequired,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
};

UnitEdit.defaultProps = {
  onApply: () => {},
  onClose: () => {},
};
