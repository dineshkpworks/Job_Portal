import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#f8fafc] to-white dark:from-gray-900 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-lg">
          <h1 className="text-xl font-semibold text-[#111827] dark:text-white text-center mb-1">
            Sign in
          </h1>
          <p className="text-sm text-[#6b7280] dark:text-gray-400 text-center mb-6">
            Enter your credentials to access your account.
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full py-2.5 transition-all duration-200 hover:shadow-md"
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-[#6b7280] dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2563eb] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
