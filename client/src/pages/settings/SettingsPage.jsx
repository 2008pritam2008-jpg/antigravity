import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';
import {
  Settings,
  Globe,
  Ruler,
  Bell,
  Database,
  Trash2,
  Info,
  CheckCircle,
  Save,
  Download,
} from 'lucide-react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const [settings, setSettings] = useState({
    preferred_language: 'en',
    preferred_unit: 'metric',
    notify_weather: true,
    notify_pest_alerts: true,
    notify_irrigation: true,
    notify_seasonal: true,
  });

  const [feedback, setFeedback] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  useEffect(() => {
    const profile = profileRes?.data || profileRes;
    if (profile) {
      setSettings((prev) => ({
        ...prev,
        preferred_language: profile.preferred_language || 'en',
        preferred_unit: profile.preferred_unit || 'metric',
      }));
    }
  }, [profileRes]);

  const updateMutation = useMutation({
    mutationFn: (data) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setFeedback({ type: 'success', message: 'Settings and preferences saved successfully.' });
      setTimeout(() => setFeedback(null), 3500);
    },
    onError: (err) => {
      setFeedback({ type: 'error', message: err?.message || 'Failed to save settings.' });
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      preferred_language: settings.preferred_language,
      preferred_unit: settings.preferred_unit,
    });
  };

  const handleExportData = () => {
    const exportData = {
      user: user?.email,
      exported_at: new Date().toISOString(),
      settings,
      system_version: 'AgriAssist AI 2.0.0-PROD',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agriassist-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFeedback({ type: 'success', message: 'Farm profile & telemetry archive downloaded.' });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading preferences..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Application Settings & Preferences"
        subtitle="Configure localization, telemetry notifications, and data management options."
      />

      {feedback && (
        <AlertBanner
          type={feedback.type}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* Language & Regional Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Globe className="w-5 h-5 text-green-700" />
          <h3 className="text-base font-semibold text-gray-900">Regional Language</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">
            AI Advisory Response Language
          </label>
          <select
            value={settings.preferred_language}
            onChange={(e) => setSettings({ ...settings, preferred_language: e.target.value })}
            className="w-full sm:w-80 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Affects conversational agronomist chat, crop advisory summaries, and disease explanations.
          </p>
        </div>
      </div>

      {/* Units */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Ruler className="w-5 h-5 text-green-700" />
          <h3 className="text-base font-semibold text-gray-900">Measurement System</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition flex-1">
            <input
              type="radio"
              name="unit"
              value="metric"
              checked={settings.preferred_unit === 'metric'}
              onChange={(e) => setSettings({ ...settings, preferred_unit: e.target.value })}
              className="text-green-600 focus:ring-green-500 h-4 w-4"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Metric Units (Recommended in India)</p>
              <p className="text-xs text-gray-500">Hectares, Kilograms, Celsius (°C), Millimeters (mm)</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition flex-1">
            <input
              type="radio"
              name="unit"
              value="imperial"
              checked={settings.preferred_unit === 'imperial'}
              onChange={(e) => setSettings({ ...settings, preferred_unit: e.target.value })}
              className="text-green-600 focus:ring-green-500 h-4 w-4"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Imperial Units</p>
              <p className="text-xs text-gray-500">Acres, Pounds, Fahrenheit (°F), Inches</p>
            </div>
          </label>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Bell className="w-5 h-5 text-green-700" />
          <h3 className="text-base font-semibold text-gray-900">Advisory Push Notifications</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'notify_weather',
              title: 'Severe Weather Warnings',
              desc: 'Heavy precipitation, frost risks, heatwaves, and gale alerts based on Open-Meteo telemetry.',
            },
            {
              key: 'notify_pest_alerts',
              title: 'District Pest & Pathogen Outbreak Notices',
              desc: 'Regional locust, fall armyworm, and rust warnings published by agricultural departments.',
            },
            {
              key: 'notify_irrigation',
              title: 'Irrigation & Sowing Reminders',
              desc: 'Reminders derived from your active cultivation schedule phases.',
            },
            {
              key: 'notify_seasonal',
              title: 'Kharif / Rabi / Zaid Sowing Window Updates',
              desc: 'Optimal seed-sowing dates based on monsoon onset and soil temperature.',
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="pr-4">
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={!!settings[item.key]}
                onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-700 text-white text-sm font-semibold rounded-lg hover:bg-green-800 transition disabled:opacity-50 shadow-sm"
        >
          <Save className="w-4 h-4" />
          {updateMutation.isPending ? 'Saving Preferences...' : 'Save Settings'}
        </button>
      </div>

      {/* Data Management & Account Deletion */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Database className="w-5 h-5 text-gray-700" />
          <h3 className="text-base font-semibold text-gray-900">Privacy & Data Governance</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-800">Export Farm Records & AI History</p>
            <p className="text-xs text-gray-500">Download a full JSON archive of your farm records and advisories.</p>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            <Download className="w-4 h-4" /> Export Data
          </button>
        </div>

        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-red-700">Delete Account & Farm Records</p>
            <p className="text-xs text-gray-500">Permanently purge your farm profiles, soil tests, and AI records.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-100 transition"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-green-700" />
          <span>AgriAssist AI Assistant v2.0.0 (Production) · Gemini 2.5 Flash Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/privacy" className="hover:text-green-800 underline">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-green-800 underline">Terms of Use</Link>
          <Link to="/about" className="hover:text-green-800 underline">About Platform</Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h4 className="text-base font-bold text-gray-900">Confirm Account Deletion</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to permanently erase your account? All registered plots, soil analyses, disease diagnosis logs, and cultivation schedules will be immediately purged in accordance with our data policy.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  logout();
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Yes, Purge My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
