import { getApps, initializeApp } from 'firebase/app';
import { getAuth, ActionCodeSettings } from 'firebase/auth';
import { emailRedirectUrl } from '../url';

export const actionCodeSettings: ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: `${emailRedirectUrl}/linkLogin`,
  handleCodeInApp: true,
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp(
      {
        apiKey: 'AIzaSyBSf-hIPK5-ev9ggIpzGiBWQUawsucGR9E',
        authDomain: 'xmplaylist-173819.firebaseapp.com',
      },
      'xmplaylist',
    );

export const auth = getAuth(app);
