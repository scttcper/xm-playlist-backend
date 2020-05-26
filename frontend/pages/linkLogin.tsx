import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import { useRouter } from 'next/router';

const LinkLogin = () => {
  const router = useRouter();
  // Confirm the link is a sign-in with email link.
  useEffect(() => {
    if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = localStorage.getItem('emailForSignIn');
      // TODO: whatever this is security thing is
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt('Please provide your email for confirmation');
      }

      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        .signInWithEmailLink(email as string, window.location.href)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          router.push('/profile');
        })
        .catch(error => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  });

  return <div>Loading...</div>;
};

export default LinkLogin;
