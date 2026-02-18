import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { JobProvider } from '../context/JobContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Layout() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <JobProvider userId={user?.uid}>
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-gray-900">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <footer className="flex-shrink-0 mt-auto">
          <Footer />
        </footer>
      </div>
    </JobProvider>
  );
}
