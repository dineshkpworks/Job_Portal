import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';

function LogoIcon() {
  return (
    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563eb]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-xs sm:text-sm font-medium transition-colors duration-200 relative py-2 sm:py-3 ${
      isActive
        ? 'text-[#2563eb]'
        : 'text-[#6b7280] dark:text-gray-400 hover:text-[#111827] dark:hover:text-white'
    }`;

  const activeBar = (
    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563eb] rounded-full" />
  );

  return (
    <header className="sticky top-0 z-50 h-12 sm:h-16 border-b border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-2">
          <NavLink
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 font-semibold text-[#111827] dark:text-white text-sm sm:text-base no-underline shrink-0"
          >
            <LogoIcon />
            <span>Job Portal</span>
          </NavLink>
          <div className="flex items-center gap-3 sm:gap-6">
            <NavLink to="/" className={navLinkClass} end>
              {({ isActive }) => (
                <>
                  Jobs
                  {isActive && activeBar}
                </>
              )}
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/saved" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Saved
                      {isActive && activeBar}
                    </>
                  )}
                </NavLink>
                <NavLink to="/applied" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Applied
                      {isActive && activeBar}
                    </>
                  )}
                </NavLink>
                <span className="text-[#6b7280] dark:text-gray-400 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[140px]">
                  {user?.email}
                </span>
                <Button variant="ghost" onClick={handleLogout} className="px-2 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Log in
                      {isActive && activeBar}
                    </>
                  )}
                </NavLink>
                <NavLink to="/register">
                  <Button variant="primary" className="transition-all duration-200 hover:shadow-md px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm">
                    Sign up
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
