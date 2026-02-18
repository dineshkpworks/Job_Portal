import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-semibold text-gray-300 dark:text-gray-600 mb-1">404</h1>
      <h2 className="text-lg font-semibold text-[#111827] dark:text-white mb-1">
        Page not found
      </h2>
      <p className="text-sm text-[#6b7280] dark:text-gray-400 mb-4">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/">
        <Button variant="primary">Back to jobs</Button>
      </Link>
    </div>
  );
}
