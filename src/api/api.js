export const readMaps = () => JSON.parse(localStorage.getItem('maps'));

export const writeMaps = (data) => {
  localStorage.setItem('maps', JSON.stringify(data));
};
