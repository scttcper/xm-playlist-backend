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
      const email = window.localStorage.getItem('emailForSignIn');
      // TODO: whatever this is security thing is
      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        // email = window.prompt('Please provide your email for confirmation');
        router.push('/login');
      }

      // The client SDK will parse the code from the link for you.
      firebase
        .auth()
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        .signInWithEmailLink(email as string, window.location.href)
        .then(result => {
          console.log({ result });
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
          if (result.additionalUserInfo?.isNewUser) {
            router.push('/newUser');
          } else {
            router.push('/profile');
          }
        })
        .catch(() => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Loading...</div>;
};

export default LinkLogin;
