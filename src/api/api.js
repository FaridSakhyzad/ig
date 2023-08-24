export const readMaps = () => JSON.parse(localStorage.getItem('maps'));

export const writeMaps = (data) => {
  localStorage.setItem('maps', JSON.stringify(data));
};

export const saveMap = (map) => {
  const savedMaps = JSON.parse(localStorage.getItem('maps'));

  const mapIndex = savedMaps.findIndex((savedMap) => savedMap.id === map.id);

  savedMaps[mapIndex] = map;

  writeMaps(savedMaps);
};
