import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const LinkAwait = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const em = localStorage.getItem('emailForSignIn');
    setEmail(em);
    if (!em) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-lg mx-auto px-1 mb-10 md:px-4 sm:px-6 lg:px-8 mt-10">
      <div className="bg-white shadow p-4 pb-10 md:p-8 sm:rounded-lg text-center">
        <h1 className="text-2xl my-4">Awaiting Confirmation</h1> We sent an email to{' '}
        <strong>{email}</strong>
      </div>
    </main>
  );
};

export default LinkAwait;
