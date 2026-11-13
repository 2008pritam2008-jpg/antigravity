// client/src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext.jsx';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      setErrorMsg('');
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Could not send recovery instructions.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-green hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to login
        </Link>
        <h3 className="text-xl font-bold text-gray-900">Reset your Password</h3>
        <p className="text-xs text-gray-500 mt-1">Enter your registered email to receive recovery instructions</p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="font-bold">Password recovery link dispatched</p>
            <p className="opacity-90 mt-0.5">Please check your email inbox for instructions to set your new password.</p>
          </div>
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
            <label className="block text-xs font-semibold text-gray-700 mb-1">Registered Email</label>
            <input
              type="email"
              placeholder="farmer@example.com"
              {...register('email', { required: true })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm"
          >
            Send Reset Instructions
          </button>
        </form>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
