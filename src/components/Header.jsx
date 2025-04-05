import React, { useState } from 'react';
import { Menu, X, User, LogOut, List, Home, HelpCircle } from 'lucide-react';

const Header = ({ isLoggedIn, onLoginClick, onLogout, onHistoryClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center">
            <div className="text-blue-600 font-bold text-2xl">MedTranscribe</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <button
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => window.location.assign('/')}
            >
              <Home size={16} className="mr-1" /> Home
            </button>

            {isLoggedIn && (
              <button
                onClick={onHistoryClick}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <List size={16} className="mr-1" /> History
              </button>
            )}

            <button
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              onClick={() => window.open('/help', '_blank')}
            >
              <HelpCircle size={16} className="mr-1" /> Help
            </button>
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center">
            {isLoggedIn ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                  </button>
                </div>

                {isMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                  >
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => window.location.assign('/profile')}
                    >
                      Your Profile
                    </button>

                    <button
                      onClick={onHistoryClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      History
                    </button>

                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={() => window.location.assign('/settings')}
                    >
                      Settings
                    </button>

                    <button
                      onClick={onLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => window.location.assign('/')}
            >
              <Home size={16} className="inline mr-2" /> Home
            </button>

            {isLoggedIn && (
              <button
                onClick={() => { onHistoryClick(); setIsMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <List size={16} className="mr-2" /> History
              </button>
            )}

            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => window.open('/help', '_blank')}
            >
              <HelpCircle size={16} className="inline mr-2" /> Help
            </button>
          </div>

          {/* Mobile User Menu */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <>
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <User size={20} />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">User Name</div>
                    <div className="text-sm font-medium text-gray-500">user@example.com</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => window.location.assign('/profile')}
                  >
                    Your Profile
                  </button>

                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    onClick={() => window.location.assign('/settings')}
                  >
                    Settings
                  </button>

                  <button
                    onClick={onLogout}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="px-5">
                <button
                  onClick={onLoginClick}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;