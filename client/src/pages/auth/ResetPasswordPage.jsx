// client/src/pages/auth/ResetPasswordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../../context/AuthContext.jsx';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const newPassword = watch('newPassword');

  const onSubmit = async ({ newPassword }) => {
    try {
      setErrorMsg('');
      if (supabase) {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Set New Password</h3>
        <p className="text-xs text-gray-500 mt-1">Please enter your new secure password (min 12 chars)</p>
      </div>

      {success ? (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Password updated successfully! Redirecting to login...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              {...register('newPassword', { required: true, minLength: 12 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="••••••••••••"
              {...register('confirmPassword', {
                required: true,
                validate: (v) => v === newPassword || 'Passwords must match',
              })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPasswordPage;
