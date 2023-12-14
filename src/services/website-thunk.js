import {createAsyncThunk} from '@reduxjs/toolkit';
import * as websiteService from './website-service';

export const findUserByIdThunk = createAsyncThunk('users/findUserById',
    async (user) => {
      try {
        return await websiteService.findUserById(user);
      } catch (error) {
        throw error;
      }
    });

