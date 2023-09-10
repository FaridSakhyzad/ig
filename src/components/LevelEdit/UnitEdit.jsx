import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function UnitEdit(props) {
  const {
    unit,
    onApply,
    onClose,
  } = props;

  const handleApplyClick = () => {
    onApply();
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="levelEdit">
      <div>
        Unit ID: {unit.id}

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

UnitEdit.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  unit: PropTypes.object.isRequired,
  onApply: PropTypes.func,
  onClose: PropTypes.func,
};

UnitEdit.defaultProps = {
  onApply: () => {},
  onClose: () => {},
};
