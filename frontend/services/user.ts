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
  @observable loggedIn: boolean | null = null;

  @action.bound
  setUser(user: FirebaseUser | null) {
    console.log({ user });
    if (user) {
      this.user = user;
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }

  @action
  async signInWithLink(email: string) {
    localStorage.setItem('emailForSignIn', email);
    try {
      await app.auth().sendSignInLinkToEmail(email, actionCodeSettings);
    } catch (error) {
      runInAction(() => {
        this.user = null;
        this.loggedIn = false;
      });
      throw error;
    }
  }

  @action
  async signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();
    const { user } = await firebase.auth().signInWithPopup(provider);
    this.setUser(user);
  }

  @action
  async signInWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().useDeviceLanguage();
    const { user } = await firebase.auth().signInWithPopup(provider);
    this.setUser(user);
  }

  @action.bound
  async logout() {
    try {
      await app.auth().signOut();
    } catch {
      // pass
    }

    runInAction(() => {
      this.user = null;
      this.loggedIn = false;
    });
  }
}
