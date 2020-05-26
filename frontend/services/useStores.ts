import React from 'react';
import { storesContext } from './stores';

export const useStores = () => React.useContext(storesContext);
