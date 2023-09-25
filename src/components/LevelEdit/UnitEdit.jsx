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

import {
  PORTAL,
  TELEPORT,
  UNIT_KINDS,
  UNITS,
} from '../../constants/units';
import { TURRETS } from '../../constants/turrets';
import BaseTurret from '../../turrets/BaseTurret';

export default function UnitEdit(props) {
  const {
    unitParams: paramsFromProps,
    unitTurrets: turretsFromProps,
    onApply,
    onClose,
    portalExitPoints,
    teleportExitPoints,
  } = props;

  const [unitParams, setUnitParams] = useState(paramsFromProps);
  const [unitTurrets, setUnitTurrets] = useState(turretsFromProps);

  const handleParamChange = (value, param) => {
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

  const unitType = UNITS.find(({ id }) => id === unitParams.type);

  const handleUnitKindChange = (kind) => {
    setUnitParams({
      ...unitParams,
      kind,
    });
  };

  const portalExitPointsFiltered = portalExitPoints.filter(
    ({ exitPortalId }) => unitParams.id !== exitPortalId,
  );

  const teleportExitPointsFiltered = teleportExitPoints.filter(
    ({ exitTeleportId }) => unitParams.id !== exitTeleportId,
  );

  const handlePortalExitPoint = (newExitId) => {
    setUnitParams({
      ...unitParams,
      meta: {
        exitPortalId: newExitId,
      },
    });
  };

  const handleTeleportExitPoint = (newExitId) => {
    setUnitParams({
      ...unitParams,
      meta: {
        exitTeleportId: newExitId,
      },
    });
  };

  return (
    <div className="levelEdit">
      <div className="container">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12}>
            <h2 className="titleH2">{unitType.label} | {unitParams.id}</h2>
          </Grid>

          {unitParams.kind && (
            <>
              <Grid item xs={6}>Kind:</Grid>
              <Grid item xs={6}>
                <FormControl fullWidth className="levelEditSelectRoot">
                  <InputLabel id="portal-exit-label">Portal Exit</InputLabel>
                  <Select
                    labelId="portal-exit-label"
                    id="portal-exit"
                    value={unitParams.kind}
                    label="Portal Exit"
                    onChange={(e) => handleUnitKindChange(e.target.value)}
                    classes={{
                      select: 'levelEditSelect',
                    }}
                  >
                    {UNIT_KINDS[unitParams.type].map((unitKind) => (
                      <MenuItem value={unitKind} key={unitKind}>
                        {unitKind}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

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

          {unitParams.meta && (
            <>
              {unitParams.type === PORTAL.id && (
                <>
                  <Grid item xs={6}>
                    Portal Exit Point ID
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth className="levelEditSelectRoot">
                      <InputLabel id="portal-exit-label">Portal Exit</InputLabel>
                      <Select
                        labelId="portal-exit-label"
                        id="portal-exit"
                        value={unitParams.meta.exitPortalId}
                        label="Portal Exit"
                        onChange={(e) => handlePortalExitPoint(e.target.value)}
                        classes={{
                          select: 'levelEditSelect',
                        }}
                      >
                        {portalExitPointsFiltered.map(({ top, left, exitPortalId }) => (
                          <MenuItem value={exitPortalId} key={exitPortalId}>
                            {top} | {left} | {exitPortalId}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              {unitParams.type === TELEPORT.id && (
                <>
                  <Grid item xs={6}>
                    Teleport Exit Point ID
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth className="levelEditSelectRoot">
                      <InputLabel id="teleport-exit-label">Teleport Exit</InputLabel>
                      <Select
                        labelId="teleport-exit-label"
                        id="teleport-exit"
                        value={unitParams.meta.exitTeleportId}
                        label="Teleport Exit"
                        onChange={(e) => handleTeleportExitPoint(e.target.value)}
                        classes={{
                          select: 'levelEditSelect',
                        }}
                      >
                        {teleportExitPointsFiltered.map(({ top, left, exitTeleportId }) => (
                          <MenuItem value={exitTeleportId} key={exitTeleportId}>
                            {top} | {left} | {exitTeleportId}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </>
          )}

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
                            onChange={(e) => handleTurretParamChange(turretIdx, parseFloat(e.target.value, 10), 'speed')}
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
                            onChange={(e) => handleTurretParamChange(turretIdx, parseFloat(e.target.value, 10), 'maxDistance')}
                            classes={{
                              root: 'levelEditInput',
                            }}
                          />
                        </Grid>
                        <Grid item xs={6} />
                        <Grid item xs={6}>
                          <Button
                            variant="outlined"
                            onClick={() => handleDeleteTurretClick(turretIdx)}
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
  unitTurrets: PropTypes.array.isRequired,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
  portalExitPoints: PropTypes.arrayOf(PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    exitPortalId: PropTypes.string,
  })),
  teleportExitPoints: PropTypes.arrayOf(PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    exitPortalId: PropTypes.string,
  })),
};

UnitEdit.defaultProps = {
  onApply: () => {},
  onClose: () => {},
  portalExitPoints: [],
  teleportExitPoints: [],
};
