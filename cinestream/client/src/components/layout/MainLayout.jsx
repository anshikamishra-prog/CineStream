import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { SectionErrorBoundary } from '@components/common/ErrorBoundary.jsx';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-surface-900">
      <Navbar />
      <main className="flex-1">
        <SectionErrorBoundary>
          <Outlet />
        </SectionErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
