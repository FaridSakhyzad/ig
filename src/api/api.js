export const readLevels = () => {
  const savedLevels = JSON.parse(localStorage.getItem('levels')) || {};
  const savedLevelsSequence = JSON.parse(localStorage.getItem('levels_sequence')) || [];

  const levels = [];

  savedLevelsSequence.forEach((levelSequenceItem, idx) => {
    levels[idx] = savedLevels[levelSequenceItem];
  });

  return levels;
};

export const writeMaps = (data) => {
  localStorage.setItem('maps', JSON.stringify(data));
};

export const createLevel = (levelData) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels')) || {};
  const savedLevelsSequence = JSON.parse(localStorage.getItem('levels_sequence')) || [];

  savedLevels[levelData.id] = levelData;

  savedLevelsSequence.push(levelData.id);

  localStorage.setItem('levels', JSON.stringify(savedLevels));
  localStorage.setItem('levels_sequence', JSON.stringify(savedLevelsSequence));
};

export const deleteLevel = (levelId) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels')) || {};
  const savedLevelsSequence = JSON.parse(localStorage.getItem('levels_sequence')) || [];

  delete savedLevels[levelId];

  const levelIndex = savedLevelsSequence
    .findIndex((levelsSequenceItem) => levelsSequenceItem === levelId);

  savedLevelsSequence.splice(levelIndex, 1);

  localStorage.setItem('levels', JSON.stringify(savedLevels));
  localStorage.setItem('levels_sequence', JSON.stringify(savedLevelsSequence));
};

export const updateLevel = (levelData) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels')) || {};
  savedLevels[levelData.id] = levelData;
  localStorage.setItem('levels', JSON.stringify(savedLevels));
};
