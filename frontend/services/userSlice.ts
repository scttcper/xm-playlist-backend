import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import type firebase from 'firebase/app';

import { url } from '../url';
import type { RootState } from './store';

type User = Pick<firebase.User, 'displayName' | 'email' | 'photoURL' | 'uid'>;
interface UserState {
  user?: User | null;
  isSubscribed: boolean;
  loadedExtra: boolean;
}

const initialState: UserState = {
  user: undefined,
  isSubscribed: false,
  loadedExtra: false,
};

export function extractUser(user: firebase.User): User {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };
}

export const fetchUserExtra = createAsyncThunk(
  'user/loadUserData',
  async (user: firebase.User, _thunkAPI) => {
    const token: string = (await user?.getIdToken()) ?? '';
    const response = await axios.get<{ isSubscribed: boolean }>(`${url}/api/user/${user?.uid}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
      timeout: 15 * 1000,
    });
    return response.data;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.user = null;
      state.isSubscribed = initialState.isSubscribed;
      state.loadedExtra = initialState.loadedExtra;
    },
    toggleSubscription: state => {
      state.isSubscribed = !state.isSubscribed;
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchUserExtra.fulfilled, (state, action) => {
      state.isSubscribed = action.payload.isSubscribed;
    });
  },
});

export const { login, logout, toggleSubscription } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;
export const selectIsSubscribed = (state: RootState) => state.user.isSubscribed;

export default userSlice.reducer;
