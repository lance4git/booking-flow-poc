import React, { useState } from 'react';
import { Menu, X, Search, Globe, User, LogIn } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Products & Services', value: ViewState.SERVICES },
    { label: 'Tracking', value: ViewState.TRACKING },
    { label: 'Sustainability', value: ViewState.SUSTAINABILITY },
    { label: 'Digital Solutions', value: ViewState.HOME },
  ];

  return (
    <header className="bg-white text-gray-800 sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer space-x-3"
            onClick={() => onChangeView(ViewState.HOME)}
          >
             <div className="bg-nordic text-white p-1.5 rounded">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
             </div>
             <span className="font-bold text-2xl tracking-tight text-nordic">NORDIC <span className="font-light text-gray-500">LOGISTICS</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 h-full items-center">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onChangeView(item.value)}
                className={`text-sm font-bold uppercase tracking-wide h-full border-b-2 transition-colors duration-200 flex items-center px-1 ${
                  currentView === item.value 
                    ? 'border-nordic text-nordic' 
                    : 'border-transparent text-gray-600 hover:text-nordic hover:border-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-500 hover:text-nordic">
              <Search className="h-5 w-5" />
            </button>
            <button className="text-gray-500 hover:text-nordic flex items-center text-sm font-medium">
              <Globe className="h-5 w-5 mr-1" /> EN
            </button>
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            <button className="flex items-center text-sm font-bold text-nordic hover:text-nordic-dark transition">
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </button>
            <button className="bg-accent hover:bg-accent-hover text-white text-sm font-bold px-4 py-2 rounded shadow-sm transition">
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-nordic p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onChangeView(item.value);
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-3 rounded-md text-base font-bold text-gray-600 hover:text-nordic hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2">
                <button className="block w-full text-left px-3 py-3 text-base font-bold text-nordic">
                Sign In
                </button>
                <button className="block w-full text-left px-3 py-3 text-base font-bold text-accent">
                Register
                </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;