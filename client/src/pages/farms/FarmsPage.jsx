// client/src/pages/farms/FarmsPage.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { FarmCard } from '../../components/farms/FarmCard.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { Plus, MapPin } from 'lucide-react';

export function FarmsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const deleteMutation = useMutation({
    mutationFn: (farmId) => api.deleteFarm(farmId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading registered plots..." />;
  }

  const farms = data?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Farm Plots"
        subtitle="Manage land acreage, soil classifications, and water infrastructure"
        action={
          <Link
            to="/farms/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-xs sm:text-sm transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Farm</span>
          </Link>
        }
      />

      {farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onDelete={(id) => {
                if (window.confirm(`Are you sure you want to delete "${farm.farm_name}"?`)) {
                  deleteMutation.mutate(id);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<MapPin className="w-8 h-8" />}
          title="No Farm Plots Registered"
          description="Register your land area, soil chemistry, and irrigation system to unlock personalized crop and fertilizer advisories."
          actionText="Register Your First Plot"
          onAction={() => window.location.assign('/farms/new')}
        />
      )}
    </div>
  );
}

export default FarmsPage;
