import React, { useState } from 'react';
import { useStores } from 'services/useStores';
import { useRouter } from 'next/router';

import { ThirdPartyLogin } from 'components/ThirdPartyLogin';

const Login = () => {
  const [username, setUsername] = useState('');
  const { user } = useStores();
  const router = useRouter();
  const [error, setError] = useState('');

  const handleError = (error: Error) => {
    setError(`Error: ${error.message}`);
  };

  const handleLoginWithLink = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await user.signInWithLink(username);
      router.push('/linkAwait');
    } catch (error) {
      handleError(error);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
          Log in
        </h2>
        {/* <p className="mt-2 text-center text-sm leading-5 text-gray-600 max-w">
        Or{' '}
        <a
          href="#"
          className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150"
        >
          start your 14-day free trial
        </a>
      </p> */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleLoginWithLink}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">
                Email address
              </label>
              <div className="mt-1 rounded-md shadow-sm">
                <input
                  required
                  id="email"
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  onChange={handleUsernameChange}
                />
              </div>
            </div>

            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition duration-150 ease-in-out"
                >
                  Continue
                </button>
              </span>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm leading-5">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <ThirdPartyLogin handleError={handleError} />
          </div>
        </div>

        <p className="text-red-800 p-7">{error}</p>
      </div>
    </div>
  );
};

export default Login;
