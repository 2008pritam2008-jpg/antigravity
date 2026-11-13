// client/src/pages/advisories/SoilAnalysisPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { SoilAnalysisForm } from '../../components/soil/SoilAnalysisForm.jsx';
import { SoilAnalysisResult } from '../../components/soil/SoilAnalysisResult.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { AlertCircle } from 'lucide-react';

export function SoilAnalysisPage() {
  const queryClient = useQueryClient();
  const [activeResult, setActiveResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: farmsData, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const mutation = useMutation({
    mutationFn: (payload) => api.analyzeSoil(payload),
    onSuccess: (res) => {
      setActiveResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Soil analysis failed.');
    },
  });

  if (farmsLoading) {
    return <LoadingSpinner text="Loading farm soil profiles..." />;
  }

  const farms = farmsData?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="Soil Health & Nutrient Analysis"
        subtitle="Decode soil pH, NPK ratings, and organic carbon into practical soil-enrichment protocols"
      />

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {farms.length === 0 ? (
        <div className="p-8 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-center text-sm">
          <p className="font-bold">No farm plots found.</p>
          <p className="text-xs opacity-90 mt-1 mb-4">Please register a farm plot before analyzing soil fertility.</p>
          <a href="/farms/new" className="px-4 py-2 bg-amber-700 text-white font-semibold rounded-xl text-xs">
            Add Farm Plot
          </a>
        </div>
      ) : (
        <SoilAnalysisForm
          farms={farms}
          onSubmit={(data) => {
            setErrorMsg('');
            mutation.mutate(data);
          }}
          isSubmitting={mutation.isPending}
        />
      )}

      {activeResult && (
        <SoilAnalysisResult
          result={activeResult.analysis_result}
          farmId={activeResult.farm_id}
        />
      )}
    </div>
  );
}

export default SoilAnalysisPage;
