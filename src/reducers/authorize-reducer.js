import {createSlice} from '@reduxjs/toolkit';
import {
  deleteUserThunk,
  loginThunk, logoutThunk,
  registerThunk, updateUserThunk,
} from '../services/authorize-thunk';

const authorizeSlice = createSlice({
  name: 'authorize',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(loginThunk.fulfilled, (state, action) => {
          return action.payload;
        })
        .addCase(loginThunk.rejected, (state, action) => {
          return {error: action.payload};
        })
        .addCase(logoutThunk.fulfilled, (state) => {
          return null;
        })
        .addCase(registerThunk.fulfilled, (state, {payload}) => {
        })
        .addCase(registerThunk.rejected, (state, {payload}) => {
          return null;
        })
        .addCase(deleteUserThunk.fulfilled, (state) => {
          return null;
        })
        .addCase(deleteUserThunk.rejected, (state, action) => {
        // Handle error here
          console.error('Delete user failed:', action.error);
        })
        .addCase(updateUserThunk.fulfilled, (state, action) => {
          // Update the state with the new user data
          // Assuming the payload contains the updated user information
          return action.payload;
        })
        .addCase(updateUserThunk.rejected, (state, action) => {
        // Optionally update state to indicate error
          return {...state, error: action.payload};
        })
    ;
  },
});

export default authorizeSlice.reducer;
