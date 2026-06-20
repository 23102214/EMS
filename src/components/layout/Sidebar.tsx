/**
 * Collapsible responsive Sidebar Navigation component.
 */

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  CalendarX,
  CreditCard,
  User,
  ShieldAlert,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Employees', path: '/employees', icon: Users },
    { name: 'Departments', path: '/departments', icon: Building2 },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
    { name: 'Leaves', path: '/leaves', icon: CalendarX },
    { name: 'Payroll', path: '/payroll', icon: CreditCard },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  return (
    <aside
      id="application-sidebar"
      className={`fixed top-16 bottom-0 left-0 bg-white text-stone-700 border-r border-stone-200 z-35 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Group */}
      <div className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-200" id="sidebar-nav-group">
        <nav className="px-3 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                      : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                  }`
                }
                title={item.name}
              >
                <Icon className="w-5 h-5 flex-shrink-0 transition-colors" />
                <span
                  className={`transition-opacity duration-300 whitespace-nowrap ${
                    collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                  }`}
                >
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Admin Panel quick badge & Collapser info */}
      <div className="p-3 border-t border-stone-200 flex flex-col gap-2" id="sidebar-footprint">
        {user && !collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl border border-stone-200">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Security Clearance</p>
              <p className="text-xs font-semibold text-stone-700 truncate">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-stone-400 rounded-lg hover:bg-stone-50 hover:text-stone-700 transition-colors border border-dashed border-stone-200"
          id="collapse-toggle-btn"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          {!collapsed && <span className="text-xs ml-2 font-medium font-sans">Collapse Sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
