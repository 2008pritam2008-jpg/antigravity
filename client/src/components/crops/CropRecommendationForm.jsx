// client/src/components/crops/CropRecommendationForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { AGRICULTURAL_SEASONS } from '../../constants/indianAgri.js';

export function CropRecommendationForm({ farms = [], onSubmit, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      farmId: farms[0]?.id || '',
      season: 'Kharif',
      targetCultivationArea: farms[0]?.land_area || '',
      preferredCategory: '',
      budgetInr: '',
      additionalRequirements: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Crop Suitability Advisory Input</h3>
        <p className="text-xs text-gray-500 mt-0.5">Select a farm plot and target cultivation parameters for AI evaluation</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Target Farm Plot *</label>
          <select
            {...register('farmId', { required: 'Please select a farm plot' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.farm_name} ({f.district}, {f.state} · {f.land_area} {f.area_unit})
              </option>
            ))}
          </select>
          {errors.farmId && <p className="text-rose-500 text-xs mt-1">{errors.farmId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Upcoming Season *</label>
          <select
            {...register('season', { required: 'Season is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {AGRICULTURAL_SEASONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Cultivation Area (Acres)</label>
          <input
            type="number"
            step="0.1"
            placeholder="e.g. 3.0"
            {...register('targetCultivationArea', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Target Budget in INR (Optional)</label>
          <input
            type="number"
            placeholder="e.g. 45000"
            {...register('budgetInr', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Crop Category (Optional)</label>
          <select
            {...register('preferredCategory')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            <option value="">Any Category (Optimal Selection)</option>
            <option value="cereals">Cereals & Millets</option>
            <option value="pulses">Pulses & Legumes</option>
            <option value="oilseeds">Oilseeds</option>
            <option value="commercial">Commercial / Cash Crops</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits & Plantation</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Specific Constraints or Preferences</label>
          <input
            type="text"
            placeholder="e.g. Low water requirement, high market demand..."
            {...register('additionalRequirements')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>
      </div>

      <div className="flex justify-end pt-3">
        <button
          type="submit"
          disabled={isSubmitting || farms.length === 0}
          className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Evaluating Soil & Climate with Gemini...' : 'Generate Crop Recommendations'}
        </button>
      </div>
    </form>
  );
}
