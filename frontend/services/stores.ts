import React from 'react';
import { User } from './user';

export const storesContext = React.createContext({
  user: new User(),
});
