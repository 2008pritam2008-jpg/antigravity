// client/src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setIsSubmitting(true);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role = 'farmer') => {
    try {
      setIsSubmitting(true);
      const email = role === 'admin' ? 'admin@demo.agriassist.in' : 'farmer@demo.agriassist.in';
      await login(email, 'demo-password-123');
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Sign in to your Farm Account</h3>
        <p className="text-xs text-gray-500 mt-1">Access your plots, advisories, and cultivation calendar</p>
      </div>

      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="farmer@example.com"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-gray-700">Password</label>
            <Link to="/forgot-password" className="text-xs font-semibold text-agri-green hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••••••"
            {...register('password', { required: 'Password is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In
        </button>
      </form>

      {/* Quick Demo Login Buttons */}
      <div className="pt-4 border-t border-gray-100">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center mb-2.5">
          Quick Evaluation Access
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('farmer')}
            className="py-2 px-3 rounded-xl border border-gray-200 hover:border-agri-green bg-gray-50 hover:bg-white text-xs font-semibold text-gray-700 transition"
          >
            Demo Farmer
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin')}
            className="py-2 px-3 rounded-xl border border-gray-200 hover:border-purple-600 bg-gray-50 hover:bg-white text-xs font-semibold text-purple-700 transition"
          >
            Demo Admin
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 pt-2">
        Don't have an account yet?{' '}
        <Link to="/register" className="font-bold text-agri-green hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
