import React, { useState } from 'react';
import { X } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { loginUser, registerUser } from '../services/authService';

const LoginModal = ({ onLogin, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // IMPORTANT: Pass email as the username for login
      await loginUser({
        username: email, // Using email here as the backend expects email in the username field
        password: password
      });
      onLogin(true);
    } catch (error) {
      setError('Login failed: ' + (error.message || 'Please try again'));
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Register user with proper fields
      await registerUser({
        username,
        email,
        password
      });

      // Then login automatically using email as username
      await loginUser({
        username: email, // Using email here as the backend expects email in the username field
        password: password
      });

      onLogin(true);
    } catch (error) {
      setError('Registration failed: ' + (error.message || 'Please try again'));
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Implement forgot password functionality
    console.log("Forgot password clicked");
    // You could open a new modal or navigate to a password reset page
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X size={20} />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex">
                    <button
                      onClick={() => setActiveTab('login')}
                      className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'login'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setActiveTab('register')}
                      className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'register'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Register
                    </button>
                  </nav>
                </div>

                {/* Login Form */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLogin} className="space-y-6 mt-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="current-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="font-medium text-blue-600 hover:text-blue-500">
                          Forgot your password?
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isLoading ? <LoadingSpinner size="small" /> : 'Sign in'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Register Form */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegister} className="space-y-6 mt-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <div className="mt-1">
                        <input
                          id="username"
                          name="username"
                          type="text"
                          autoComplete="username"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <div className="mt-1">
                        <input
                          id="reg-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <div className="mt-1">
                        <input
                          id="reg-password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isLoading ? <LoadingSpinner size="small" /> : 'Register'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;