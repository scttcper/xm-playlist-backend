/* eslint-disable @typescript-eslint/member-ordering */
import firebase from 'firebase/app';
import { User as FirebaseUser } from 'firebase';
import { observable, action, runInAction } from 'mobx';

import { emailRedirectUrl } from '../url';
import { app } from './firebase';

const actionCodeSettings: firebase.auth.ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: `${emailRedirectUrl}/linkLogin`,
  handleCodeInApp: true,
};

export class User {
  id = 'user';
  @observable user: FirebaseUser | null = null;

  @action
  setUser(user: FirebaseUser | null) {
    this.user = user;
  }

  @action
  async signUp(email: string) {
    localStorage.setItem('emailForSignIn', email);
    try {
      await app.auth().sendSignInLinkToEmail(email, actionCodeSettings);
    } catch {
      runInAction(() => {
        this.user = null;
      });
    }
  }

  @action
  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    const { user } = await firebase.auth().signInWithPopup(provider);
    runInAction(() => {
      this.user = user;
    });
  }

  @action
  async signInWithTwitter() {
    console.log('hello')
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().useDeviceLanguage();
    const { user } = await firebase.auth().signInWithPopup(provider);
    runInAction(() => {
      this.user = user;
    });
  }

  @action
  async logout() {
    try {
      await app.auth().signOut();
    } catch {
      // pass
    }

    runInAction(() => {
      this.user = null;
    });
  }
}
