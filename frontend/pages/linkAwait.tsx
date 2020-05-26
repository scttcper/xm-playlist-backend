import React from 'react';

const LinkAwait = () => {
  const email = localStorage.getItem('emailForSignIn');

  return (
    <div>
      <h1>Awaiting Confirmation</h1> We sent an email to {email}
    </div>
  );
};

export default LinkAwait;
