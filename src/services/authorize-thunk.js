import {createAsyncThunk} from '@reduxjs/toolkit';
import * as userService from './authorize-service';

export const registerThunk = createAsyncThunk('users/register',
    async (user) => {
      try {
        return await userService.registerUser(user);
      } catch (error) {
        throw error;
      }
    });

export const loginThunk = createAsyncThunk('users/login',
    async (credentials, thunkAPI) => {
      try {
        const loggedInUser = await userService.loginUser(credentials);
        return loggedInUser;
      } catch (error) {
      // You can dispatch an error action here,
      // or reject the promise with error message
        const errorMessage =
          error.response ? error.response.data : error.message;
        return thunkAPI.rejectWithValue(errorMessage);
      }
    });

export const logoutThunk = createAsyncThunk('users/logout', async () => {
  await userService.logout();
});

export const deleteUserThunk = createAsyncThunk('users/deleteUser',
    async (userId) => {
      await userService.deleteUser(userId);
      return userId;
    },
);

export const updateUserThunk = createAsyncThunk('users/updateUser',
    async ({uid, userData}, thunkAPI) => {
      try {
        return await userService.updateUser(uid, userData);
      } catch (error) {
      // Handle the error state
        const errorMessage =
        error.response ? error.response.data : error.message;
        return thunkAPI.rejectWithValue(errorMessage);
      }
    },
);
