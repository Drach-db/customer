'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/auth/auth';
import { TEXT_COLORS } from '@/lib/constants/colors';
import FormInput from '@/components/FormInput';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signUp({ email, password, workspaceName });

      if (!result.success) {
        setError(result.error || 'Failed to sign up');
        setLoading(false);
        return;
      }

      // Redirect to workspace
      if (result.workspace) {
        router.push(`/workspaces/${result.workspace.slug}/inbox`);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-semibold mb-2 ${TEXT_COLORS.primary}`}>
              Create your workspace
            </h1>
            <p className={TEXT_COLORS.secondary}>
              Get started with your customer support platform
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              id="workspace"
              label="Workspace name"
              type="text"
              value={workspaceName}
              onChange={setWorkspaceName}
              placeholder="Acme Inc"
            />

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
              placeholder="At least 6 characters"
              minLength={6}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 btn-primary font-medium rounded-lg ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating workspace...' : 'Create workspace'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className={TEXT_COLORS.secondary}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="link-accent font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
