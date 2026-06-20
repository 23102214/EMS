/**
 * Application Parent Core Shell. Handles viewport responsive alignment.
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on smaller initial viewports
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    handleResize(); // trigger initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-stone-800 flex flex-col font-sans" id="application-layout-root">
      {/* Fixed Top Bar */}
      <Navbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Container Assembly */}
      <div className="flex flex-1 pt-16" id="main-assembly">
        {/* Sticky Sidebar Navigation */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Area viewport-dependent margins */}
        <main
          className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] p-4 md:p-6 lg:p-8 overflow-x-hidden ${
            sidebarCollapsed ? 'pl-16' : 'lg:pl-64'
          }`}
          id="main-viewport-pane"
        >
          <div className="max-w-7xl mx-auto space-y-6" id="inner-viewport-alignment">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
