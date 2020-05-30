import firebaseAdmin from 'firebase-admin';

import config from '../config';

export const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(config.cert),
});
