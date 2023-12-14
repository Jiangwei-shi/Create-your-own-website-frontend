const localStorageMiddleware = (store) => (next) => (action) => {
  console.log('Middleware triggered:', action);
  const result = next(action);

  const nextState = store.getState();
  console.log('Next state:', nextState);
  const currentUser = nextState.currentUser;
  if (currentUser) {
    console.log('Updating localStorage with currentUser:', currentUser);
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }

  return result;
};
export default localStorageMiddleware;
