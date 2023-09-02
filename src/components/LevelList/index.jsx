import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';

import { setCurrentScreen } from 'redux/ui/actions';
import {
  createLevel,
  readLevels,
  updateLevel,
  deleteLevel,
  saveLevelsSequence,
} from 'api/api';
import { SCREEN_MODES } from 'constants/constants';

import Button from '@mui/material/Button';
import LevelListComponent from './LevelListComponent';
import LevelEditComponent from './LevelEditComponent';

import 'mapList.css';

export default function LevelList() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [levels, setLevels] = useState(readLevels() || []);

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

  const onCreateNewLevel = () => {
    createLevel(structuredClone({
      id: Math.random().toString(16).substring(2),
      ...defaults,
    }));

    setLevels(readLevels());
  };

  const onDeleteLevel = (levelId) => {
    deleteLevel(levelId);
    setLevels(readLevels());
  };

  const onSaveLevel = (levelData) => {
    updateLevel(levelData);
    setCurrentLevel(null);

    setLevels(readLevels());
  };

  const handleBackToMenu = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  };

  const updateLevelIndex = (from, to) => {
    if (from === to) {
      return;
    }

    let result = [];

    if (from < to) {
      const part1 = levels.slice(0, from);
      const part2 = levels.slice(from + 1, to + 1);
      const part3 = levels.slice(to + 1);

      result = [
        ...part1,
        ...part2,
        levels[from],
        ...part3,
      ];
    }

    if (from > to) {
      const part1 = levels.slice(0, to);
      const part2 = levels.slice(to, from);
      const part3 = levels.slice(from + 1);

      result = [
        ...part1,
        levels[from],
        ...part2,
        ...part3,
      ];
    }

    setLevels(result);
    saveLevelsSequence(result);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="center" padding={1}>
        <Grid item>
          <Button
            type="button"
            className="button"
            variant="outlined"
            onClick={handleBackToMenu}
          >
            Back To Menu
          </Button>
        </Grid>
      </Grid>

      <LevelListComponent
        levelList={levels}
        onLevelCreate={onCreateNewLevel}
        onLevelEdit={(levelIndex) => setCurrentLevel(levels[levelIndex])}
        onLevelDelete={onDeleteLevel}
        onLevelIndexChange={updateLevelIndex}
      />

      {currentLevel && (
        <div className="container">
          <LevelEditComponent
            levelParams={currentLevel}
            onClose={() => { setCurrentLevel(null); }}
            onSave={onSaveLevel}
          />
        </div>
      )}
    </>
  );
}
