export const readLevels = () => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};

  let levels = [];

  Object.keys(savedLevels).forEach((key) => {
    const level = savedLevels[key];

    if (!levels[level.index]) {
      levels[level.index] = level;
    } else {
      levels.push(level);
    }
  });

  levels = levels.filter(Boolean);

  // eslint-disable-next-line no-param-reassign
  levels.forEach((level, idx) => { level.index = idx; });

  return levels;
};

export const createLevel = (levelData) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};

  savedLevels[levelData.id] = levelData;

  localStorage.setItem('levels', JSON.stringify(savedLevels));
};

export const deleteLevel = (levelId) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};

  delete savedLevels[levelId];

  localStorage.setItem('levels', JSON.stringify(savedLevels));
};

export const updateLevel = (levelData) => {
  const savedLevels = JSON.parse(localStorage.getItem('levels') || '{}') || {};

  savedLevels[levelData.id] = levelData;
  localStorage.setItem('levels', JSON.stringify(savedLevels));
};

export const saveLevels = (levelsArray) => {
  const result = {};

  levelsArray.forEach((level, idx) => {
    result[level.id] = {
      ...level,
      index: idx,
    };
  });

  localStorage.setItem('levels', JSON.stringify(result));
};
