import { useCallback } from 'react';
import firebase from 'firebase/app';
import { User as FirebaseUser } from 'firebase';
import axios from 'axios';
import { atom, useRecoilState } from 'recoil';
import { ga } from 'react-ga';

import { emailRedirectUrl, url } from '../url';
import { app } from './firebase';

const actionCodeSettings: firebase.auth.ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: `${emailRedirectUrl}/linkLogin`,
  handleCodeInApp: true,
};

export const userAtom = atom<FirebaseUser | null>({
  key: 'user',
  default: null,
  dangerouslyAllowMutability: true,
});
export const isSubscribedAtom = atom<boolean | null>({
  key: 'isSubscribed',
  default: null,
});
export const loadedExtraAtom = atom<boolean | null>({
  key: 'loadedExtra',
  default: null,
});

export const useUser = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const [loadedExtra, setLoadedExtra] = useRecoilState(loadedExtraAtom);
  const [isSubscribed, setIsSubscribed] = useRecoilState(isSubscribedAtom);

  const loadExtra = useCallback(
    async (user: FirebaseUser) => {
      try {
        const token: string = (await user?.getIdToken()) ?? '';
        const response = await axios.get(`${url}/api/user/${user?.uid}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
          timeout: 15 * 1000,
        });
        setIsSubscribed(response.data.isSubscribed);
      } catch (err) {
        // pass
      }
    },
    [setIsSubscribed],
  );

  return {
    user,
    isSubscribed,
    setUser: useCallback(
      (user: FirebaseUser | null) => {
        if (user) {
          setUser(user);
          loadExtra(user);
          ga('set', 'userId', user.uid);
        } else {
          setUser(null);
        }
      },
      [setUser, loadExtra],
    ),

    logout: useCallback(async () => {
      await app.auth().signOut();
      setUser(null);
      setLoadedExtra(false);
      setIsSubscribed(null);
    }, [setUser, setLoadedExtra, setIsSubscribed]),

    setSubscription: useCallback(
      async (isSubscribed: boolean) => {
        const token: string = (await user?.getIdToken()) ?? '';
        setIsSubscribed(isSubscribed);
        const body = { isSubscribed };
        await axios.post(`${url}/api/user/${user?.uid}`, body, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
      },
      [user, setIsSubscribed],
    ),

    signInWithLink: useCallback(
      async (email: string) => {
        window.localStorage.setItem('emailForSignIn', email);
        try {
          await app.auth().sendSignInLinkToEmail(email, actionCodeSettings);
        } catch (error) {
          setUser(null);
          throw error;
        }
      },
      [setUser],
    ),

    signInWithGoogle: useCallback(async () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().useDeviceLanguage();
      const result = await firebase.auth().signInWithPopup(provider);
      setUser(result.user);
      return result;
    }, [setUser]),

    signInWithTwitter: useCallback(async () => {
      const provider = new firebase.auth.TwitterAuthProvider();
      firebase.auth().useDeviceLanguage();
      const result = await firebase.auth().signInWithPopup(provider);
      setUser(result.user);
      return result;
    }, [setUser]),
  };
};
