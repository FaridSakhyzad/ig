import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { saveMap } from 'api/api';
import AmmoEdit from './AmmoEdit';

export default function LevelEditComponent({
  level: levelFromProps,
}) {
  const [level, setLevel] = useState(levelFromProps);

  const onAmmoChange = ({ target: { value } }, section, type) => {
    level[section][type] = parseInt(value, 10);
    setLevel({ ...level });
  };

  const saveCurrentMap = () => {
    saveMap(level);
  };

  const handleParamChange = (value, param) => {
    level[param] = value;
    setLevel({ ...level });
  };

  return (
    <Grid container spacing={2}>
      <Grid item>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Name"
              value={level.name}
              onChange={(e) => handleParamChange(e.target.value, 'name')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              size="small"
              label="Index"
              type="number"
              value={level.index}
              onChange={(e) => handleParamChange(e.target.value, 'index')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              label="Width"
              value={level.mapWidth}
              onChange={(e) => handleParamChange(e.target.value, 'mapWidth')}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              size="small"
              label="Height"
              value={level.mapHeight}
              onChange={(e) => handleParamChange(e.target.value, 'mapHeight')}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item>
        <Grid container spacing={1}>
          <Grid item xs={8}>
            Override User Ammo
            <Checkbox
              checked={level.overrideUserAmmo}
              onChange={(e, data) => handleParamChange(data, 'overrideUserAmmo')}
            />
          </Grid>
          <Grid item xs={8}>
            Create User Backup
            <Checkbox
              checked={level.createUserBackup}
              onChange={(e, data) => handleParamChange(data, 'createUserBackup')}
            />
          </Grid>
          <Grid item xs={8}>
            Restore UserAmmo
            <Checkbox
              checked={level.restoreUserAmmo}
              onChange={(e, data) => handleParamChange(data, 'restoreUserAmmo')}
            />
          </Grid>
        </Grid>
      </Grid>

      <AmmoEdit
        level={level}
        onAmmoChange={onAmmoChange}
      />

      <Grid item>
        <Button variant="contained" classes={{ root: 'mapList-newLevelButton' }} onClick={saveCurrentMap}>Save</Button>
      </Grid>
    </Grid>
  );
}

LevelEditComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  level: PropTypes.object.isRequired,
};

LevelEditComponent.defaultProps = {};
