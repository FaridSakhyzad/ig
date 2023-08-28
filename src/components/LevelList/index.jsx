import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { setCurrentScreen } from 'redux/ui/actions';
import { readMaps, writeMaps } from 'api/api';
import { SCREEN_MODES } from 'constants/constants';

import Button from '@mui/material/Button';
import LevelListComponent from './LevelListComponent';
import LevelEditComponent from './LevelEditComponent';

import 'mapList.css';

export default function LevelList() {
  const [currentMap, setCurrentMap] = useState(null);
  const [maps, setMaps] = useState(readMaps() || []);

  const dispatch = useDispatch();

  const defaults = {
    name: '',
    index: 0,
    mapWidth: 9,
    mapHeight: 9,
    comboSequence: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
    reward: {
      userMoves: 1,

      defaults: 1,
      bobombs: 1,
      lasers: 1,
      deflectors: 0,
      walls: 0,
      npc: 0,
      hidden: 0,
      portals: 0,
      teleports: 0,

      swaps: 0,
      rotates: 0,
      jumps: 0,
      deletes: 0,
    },
    penalty: {
      userMoves: 0,

      defaults: 0,
      bobombs: 0,
      lasers: 0,
      deflectors: 0,
      walls: 0,
      npc: 0,
      hidden: 0,
      portals: 0,
      teleports: 0,

      swaps: 0,
      rotates: 0,
      jumps: 0,
      deletes: 0,
    },
    overrideUserAmmo: false,
    createUserBackup: false,
    restoreUserAmmo: false,
    ammo: {},
    ammoRestrictions: {},
    grid: null,
    units: [],
  };

  const createMap = () => {
    const savedMaps = readMaps() || [];

    const newMap = structuredClone({
      id: Math.random().toString(16).substring(2),
      ...defaults,
    });

    savedMaps.push(newMap);

    writeMaps(savedMaps);
    setMaps(savedMaps);
  };

  const deleteMap = (mapIndex) => {
    const savedMaps = readMaps() || [];

    savedMaps.splice(mapIndex, 1);

    writeMaps(savedMaps);
    setMaps(savedMaps);
  };

  const handleBackToMenu = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  };

  return (
    <>
      <Button
        type="button"
        className="button"
        onClick={handleBackToMenu}
      >
        Back To Menu
      </Button>

      <LevelListComponent
        mapsList={maps}
        onLevelCreate={createMap}
        onLevelEdit={(mapIndex) => setCurrentMap(maps[mapIndex])}
        onLevelDelete={deleteMap}
      />

      {currentMap && (
        <div className="container">
          <LevelEditComponent level={currentMap} />
        </div>
      )}
    </>
  );
}
