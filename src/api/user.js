export const getUserProfile = () => {
  const storedUserData = localStorage.getItem('user') || '{}';

  return JSON.parse(storedUserData);
};

export const saveUserProgress = (data) => {
  const storedData = getUserProfile();

  localStorage.setItem('user', JSON.stringify({
    ...storedData,
    ...data,
  }));
};
