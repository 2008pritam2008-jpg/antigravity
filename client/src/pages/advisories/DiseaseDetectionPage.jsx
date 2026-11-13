// client/src/pages/advisories/DiseaseDetectionPage.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { DiseaseDetectionForm } from '../../components/disease/DiseaseDetectionForm.jsx';
import { DiseaseAnalysisResult } from '../../components/disease/DiseaseAnalysisResult.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { AlertCircle } from 'lucide-react';

export function DiseaseDetectionPage() {
  const queryClient = useQueryClient();
  const [activeResult, setActiveResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { data: farmsData, isLoading: farmsLoading } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const mutation = useMutation({
    mutationFn: (formData) => api.analyzeDisease(formData),
    onSuccess: (res) => {
      setActiveResult(res.data);
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Disease detection failed. Ensure the image is under 8 MB.');
    },
  });

  if (farmsLoading) {
    return <LoadingSpinner text="Connecting to pathology services..." />;
  }

  const farms = farmsData?.data || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title="AI Plant Pathology & Pest Scanner"
        subtitle="Upload leaf/plant photographs and symptom descriptions for multimodal diagnosis and IPM remedies"
      />

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <DiseaseDetectionForm
        farms={farms}
        onSubmit={(formData) => {
          setErrorMsg('');
          mutation.mutate(formData);
        }}
        isSubmitting={mutation.isPending}
      />

      {activeResult && (
        <DiseaseAnalysisResult result={activeResult.analysis_result} />
      )}
    </div>
  );
}

export default DiseaseDetectionPage;
