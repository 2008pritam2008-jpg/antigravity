// client/src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext.jsx';
import { Loader2, AlertCircle } from 'lucide-react';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      preferredLanguage: 'en',
    },
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    try {
      setAuthError('');
      setIsSubmitting(true);
      await registerUser(data.email, data.password, data.fullName);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Create Farmer Account</h3>
        <p className="text-xs text-gray-500 mt-1">Start receiving customized agronomic guidance</p>
      </div>

      {authError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            placeholder="e.g. Ramesh Patil"
            {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            placeholder="farmer@example.com"
            {...register('email', { required: 'Email is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Language *</label>
          <select
            {...register('preferredLanguage')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Password * (Min 12 characters)</label>
          <input
            type="password"
            placeholder="••••••••••••"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 12, message: 'Password must be at least 12 characters' },
            })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password *</label>
          <input
            type="password"
            placeholder="••••••••••••"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === passwordVal || 'Passwords do not match',
            })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.confirmPassword && <p className="text-rose-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          Register Farmer Account
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 pt-2">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-agri-green hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
