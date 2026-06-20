/**
 * Fixed Top Navigation Bar with active system stats, user quickactions, and user info.
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LogOut, User as UserIcon, Settings, Bell, Calendar, ChevronDown, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Elegant system-driven UTC hour tracker 
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    info('Successfully logged out of your session.');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-stone-200 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm" id="main-header">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
          id="toggle-sidebar-trigger"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <Link to="/" className="flex items-center gap-2" id="brand-logo-link">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg leading-none">
            E
          </div>
          <span className="font-sans font-bold text-lg text-stone-900 tracking-tight hidden sm:block">
            EMS <span className="text-emerald-600 font-medium text-sm">Enterprise</span>
          </span>
        </Link>
      </div>

      {/* Clock & Action panel */}
      <div className="flex items-center gap-4">
        {/* Live system clock (High Craft indicator) */}
        <div className="hidden lg:flex items-center gap-2 text-stone-550 text-xs font-mono bg-stone-50 border border-stone-100 px-3 py-1.5 rounded-full" id="system-clock-container">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          <span className="text-stone-300">|</span>
          <span className="text-stone-700 font-medium">{currentTime}</span>
        </div>

        {/* Notifications Icon (Simulated warning message trigger) */}
        <button
          onClick={() => info('All systems functional. No pending critical actions.')}
          className="relative p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-all"
          id="bell-icon-trigger"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-600 border border-white rounded-full"></span>
        </button>

        <span className="h-6 w-[1px] bg-stone-200 hidden sm:block"></span>

        {/* User Profile Action Dropdown */}
        {user && (
          <div className="relative" ref={dropdownRef} id="user-profile-dropdown-container">
            <button
               onClick={() => setDropdownOpen(!dropdownOpen)}
               className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-100 transition-all text-left"
               id="user-profile-dropdown-trigger"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=32&q=80'}
                referrerPolicy="no-referrer"
                alt={`${user.firstName} Avatar`}
                className="w-8 h-8 rounded-lg object-cover border border-stone-200"
              />
              <div className="hidden md:block">
                <p className="text-xs font-sans font-semibold text-stone-800 leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-[10px] font-mono text-stone-400 mt-0.5 leading-none uppercase">
                  {user.role}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-100 py-1.5 text-sm z-50 animate-slide-in" id="dropdown-box">
                <div className="px-4 py-2 border-b border-stone-200">
                  <p className="font-semibold text-stone-800">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">{user.email}</p>
                </div>
                
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-stone-400" />
                  <span>My Profile</span>
                </Link>

                <div className="border-t border-stone-200 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
                  id="navbar-logout-btn"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
