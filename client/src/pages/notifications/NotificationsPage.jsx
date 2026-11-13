import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import {
  Bell,
  CheckCheck,
  Check,
  CloudRain,
  Sprout,
  AlertTriangle,
  Info,
  Calendar,
} from 'lucide-react';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all'); // all, unread, advisory, weather, system

  const { data: notificationsRes, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getNotifications(),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => api.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => api.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const rawNotifications = notificationsRes?.data || notificationsRes || [];
  const notificationsList = Array.isArray(rawNotifications) ? rawNotifications : [];

  const filteredNotifications = notificationsList.filter((n) => {
    if (filter === 'unread') return !n.is_read;
    if (filter === 'advisory') return n.type === 'advisory' || n.category === 'advisory';
    if (filter === 'weather') return n.type === 'weather' || n.category === 'weather';
    if (filter === 'system') return n.type === 'system' || n.category === 'system';
    return true;
  });

  const unreadCount = notificationsList.filter((n) => !n.is_read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="w-5 h-5 text-blue-600" />;
      case 'advisory':
        return <Sprout className="w-5 h-5 text-green-600" />;
      case 'alert':
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      default:
        return <Info className="w-5 h-5 text-emerald-600" />;
    }
  };

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Just now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Notifications & Alerts"
        subtitle="Stay updated on real-time weather advisories, seasonal tips, and cultivation milestones."
        action={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllMutation.mutate()}
              disabled={markAllMutation.isPending}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all as read ({unreadCount})
            </button>
          ) : null
        }
      />

      {error && <AlertBanner type="error" message={error?.message || 'Failed to load notifications.'} />}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        {[
          { key: 'all', label: 'All Alerts', count: notificationsList.length },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'advisory', label: 'Advisories' },
          { key: 'weather', label: 'Weather & Climate' },
          { key: 'system', label: 'System' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === tab.key
                ? 'bg-green-700 text-white'
                : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-200'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  filter === tab.key ? 'bg-white text-green-800' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="lg" text="Fetching notification feed..." />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications Found"
          description={
            filter === 'all'
              ? 'You are all caught up! When new weather alerts or cultivation notices arrive, they will appear here.'
              : `No alerts under the "${filter}" filter.`
          }
          actionText={filter !== 'all' ? 'View All Notifications' : undefined}
          onAction={filter !== 'all' ? () => setFilter('all') : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all ${
                !item.is_read
                  ? 'bg-white border-green-300 border-l-4 border-l-green-600 shadow-sm'
                  : 'bg-white/80 border-gray-200 hover:border-gray-300'
              } flex items-start gap-3.5`}
            >
              <div className="p-2 rounded-lg bg-gray-50 flex-shrink-0">
                {getNotificationIcon(item.type || item.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-semibold truncate ${
                      !item.is_read ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 whitespace-nowrap flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatRelativeTime(item.created_at)}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {item.message || item.content}
                </p>

                {item.action_url && (
                  <a
                    href={item.action_url}
                    className="inline-block mt-2 text-xs font-semibold text-green-700 hover:underline"
                  >
                    View Details &rarr;
                  </a>
                )}
              </div>

              {!item.is_read && (
                <button
                  type="button"
                  title="Mark as read"
                  onClick={() => markReadMutation.mutate(item.id)}
                  disabled={markReadMutation.isPending}
                  className="p-1 text-gray-400 hover:text-green-700 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

