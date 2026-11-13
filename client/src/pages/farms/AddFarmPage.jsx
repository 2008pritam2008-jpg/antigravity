// client/src/pages/farms/AddFarmPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { FarmForm } from '../../components/farms/FarmForm.jsx';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export function AddFarmPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState('');

  const mutation = useMutation({
    mutationFn: (formData) => api.createFarm(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      navigate('/farms');
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to create farm plot.');
    },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link to="/farms" className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-green hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Plots
        </Link>
        <PageHeader
          title="Register New Land / Farm Plot"
          subtitle="Enter geographic boundaries, soil test results, and water facilities"
        />
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <FarmForm onSubmit={(data) => mutation.mutate(data)} isSubmitting={mutation.isPending} />
    </div>
  );
}

export default AddFarmPage;
