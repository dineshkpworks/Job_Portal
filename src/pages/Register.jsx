import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10 bg-gradient-to-b from-[#f8fafc] to-white dark:from-gray-900 dark:to-gray-900">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 shadow-lg">
          <h1 className="text-xl font-semibold text-[#111827] dark:text-white text-center mb-1">
            Create account
          </h1>
          <p className="text-sm text-[#6b7280] dark:text-gray-400 text-center mb-6">
            Join to save jobs and track your applications.
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating account…' : 'Sign up'}
            </Button>
          </form>
        </div>
        <p className="mt-5 text-center text-sm text-[#6b7280] dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2563eb] font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
