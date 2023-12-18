import {createSlice} from '@reduxjs/toolkit';
import {
  deleteUserThunk,
  loginThunk, logoutThunk,
  registerThunk, updateUserThunk,
} from '../services/authorize-thunk';

const authorizeSlice = createSlice({
  name: 'authorize',
  initialState: {
    isMusicUploaded: false,
  },
  reducers: {
    resetMusicUploadState(state) {
      state.isMusicUploaded = false;
    },
  },
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
          console.error('Delete user failed:', action.error);
        })
        .addCase(updateUserThunk.fulfilled, (state, action) => {
          // eslint-disable-next-line max-len
          return {...state, ...action.payload, loading: false, isMusicUploaded: true};
        })
        .addCase(updateUserThunk.pending, (state) => {
          return {...state, loading: true};
        })
        .addCase(updateUserThunk.rejected, (state, action) => {
          return {...state, error: action.payload, loading: false};
        })
    ;
  },
});
export const {resetMusicUploadState} = authorizeSlice.actions;
export default authorizeSlice.reducer;
