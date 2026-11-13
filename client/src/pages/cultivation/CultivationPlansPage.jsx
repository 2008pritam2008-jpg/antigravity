// client/src/pages/cultivation/CultivationPlansPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { Plus, CalendarCheck2, ArrowRight } from 'lucide-react';

export function CultivationPlansPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['cultivation-plans'],
    queryFn: () => api.getCultivationPlans(),
  });

  if (isLoading) {
    return <LoadingSpinner text="Retrieving active crop production plans..." />;
  }

  const plans = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cultivation Operational Plans"
        subtitle="End-to-end production timelines from seed preparation to final harvest"
        action={
          <Link
            to="/cultivation-plans/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Cultivation Plan</span>
          </Link>
        }
      />

      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-base">{p.crop_name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 capitalize">
                    {p.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                  <p>Acreage: <strong className="text-gray-900">{p.land_area} {p.area_unit}</strong></p>
                  <p>Sowing Date: <strong className="text-gray-900">{p.sowing_date}</strong></p>
                  {p.expected_harvest_date && (
                    <p>Expected Harvest: <strong className="text-gray-900">{p.expected_harvest_date}</strong></p>
                  )}
                </div>

                {p.plan_data?.plan_summary && (
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                    {p.plan_data.plan_summary}
                  </p>
                )}
              </div>

              <Link
                to={`/cultivation-plans/${p.id}`}
                className="pt-3 border-t border-gray-100 text-xs font-semibold text-agri-green hover:text-forest-900 flex items-center justify-between"
              >
                <span>View Stage Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarCheck2 className="w-8 h-8" />}
          title="No Cultivation Plans Active"
          description="Establish your first crop plan to receive stage-specific irrigation, weeding, and fertigation milestone alerts."
          actionText="Create Crop Plan"
          onAction={() => window.location.assign('/cultivation-plans/new')}
        />
      )}
    </div>
  );
}

export default CultivationPlansPage;
