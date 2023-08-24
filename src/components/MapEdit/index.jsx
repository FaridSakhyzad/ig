import React, { useState } from 'react';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';

import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

import IconButton from '@mui/material/IconButton';
import IconClose from '@mui/icons-material/Close';
import IconEdit from '@mui/icons-material/Edit';
import IconDelete from '@mui/icons-material/Delete';

import { readMaps, saveMap, writeMaps } from 'api/api';
import { Map } from 'maps/maps';

import AmmoEdit from './AmmoEdit';

import 'mapList.css';

export default function MapEdit() {
  const [maps, setMaps] = useState(readMaps() || []);
  const [currentMap, setCurrentMap] = useState(null);

  const createMap = () => {
    const savedMaps = readMaps() || [];

    const newMap = new Map({
      name: `New Map #${savedMaps.length + 1}`,
      ammo: {
        userMoves: 10,
        defaults: 1,
        bobombs: 2,
        lasers: 3,
      },
    });

    savedMaps.push(newMap);

    writeMaps(savedMaps);
    setMaps(savedMaps);
  };

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [mapIndexToDelete, setIndexMapToDelete] = useState(null);

  const deleteMap = (mapIndex) => {
    const savedMaps = readMaps() || [];

    savedMaps.splice(mapIndex, 1);

    writeMaps(savedMaps);
    setMaps(savedMaps);
  };

  const handleDeleteMap = (mapIndex) => {
    setIsConfirmDeleteModalOpen(true);
    setIndexMapToDelete(mapIndex);
  };

  const handleEditMap = (mapIndex) => {
    setCurrentMap(maps[mapIndex]);
  };

  const handleDeletionConfirm = () => {
    setIsConfirmDeleteModalOpen(false);
    deleteMap(mapIndexToDelete);
  };

  const handleDeletionCancel = () => {
    setIsConfirmDeleteModalOpen(false);
    setIndexMapToDelete(null);
  };

  const onAmmoChange = ({ target: { value } }, type) => {
    currentMap.ammo[type] = parseInt(value, 10);
    setCurrentMap({ ...currentMap });
  };

  const saveCurrentMap = () => {
    saveMap(currentMap);
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
        {maps.map((mapItem, idx) => (
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
          <Button variant="contained" classes={{ root: 'mapList-newLevelButton' }} onClick={createMap}>New Level</Button>
        </Grid>
      </Grid>

      <hr />

      {currentMap && (
        <div className="container">
          <Grid container spacing={2}>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField size="small" label="Name" value={currentMap.name} />
                </Grid>
                <Grid item xs={12}>
                  <TextField size="small" label="Index" type="number" value={0} />
                </Grid>
                <Grid item xs={6}>
                  <TextField size="small" label="Width" value={currentMap.mapWidth} />
                </Grid>
                <Grid item xs={6}>
                  <TextField size="small" label="Height" value={currentMap.mapHeight} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  Override User Ammo <Checkbox value={currentMap.overrideUserAmmo} />
                </Grid>
                <Grid item xs={8}>
                  Create User Backup <Checkbox value={currentMap.createUserBackup} />
                </Grid>
                <Grid item xs={8}>
                  Restore UserAmmo <Checkbox value={currentMap.restoreUserAmmo} />
                </Grid>
              </Grid>
            </Grid>

            <AmmoEdit
              currentMap={currentMap}
              onAmmoChange={onAmmoChange}
            />

            <Grid item>
              <Button variant="contained" classes={{ root: 'mapList-newLevelButton' }} onClick={saveCurrentMap}>Save</Button>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}
