export const readLevels = () => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};
  const savedLevelsSequence = JSON.parse(localStorage.getItem('levels_sequence') || '[]') || [];

  if (!savedLevelsSequence.length) {
    Object.keys(savedLevels).forEach((key) => {
      savedLevelsSequence.push(key);
    });
  }

  const levels = [];

  savedLevelsSequence.forEach((levelSequenceItem, idx) => {
    levels[idx] = savedLevels[levelSequenceItem];
  });

  return levels;
};

export const createLevel = (levelData) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};
  const savedLevelsSequence = JSON.parse(localStorage.getItem('levels_sequence') || '[]') || [];

  savedLevels[levelData.id] = levelData;

  savedLevelsSequence.push(levelData.id);

  localStorage.setItem('levels', JSON.stringify(savedLevels));
  localStorage.setItem('levels_sequence', JSON.stringify(savedLevelsSequence));
};

export const deleteLevel = (levelId) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};
  const savedLevelsSequence = JSON.parse(localStorage.getItem('levels_sequence') || '[]') || [];

  delete savedLevels[levelId];

  const levelIndex = savedLevelsSequence
    .findIndex((levelsSequenceItem) => levelsSequenceItem === levelId);

  savedLevelsSequence.splice(levelIndex, 1);

  localStorage.setItem('levels', JSON.stringify(savedLevels));
  localStorage.setItem('levels_sequence', JSON.stringify(savedLevelsSequence));
};

export const updateLevel = (levelData) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};

  savedLevels[levelData.id] = levelData;
  localStorage.setItem('levels', JSON.stringify(savedLevels));
};

export const saveLevelsSequence = (levelsData) => {
  const newSequence = [];

  const levels = {};

  levelsData.forEach((level, idx) => {
    const { id } = level;
    newSequence[idx] = id;

    // eslint-disable-next-line no-param-reassign
    level.index = idx;
    levels[id] = level;
  });

  localStorage.setItem('levels', JSON.stringify(levels));
  localStorage.setItem('levels_sequence', JSON.stringify(newSequence));
};
