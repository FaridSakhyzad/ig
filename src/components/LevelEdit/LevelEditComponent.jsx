import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import IconAdd from '@mui/icons-material/Add';
import IconDelete from '@mui/icons-material/Delete';

import AmmoEdit from './AmmoEdit';

import './levelEditComponent.scss';

export default function LevelEditComponent(props) {
  const {
    levelParams,
    onClose,
    onSave,
  } = props;

  const [level, setLevel] = useState(levelParams);

  const onAmmoChange = ({ target: { value } }, section, type) => {
    level[section][type] = parseInt(value, 10);
    setLevel({ ...level });
  };

  const handleApplyClick = () => {
    onSave(level);
    onClose();
  };

  const handleParamChange = (value, param) => {
    level[param] = value;
    setLevel({ ...level });
  };

  const [activeMiscTabIndex, setActiveMiscTabIndex] = useState(0);

  const onMiscTabChange = (e, activeTabIndex) => {
    setActiveMiscTabIndex(activeTabIndex);
  };

  const onRestrictionChange = (value, itemProperty) => {
    level.ammoRestrictions[itemProperty] = value;
    setLevel({ ...level });
  };

  const ammo = [
    { label: 'User Moves:', property: 'userMoves' },
    { label: 'Base Units:', property: 'defaults' },
    { label: 'Bobombs:', property: 'bobombs' },
    { label: 'Lasers:', property: 'lasers' },
    { label: 'Deflectors:', property: 'deflectors' },
    { label: 'Walls:', property: 'walls' },
    { label: 'Npc:', property: 'npc' },
    { label: 'Hidden:', property: 'hidden' },
    { label: 'Portals:', property: 'portals' },
    { label: 'Teleports:', property: 'teleports' },

    { label: 'Deletes:', property: 'deletes' },
    { label: 'Swaps:', property: 'swaps' },
    { label: 'Rotates:', property: 'rotates' },
    { label: 'Jumps:', property: 'jumps' },
  ];

  const ammoColumnsForRestrictions = [
    ammo.slice(1, 10),
    ammo.slice(10),
  ];

  const onComboSequenceChange = ({ target: { value } }, idx) => {
    level.comboSequence[idx] = parseInt(value, 10);
    setLevel({ ...level });
  };

  const addComboSequenceItem = () => {
    level.comboSequence.push(1);
    setLevel({ ...level });
  };

  const deleteComboSequenceItem = (idx) => {
    level.comboSequence.splice(idx, 1);
    setLevel({ ...level });
  };

  return (
    <div className="levelEdit">
      <div className="container">
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
                  onChange={(e) => handleParamChange(e.target.value ? parseInt(e.target.value, 10) : e.target.value, 'mapWidth')}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  size="small"
                  label="Height"
                  value={level.mapHeight}
                  onChange={(e) => handleParamChange(e.target.value ? parseInt(e.target.value, 10) : e.target.value, 'mapHeight')}
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

          <Grid item>
            <AmmoEdit
              level={level}
              onAmmoChange={onAmmoChange}
              ammo={ammo}
            />
          </Grid>

          <Grid item>
            <Grid container spacing={1} marginBottom={1}>
              <Grid item>
                <Tabs value={activeMiscTabIndex} onChange={onMiscTabChange} aria-label="basic tabs example">
                  <Tab label="Combo Sequence" id="ammo" />
                  <Tab label="Ammo restrictions" id="reward" />
                </Tabs>
              </Grid>
            </Grid>

            <Grid container spacing={1}>
              <Grid item xs={12}>
                {activeMiscTabIndex === 0 && (
                  <Grid container spacing={1} className="comboSequence">
                    {levelParams.comboSequence.map((item, idx) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <React.Fragment key={idx}>
                        <Grid item xs={8}>
                          <TextField
                            size="small"
                            type="number"
                            value={item}
                            onChange={(e) => onComboSequenceChange(e, idx)}
                            classes={{
                              root: 'comboSequence-input',
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Button
                            variant="outlined"
                            classes={{
                              root: 'comboSequence-addButton',
                            }}
                            onClick={() => deleteComboSequenceItem(idx)}
                          >
                            <IconDelete />
                          </Button>
                        </Grid>
                      </React.Fragment>
                    ))}
                    <Grid item xs={12}>
                      <Button
                        variant="outlined"
                        classes={{
                          root: 'comboSequence-addButton',
                        }}
                        onClick={addComboSequenceItem}
                      >
                        <IconAdd />
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {activeMiscTabIndex === 1 && (
                  <Grid container spacing={1}>
                    {ammoColumnsForRestrictions.map((column, index) => (
                      /* eslint-disable-next-line react/no-array-index-key */
                      <Grid item xs={6} key={index}>
                        <Grid container spacing={1}>
                          {column.map((item) => (
                            <Grid item xs={12} key={item.property}>
                              <Grid container spacing={1} alignItems="center">
                                <Grid item xs={8}>{item.label}</Grid>
                                <Grid item xs={4}>
                                  <Checkbox
                                    checked={levelParams.ammoRestrictions[item.property]}
                                    onChange={(e, data) => onRestrictionChange(data, item.property)}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <div className="levelEdit-footer">
        <div className="container">
          <Grid container spacing={1}>
            <Grid item>
              <Button variant="contained" classes={{ root: 'mapList-newLevelButton' }} onClick={handleApplyClick}>Apply</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={onClose}>Close</Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

LevelEditComponent.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  levelParams: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
};

LevelEditComponent.defaultProps = {
  onClose: () => {},
  onSave: () => {},
};
