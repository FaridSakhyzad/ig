export const getSettings = () => {
  const storedSettingsData = localStorage.getItem('settings') || '{}';

  return JSON.parse(storedSettingsData);
};

export const saveSettings = (data) => {
  const storedData = getSettings();

  localStorage.setItem('settings', JSON.stringify({
    ...storedData,
    ...data,
  }));
};
