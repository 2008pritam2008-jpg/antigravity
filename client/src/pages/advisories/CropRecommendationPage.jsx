// client/src/pages/advisories/CropRecommendationPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { CropRecommendationForm } from '../../components/crops/CropRecommendationForm.jsx';
import { CropRecommendationCard } from '../../components/crops/CropRecommendationCard.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { AlertCircle, ShieldCheck } from 'lucide-react';

export function CropRecommendationPage() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const preselectedFarmId = location.state?.farmId;

  const [activeResult, setActiveResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: farmsData, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const mutation = useMutation({
    mutationFn: (payload) => api.generateCropRecommendation(payload),
    onSuccess: (res) => {
      setActiveResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Crop recommendation failed. Please check inputs.');
    },
  });

  if (farmsLoading) {
    return <LoadingSpinner text="Checking registered farm plots..." />;
  }

  const farms = farmsData?.data || [];
  const recommendationList = activeResult?.recommendation_result?.recommendations || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="AI Crop Selection & Suitability Advisory"
        subtitle="Ranked crop recommendations grounded in your soil chemistry, monsoon season, and irrigation"
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
          <p className="text-xs opacity-90 mt-1 mb-4">Please register a farm plot first so the AI can evaluate your specific soil and location parameters.</p>
          <a href="/farms/new" className="px-4 py-2 bg-amber-700 text-white font-semibold rounded-xl text-xs">
            Add Farm Plot
          </a>
        </div>
      ) : (
        <CropRecommendationForm
          farms={farms}
          onSubmit={(data) => {
            setErrorMsg('');
            mutation.mutate(data);
          }}
          isSubmitting={mutation.isPending}
        />
      )}

      {/* Advisory Result Cards */}
      {recommendationList.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Evaluated Recommendations ({activeResult?.season})
            </h3>
            <span className="text-xs text-gray-500">
              Model: {activeResult?.model_name || 'Gemini 2.5'}
            </span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed bg-forest-50 p-3.5 rounded-xl border border-forest-100">
            {activeResult?.recommendation_result?.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recommendationList.map((rec, idx) => (
              <CropRecommendationCard
                key={idx}
                recommendation={rec}
                farmId={activeResult?.farm_id}
              />
            ))}
          </div>

          <div className="text-[11px] text-gray-400 italic pt-2 flex items-start gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>{activeResult?.recommendation_result?.disclaimer || 'AI suitability ratings are indicative assessments based on soil and seasonal rules. Actual yields depend on microclimate and farm management.'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CropRecommendationPage;
