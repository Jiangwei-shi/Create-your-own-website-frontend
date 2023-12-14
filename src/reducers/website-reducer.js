import {createSlice} from '@reduxjs/toolkit';
import {
  findUserByIdThunk,
} from '../services/website-thunk';

const websiteSlice = createSlice({
  name: 'userById',
  initialState: {user: null, loading: false},
  reducers: {},
  extraReducers: (builder) => {
    builder
        .addCase(findUserByIdThunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(findUserByIdThunk.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload; // 更新 state.user
        })
        .addCase(findUserByIdThunk.rejected, (state, action) => {
          state.loading = false;
          console.error('find user by id failed:', action.error);
        });
  },
});

export default websiteSlice.reducer;

