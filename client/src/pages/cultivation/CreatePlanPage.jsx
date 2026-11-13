// client/src/pages/cultivation/CreatePlanPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CultivationPlanForm } from '../../components/cultivation/CultivationPlanForm.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export function CreatePlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState('');

  const defaultCrop = location.state?.cropName || '';
  const defaultFarmId = location.state?.farmId || '';

  const { data: farmsData, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const mutation = useMutation({
    mutationFn: (formData) => api.createCultivationPlan(formData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['cultivation-plans'] });
      navigate(`/cultivation-plans/${res.data.id}`);
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to establish cultivation plan.');
    },
  });

  if (farmsLoading) {
    return <LoadingSpinner text="Checking farm profiles..." />;
  }

  const farms = farmsData?.data || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link to="/cultivation-plans" className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-green hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Plans
        </Link>
        <PageHeader
          title="Establish Production Plan & Calendar"
          subtitle="Generate tailored timelines for soil prep, seed treatment, irrigation stages, and harvest windows"
        />
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {farms.length === 0 ? (
        <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-center text-sm">
          <p className="font-bold">No farm plots available.</p>
          <p className="text-xs opacity-90 mt-1 mb-4">Please register a farm plot before generating a cultivation schedule.</p>
          <a href="/farms/new" className="px-4 py-2 bg-amber-700 text-white font-semibold rounded-xl text-xs">
            Add Farm Plot
          </a>
        </div>
      ) : (
        <CultivationPlanForm
          farms={farms}
          defaultCrop={defaultCrop}
          defaultFarmId={defaultFarmId}
          onSubmit={(data) => {
            setErrorMsg('');
            mutation.mutate(data);
          }}
          isSubmitting={mutation.isPending}
        />
      )}
    </div>
  );
}

export default CreatePlanPage;
