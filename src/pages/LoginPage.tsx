import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn, getCurrentUser } from '@/lib/auth/auth';
import { TEXT_COLORS } from '@/lib/constants/colors';
import FormInput from '@/components/FormInput';
import { useUserStore } from '@/lib/store/user-store';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || 'Failed to sign in');
        setLoading(false);
        return;
      }

      // Get user data and store it
      const user = await getCurrentUser();
      if (user) {
        const userEmail = user.email || '';
        const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUser(userEmail, userName);
      }

      // Redirect to inbox
      window.location.href = '/inbox'; // Force full reload to update auth state
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-semibold mb-2 ${TEXT_COLORS.primary}`}>
              Welcome back
            </h1>
            <p className={TEXT_COLORS.secondary}>
              Sign in to your workspace
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@company.com"
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 btn-primary font-medium rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={TEXT_COLORS.secondary}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="link-accent font-medium"
              >
                Create workspace
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}