/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/restrict-template-expressions */
import firebase from 'firebase/app';
import { User as FirebaseUser } from 'firebase';
import { observable, action, runInAction } from 'mobx';
import axios from 'axios';

import { emailRedirectUrl, url } from '../url';
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
  @observable isSubscribed: boolean | null = null;
  @observable loggedIn: boolean | null = null;
  @observable loadedExtra: boolean | null = null;

  @action.bound
  setUser(user: FirebaseUser | null) {
    if (user) {
      this.user = user;
      this.loggedIn = true;
      this.loadExtra();
    } else {
      this.loggedIn = false;
    }
  }

  @action.bound
  setExtra(extra: any) {
    this.loadedExtra = true;
    this.isSubscribed = extra.isSubscribed;
  }

  @action
  async loadExtra(): Promise<void> {
    if (!this.loggedIn || this.loadedExtra !== null) {
      return;
    }

    try {
      const token: string = (await this.user?.getIdToken()) ?? '';
      const response = await axios.get(`${url}/api/user/${this.user?.uid}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
        timeout: 15 * 1000,
      });
      this.setExtra(response.data);
    } catch {
      // pass
    }
  }

  @action.bound
  async setIsSubscribed(isSubscribed: boolean): Promise<void> {
    const token: string = (await this.user?.getIdToken()) ?? '';
    this.isSubscribed = isSubscribed;
    const body = { isSubscribed };
    await axios.post(`${url}/api/user/${this.user?.uid}`, body, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
  }

  @action
  async signInWithLink(email: string) {
    window.localStorage.setItem('emailForSignIn', email);
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
    const result = await firebase.auth().signInWithPopup(provider);
    this.setUser(result.user);
    return result;
  }

  @action
  async signInWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().useDeviceLanguage();
    const result = await firebase.auth().signInWithPopup(provider);
    this.setUser(result.user);
    return result;
  }

  @action.bound
  async logout() {
    try {
      await app.auth().signOut();
      this.loadedExtra = false;
      this.isSubscribed = null;
    } catch {
      // pass
    }

    runInAction(() => {
      this.user = null;
      this.loggedIn = false;
    });
  }
}
