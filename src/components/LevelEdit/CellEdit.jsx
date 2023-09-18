import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { CELL_TYPES } from '../../constants/cells';

export default function CellEdit(props) {
  const {
    cell,
    onApply,
    onClose,
  } = props;

  const [cellParams, setCellParams] = useState(cell);

  const handleApplyClick = () => {
    onApply();
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };

  const handleCellTypeChange = (type) => {
    cellParams.type = type;

    setCellParams({ ...cellParams });
  };

  return (
    <div className="levelEdit">
      <div className="container">
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>Cell ID:</Grid>
          <Grid item xs={6}>{cellParams.id}</Grid>

          <Grid item xs={6}>Cell Type:</Grid>
          <Grid item xs={6}>
            <FormControl fullWidth className="levelEditSelectRoot">
              <InputLabel id="cell-type-label">Portal Exit</InputLabel>
              <Select
                labelId="cell-type-label"
                id="cell-type"
                value={cellParams.type}
                label="Cell Type"
                onChange={(e) => handleCellTypeChange(e.target.value)}
                classes={{
                  select: 'levelEditSelect',
                }}
              >
                {CELL_TYPES.map((cellType) => (
                  <MenuItem value={cellType} key={cellType}>
                    {cellType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <hr />
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

CellEdit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  cell: PropTypes.object.isRequired,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
};

CellEdit.defaultProps = {
  onApply: () => {},
  onClose: () => {},
};
