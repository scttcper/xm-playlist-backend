import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isSignInWithEmailLink, signInWithEmailLink, getAdditionalUserInfo } from 'firebase/auth';

import { auth } from 'services/firebase';

const LinkLogin = () => {
  const router = useRouter();
  // Confirm the link is a sign-in with email link.
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
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
      signInWithEmailLink(auth, `${email}`, window.location.href).then(userCredential => {
        // Clear email from storage.
        window.localStorage.removeItem('emailForSignIn');

        if (getAdditionalUserInfo(userCredential)?.isNewUser) {
          router.push('/newUser');
        } else {
          router.push('/profile');
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>Loading...</div>;
};

export default LinkLogin;
