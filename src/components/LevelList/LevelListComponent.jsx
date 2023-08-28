import React, { useState } from 'react';
import PropTypes from 'prop-types';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import IconClose from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';

export default function LevelListComponent({
  onLevelCreate,
  onLevelEdit,
  onLevelDelete,
  mapsList,
}) {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [mapIndexToDelete, setIndexMapToDelete] = useState(null);

  const handleDeleteMap = (mapIndex) => {
    setIsConfirmDeleteModalOpen(true);
    setIndexMapToDelete(mapIndex);
  };

  const handleEditMap = (mapIndex) => {
    onLevelEdit(mapIndex);
  };

  const handleNewLevelClick = () => {
    onLevelCreate();
  };

  const handleDeletionConfirm = () => {
    setIsConfirmDeleteModalOpen(false);
    onLevelDelete(mapIndexToDelete);
  };

  const handleDeletionCancel = () => {
    setIsConfirmDeleteModalOpen(false);
    setIndexMapToDelete(null);
  };

  return (
    <>
      <Modal
        open={isConfirmDeleteModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modalAligner">
          <Paper
            elevation={1}
            className="confirmationModal"
          >
            <IconButton
              aria-label="delete"
              classes={{
                root: 'modalClose',
              }}
              onClick={() => setIsConfirmDeleteModalOpen(false)}
            >
              <IconClose />
            </IconButton>
            <div>
              <h4>Delete Map?</h4>
              <Grid container spacing={2}>
                <Grid item>
                  <Button onClick={handleDeletionCancel}>
                    Cancel
                  </Button>
                </Grid>
                <Grid item>
                  <Button onClick={handleDeletionConfirm}>
                    Delete
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Paper>
        </div>
      </Modal>

      <List>
        {mapsList.map((mapItem, idx) => (
          <ListItem
            key={mapItem.id}
            className="mapList-item"
          >
            <div className="mapList-itemName">{mapItem.name || mapItem.id}</div>
            <div className="mapList-itemControls">
              <Button
                type="button"
                className="button"
                onClick={() => handleDeleteMap(idx)}
              >
                <IconDelete />
              </Button>
              <Button onClick={() => handleEditMap(idx)}>
                <IconEdit />
              </Button>
            </div>
          </ListItem>
        ))}
      </List>

      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <Button
            variant="contained"
            classes={{ root: 'mapList-newLevelButton' }}
            onClick={handleNewLevelClick}
          >
            New Level
          </Button>
        </Grid>
      </Grid>
    </>
  );
}

LevelListComponent.propTypes = {
  onLevelCreate: PropTypes.func,
  onLevelEdit: PropTypes.func,
  onLevelDelete: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  mapsList: PropTypes.array,
};

LevelListComponent.defaultProps = {
  onLevelCreate: () => {},
  onLevelEdit: () => {},
  onLevelDelete: () => {},
  mapsList: [],
};
