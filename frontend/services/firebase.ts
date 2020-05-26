import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBSf-hIPK5-ev9ggIpzGiBWQUawsucGR9E',
  authDomain: 'xmplaylist-173819.firebaseapp.com',
} as const;

export const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(config);
