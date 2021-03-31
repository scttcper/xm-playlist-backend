import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type firebase from 'firebase/app';
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

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: state => {
      // todo figure out calling rootReducer with undefined
      state.user = initialState.user;
      state.isSubscribed = initialState.isSubscribed;
      state.loadedExtra = initialState.loadedExtra;
    },
    toggleSubscription: state => {
      state.isSubscribed = !state.isSubscribed;
    },
  },
});

export const { login, logout, toggleSubscription } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.user;
export const selectIsSubscribed = (state: RootState) => state.user.isSubscribed;

export default userSlice.reducer;
