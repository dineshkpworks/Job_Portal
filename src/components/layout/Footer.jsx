import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <Link to="/" className="text-sm font-medium text-[#111827] dark:text-white">
            Job Portal
          </Link>
          <div className="flex gap-4 text-sm text-[#6b7280] dark:text-gray-400">
            <Link to="/" className="hover:text-[#111827] dark:hover:text-white">Jobs</Link>
            <a href="#" className="hover:text-[#111827] dark:hover:text-white">Privacy</a>
            <a href="#" className="hover:text-[#111827] dark:hover:text-white">Terms</a>
          </div>
        </div>
        <p className="mt-2 text-center sm:text-left text-xs text-[#6b7280] dark:text-gray-500">
          © {new Date().getFullYear()} Job Portal
        </p>
      </div>
    </footer>
  );
}
