import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';
import { INDIAN_STATES_DISTRICTS } from '../../constants/indianAgri.js';
import { User, Phone, MapPin, Award, Globe, Ruler, Save, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    state: '',
    district: '',
    village: '',
    farming_experience: 1,
    preferred_language: 'en',
    preferred_unit: 'metric',
  });

  const [statusMessage, setStatusMessage] = useState(null);

  const { data: profileRes, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  useEffect(() => {
    const profile = profileRes?.data || profileRes;
    if (profile) {
      setFormData({
        full_name: profile.full_name || user?.user_metadata?.full_name || '',
        phone: profile.phone || '',
        state: profile.state || '',
        district: profile.district || '',
        village: profile.village || '',
        farming_experience: profile.farming_experience || 1,
        preferred_language: profile.preferred_language || 'en',
        preferred_unit: profile.preferred_unit || 'metric',
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user?.user_metadata?.full_name || '',
      }));
    }
  }, [profileRes, user]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setStatusMessage({ type: 'success', message: 'Profile updated successfully!' });
    },
    onError: (err) => {
      setStatusMessage({ type: 'error', message: err?.message || 'Failed to update profile.' });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'state') {
        next.district = '';
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMessage(null);
    updateMutation.mutate({
      ...formData,
      farming_experience: Number(formData.farming_experience) || 0,
    });
  };

  const availableDistricts = formData.state ? INDIAN_STATES_DISTRICTS[formData.state] || [] : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Farmer Profile & Settings"
        subtitle="Manage your personal agricultural profile, regional defaults, and farm preferences."
      />

      {statusMessage && (
        <AlertBanner
          type={statusMessage.type}
          message={statusMessage.message}
          onDismiss={() => setStatusMessage(null)}
        />
      )}

      {error && !statusMessage && (
        <AlertBanner type="error" message={error?.message || 'Failed to load profile details.'} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <User className="w-5 h-5 text-green-700" />
            <h3 className="text-base font-semibold text-gray-800">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="e.g. Ramesh Kumar Patel"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || 'user@example.com'}
                disabled
                className="w-full px-3 py-2 text-sm border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Phone Number (WhatsApp Advisory)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full pl-12 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Farming Experience (Years)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="70"
                  name="farming_experience"
                  value={formData.farming_experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location & Farm Jurisdiction */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <MapPin className="w-5 h-5 text-green-700" />
            <h3 className="text-base font-semibold text-gray-800">Primary Location & Agro-Climatic Zone</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="">Select State</option>
                {Object.keys(INDIAN_STATES_DISTRICTS).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                District *
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Select District</option>
                {availableDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Village / Taluka / Locality
              </label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleChange}
                placeholder="e.g. Niphad / Pimpalgaon"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* System Preferences */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe className="w-5 h-5 text-green-700" />
            <h3 className="text-base font-semibold text-gray-800">Language & Display Units</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Preferred Advisory Language
              </label>
              <select
                name="preferred_language"
                value={formData.preferred_language}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white"
              >
                <option value="en">English (Default)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                AI responses and crop advisories will prioritize this language.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                Measurement System
              </label>
              <div className="flex items-center gap-6 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferred_unit"
                    value="metric"
                    checked={formData.preferred_unit === 'metric'}
                    onChange={handleChange}
                    className="text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span className="text-sm text-gray-800">Metric (Hectares, kg, °C, mm)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="preferred_unit"
                    value="imperial"
                    checked={formData.preferred_unit === 'imperial'}
                    onChange={handleChange}
                    className="text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span className="text-sm text-gray-800">Imperial (Acres, lbs, °F)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-green-700 text-white text-sm font-medium rounded-lg hover:bg-green-800 focus:ring-4 focus:ring-green-200 transition-colors disabled:opacity-50 shadow-sm"
          >
            {updateMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

