import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

export default function CellEdit(props) {
  const {
    cell,
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
        Cell ID: {cell.id}
        Cell Type: {cell.type}

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
