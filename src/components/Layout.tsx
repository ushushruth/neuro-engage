import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-bg-base selection:bg-white selection:text-black">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto w-full animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
