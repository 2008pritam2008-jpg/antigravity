import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/endpoints.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import {
  History,
  Sprout,
  FlaskConical,
  ScanLine,
  Layers,
  CalendarCheck2,
  Search,
  ExternalLink,
  Calendar,
  Filter,
} from 'lucide-react';

export default function HistoryPage() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: historyRes, isLoading, error } = useQuery({
    queryKey: ['advisory-history'],
    queryFn: () => api.getHistory(),
  });

  const rawHistory = historyRes?.data || historyRes || [];
  const historyList = Array.isArray(rawHistory) ? rawHistory : [];

  const filteredItems = historyList.filter((item) => {
    const itemType = (item.type || item.advisory_type || '').toLowerCase();
    if (filterType !== 'all' && !itemType.includes(filterType)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = (item.title || item.crop_name || item.name || '').toLowerCase();
      const desc = (item.summary || item.diagnosis || item.notes || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    }
    return true;
  });

  const getTypeBadge = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('crop') || t.includes('recommendation')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
          <Sprout className="w-3 h-3" /> Crop Rec
        </span>
      );
    }
    if (t.includes('soil')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
          <FlaskConical className="w-3 h-3" /> Soil Analysis
        </span>
      );
    }
    if (t.includes('disease') || t.includes('pest')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
          <ScanLine className="w-3 h-3" /> Disease Detection
        </span>
      );
    }
    if (t.includes('fertilizer') || t.includes('nutrient')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
          <Layers className="w-3 h-3" /> Fertilizer Guide
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
        <CalendarCheck2 className="w-3 h-3" /> Cultivation Plan
      </span>
    );
  };

  const getTargetLink = (item) => {
    const t = (item.type || item.advisory_type || '').toLowerCase();
    if (t.includes('plan')) return `/cultivation-plans/${item.id}`;
    if (t.includes('disease')) return `/disease-detection`;
    if (t.includes('soil')) return `/soil-analysis`;
    if (t.includes('fertilizer')) return `/fertilizer-advisor`;
    return `/crop-recommendation`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Advisory & Analysis History"
        subtitle="Review past AI crop evaluations, soil fertility reports, pathogen detections, and cultivation schedules."
      />

      {error && <AlertBanner type="error" message={error?.message || 'Failed to load advisory history.'} />}

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by crop, pest, or farm..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: 'all', label: 'All' },
            { key: 'crop', label: 'Crops' },
            { key: 'soil', label: 'Soil' },
            { key: 'disease', label: 'Diseases' },
            { key: 'fertilizer', label: 'Nutrients' },
            { key: 'plan', label: 'Plans' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterType(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                filterType === tab.key
                  ? 'bg-green-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner size="lg" text="Retrieving historical logs..." />
        </div>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon={History}
          title="No History Entries Found"
          description={
            searchQuery || filterType !== 'all'
              ? 'No advisories match your current filter criteria.'
              : 'You have not generated any crop recommendations, soil diagnoses, or plans yet.'
          }
          actionText={searchQuery || filterType !== 'all' ? 'Reset Filters' : 'Run Crop Recommendation'}
          onAction={
            searchQuery || filterType !== 'all'
              ? () => {
                  setSearchQuery('');
                  setFilterType('all');
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-green-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTypeBadge(item.type || item.advisory_type)}
                  <h4 className="text-sm font-bold text-gray-900 truncate">
                    {item.title || item.crop_name || item.disease_name || 'Agricultural Advisory'}
                  </h4>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {item.summary || item.notes || item.diagnosis || item.content || 'Detailed diagnostic and action plan records available.'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : 'Recent'}
                  </span>
                  {item.farm_name && <span>• Farm: {item.farm_name}</span>}
                </div>
              </div>

              <Link
                to={getTargetLink(item)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-green-50 text-green-700 hover:text-green-800 border border-gray-200 rounded-lg text-xs font-semibold transition flex-shrink-0"
              >
                <span>View Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
