import firebase from 'firebase/app';
import 'firebase/auth';
import { emailRedirectUrl } from '../url';

const config = {
  apiKey: 'AIzaSyBSf-hIPK5-ev9ggIpzGiBWQUawsucGR9E',
  authDomain: 'xmplaylist-173819.firebaseapp.com',
} as const;

export const actionCodeSettings: firebase.auth.ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: `${emailRedirectUrl}/linkLogin`,
  handleCodeInApp: true,
};

export const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
