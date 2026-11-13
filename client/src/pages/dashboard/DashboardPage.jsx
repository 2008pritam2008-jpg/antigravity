// client/src/pages/dashboard/DashboardPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { WelcomeCard } from '../../components/dashboard/WelcomeCard.jsx';
import { FarmSummaryCard } from '../../components/dashboard/FarmSummaryCard.jsx';
import { WeatherSummaryCard } from '../../components/dashboard/WeatherSummaryCard.jsx';
import { QuickActionGrid } from '../../components/dashboard/QuickActionGrid.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { Sparkles, ScanLine, FlaskConical, CalendarCheck2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();

  // 1. Fetch user farms
  const { data: farmsData, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  // 2. Fetch history summary
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ['history'],
    queryFn: () => api.getHistory(),
  });

  // 3. Fetch active cultivation plans
  const { data: plansData } = useQuery({
    queryKey: ['cultivation-plans'],
    queryFn: () => api.getCultivationPlans(),
  });

  // 4. Fetch live weather for primary farm
  const primaryFarm = farmsData?.data?.[0];
  const { data: weatherData } = useQuery({
    queryKey: ['weather', primaryFarm?.id],
    queryFn: () => api.getCurrentWeather({ farmId: primaryFarm?.id }),
  });

  if (farmsLoading || historyLoading) {
    return <LoadingSpinner text="Loading your agricultural command center..." />;
  }

  const farms = farmsData?.data || [];
  const history = historyData?.data || [];
  const plans = plansData?.data || [];
  const weather = weatherData?.data || null;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <WelcomeCard
        farmerName={user?.user_metadata?.full_name || user?.fullName}
        state={primaryFarm?.state}
        district={primaryFarm?.district}
      />

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FarmSummaryCard farms={farms} />
        <WeatherSummaryCard weatherData={weather} />
      </div>

      {/* Quick Launchpad */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-agri-green" />
          Agricultural AI Workflows
        </h3>
        <QuickActionGrid />
      </div>

      {/* Recent Advisories & Active Plans Dual Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Advisories */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Recent Advisory Records</h3>
              <Link to="/history" className="text-xs font-semibold text-agri-green hover:underline">
                View All
              </Link>
            </div>

            {history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-forest-900 flex items-center justify-center flex-shrink-0">
                      {item.type.includes('crop') && <Sparkles className="w-4 h-4 text-emerald-600" />}
                      {item.type.includes('disease') && <ScanLine className="w-4 h-4 text-rose-500" />}
                      {item.type.includes('soil') && <FlaskConical className="w-4 h-4 text-amber-500" />}
                      {item.type.includes('cultivation') && <CalendarCheck2 className="w-4 h-4 text-indigo-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.summary}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic py-6 text-center">
                No recent agricultural analyses. Run a crop recommendation or disease scan to see results here.
              </p>
            )}
          </div>
        </div>

        {/* Active Cultivation Plans */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-base">Active Crop Calendars</h3>
              <Link to="/cultivation-plans" className="text-xs font-semibold text-agri-green hover:underline">
                View All Plans
              </Link>
            </div>

            {plans.length > 0 ? (
              <div className="space-y-3">
                {plans.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    to={`/cultivation-plans/${p.id}`}
                    className="p-3.5 rounded-xl border border-gray-200 hover:border-agri-green bg-white transition block shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900">{p.crop_name}</h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 capitalize">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sown: {p.sowing_date} · Harvest Est: {p.expected_harvest_date || 'Calculated'} · {p.land_area} {p.area_unit}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-gray-500 mb-3">No active production timelines established yet.</p>
                <Link
                  to="/cultivation-plans/new"
                  className="px-4 py-2 rounded-xl bg-forest-900 text-white font-semibold text-xs inline-flex items-center gap-1.5"
                >
                  Create Cultivation Plan <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
