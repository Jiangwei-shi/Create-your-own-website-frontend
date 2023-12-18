const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  const nextState = store.getState();
  const currentUser = nextState.currentUser;
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  return result;
};
export default localStorageMiddleware;
