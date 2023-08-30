import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';

export default function AmmoEdit(props) {
  const { level, onAmmoChange } = props;

  const columns = [
    [
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
    ],
    [
      { label: 'Deletes:', property: 'deletes' },
      { label: 'Swaps:', property: 'swaps' },
      { label: 'Rotates:', property: 'rotates' },
      { label: 'Jumps:', property: 'jumps' },
    ],
  ];

  const [activeAmmoTabIndex, setActiveAmmoTabIndex] = useState(0);

  const section = ['ammo', 'reward', 'penalty'][activeAmmoTabIndex];

  const onAmmoTabChange = (e, newValue) => {
    setActiveAmmoTabIndex(newValue);
  };

  return (
    <>
      <Grid item>
        <Tabs value={activeAmmoTabIndex} onChange={onAmmoTabChange} aria-label="basic tabs example">
          <Tab label="Ammo" id="ammo" />
          <Tab label="Reward" id="reward" />
          <Tab label="Penalty" id="penalty" />
        </Tabs>
      </Grid>

      <Grid item>
        <Grid container spacing={1}>
          {columns.map((column, index) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <Grid item xs={6} key={index}>
              <Grid container spacing={1}>
                {column.map((item) => (
                  <Grid item xs={12} key={item.property}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={8}>{item.label}</Grid>
                      <Grid item xs={4}>
                        <TextField
                          size="small"
                          type="number"
                          value={level[section][item.property]}
                          onChange={(e) => onAmmoChange(e, section, item.property)}
                          classes={{
                            root: 'ammoEditInput',
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

AmmoEdit.propTypes = {
  level: PropTypes.shape({
    ammo: PropTypes.shape({
      userMoves: PropTypes.number,
      defaults: PropTypes.number,
      bobombs: PropTypes.number,
      lasers: PropTypes.number,
      deflectors: PropTypes.number,
      walls: PropTypes.number,
      npc: PropTypes.number,
      hidden: PropTypes.number,
      portals: PropTypes.number,
      teleports: PropTypes.number,
      deletes: PropTypes.number,
      swaps: PropTypes.number,
      rotates: PropTypes.number,
      jumps: PropTypes.number,
    }),
  }).isRequired,
  onAmmoChange: PropTypes.func,
};

AmmoEdit.defaultProps = {
  onAmmoChange: () => {},
};
