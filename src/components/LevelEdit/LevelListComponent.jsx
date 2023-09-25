import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import IconDelete from '@mui/icons-material/Delete';
import IconEdit from '@mui/icons-material/Edit';
import IconHeight from '@mui/icons-material/Height';
import Download from '@mui/icons-material/Download';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import IconClose from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import { readLevels } from '../../api/api';

export default function LevelListComponent({
  onLevelCreate,
  onLevelEdit,
  onLevelDelete,
  levelList,
  onLevelIndexChange,
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

  const handleLevelDragEnd = (data) => {
    const { source, destination } = data;

    if (!source || !destination) {
      return;
    }

    onLevelIndexChange(source.index, destination.index);
  };

  const [isChangeIndexModalOpen, setIsChangeIndexModalOpen] = useState(false);

  const [indexFrom, setIndexFrom] = useState(null);
  const [indexTo, setIndexTo] = useState(null);

  const handleChangeIndex = (from) => {
    setIndexFrom(from);
    setIsChangeIndexModalOpen(true);
  };

  const handleChangeIndexCancel = () => {
    setIndexFrom(null);
    setIndexTo(null);
    setIsChangeIndexModalOpen(false);
  };

  const handleIndexToChange = (e) => {
    setIndexTo(parseInt(e.target.value, 10));
  };

  const handleChangeIndexConfirm = () => {
    onLevelIndexChange(indexFrom, indexTo);
    setIndexFrom(null);
    setIndexTo(null);
    setIsChangeIndexModalOpen(false);
  };

  const getListItemStyle = (isDragging, draggableStyle) => ({
    boxShadow: isDragging ? '0 0 15px 0 rgba(0, 0, 0, 0.3)' : 'none',
    ...draggableStyle,
  });

  const handleDownloadClick = (idx) => {
    const level = readLevels()[idx];

    const blob = new Blob([JSON.stringify(level)], { type: 'text/json' });

    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = `${level.name ? `${level.name}_` : ''}${level.id}.json`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  };

  const handleDownloadAllClick = () => {
    const levels = readLevels();

    const blob = new Blob([JSON.stringify(levels)], { type: 'text/json' });

    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = `levels_${parseInt(Date.now(), 10)}.json`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
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

      <Modal
        open={isChangeIndexModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="modalAligner">
          <Paper
            elevation={1}
            className="confirmationModal"
          >
            <h4>Please Enter Level Index</h4>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <input type="number" value={indexTo} onChange={handleIndexToChange} />
              </Grid>
              <Grid item>
                <Button onClick={handleChangeIndexCancel}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleChangeIndexConfirm}>
                  Apply
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Modal>

      <DragDropContext
        onDragEnd={handleLevelDragEnd}
      >
        <Droppable droppableId="droppableList">
          {(provided) => (
            <List
              ref={provided.innerRef}
            >
              {levelList.map((mapItem, idx) => (
                <Draggable
                  key={mapItem.id}
                  draggableId={mapItem.id}
                  index={idx}
                >
                  {(liProvided, liSnapshot) => (
                    <ListItem
                      className="mapList-item"
                      draggable
                      ref={liProvided.innerRef}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...liProvided.draggableProps}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...liProvided.dragHandleProps}
                      style={getListItemStyle(
                        liSnapshot.isDragging,
                        liProvided.draggableProps.style,
                      )}
                    >
                      <div className="mapList-itemName">{mapItem.name || mapItem.id}</div>
                      <div className="mapList-itemControls">
                        <Button
                          type="button"
                          onClick={() => handleDownloadClick(idx)}
                          classes={{
                            root: 'mapList-itemControl',
                          }}
                        >
                          <Download />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleChangeIndex(idx)}
                          classes={{
                            root: 'mapList-itemControl',
                          }}
                        >
                          <IconHeight />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleDeleteMap(mapItem.id)}
                          classes={{
                            root: 'mapList-itemControl',
                          }}
                        >
                          <IconDelete />
                        </Button>
                        <Button
                          type="button"
                          onClick={() => handleEditMap(idx)}
                          classes={{
                            root: 'mapList-itemControl',
                          }}
                        >
                          <IconEdit />
                        </Button>
                      </div>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Grid container alignItems="center" justifyContent="center" spacing={1}>
        <Grid item>
          <Button
            variant="outlined"
            classes={{ root: 'mapList-newLevelButton' }}
            onClick={handleDownloadAllClick}
          >
            Download All
          </Button>
        </Grid>
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
  onLevelIndexChange: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  levelList: PropTypes.array,
};

LevelListComponent.defaultProps = {
  onLevelCreate: () => {},
  onLevelEdit: () => {},
  onLevelDelete: () => {},
  onLevelIndexChange: () => {},
  levelList: [],
};
