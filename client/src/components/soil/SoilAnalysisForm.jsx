// client/src/components/soil/SoilAnalysisForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { SOIL_TYPES } from '../../constants/indianAgri.js';

export function SoilAnalysisForm({ farms = [], onSubmit, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      farmId: farms[0]?.id || '',
      soilType: farms[0]?.soil_type || 'black soil',
      soilPh: farms[0]?.soil_ph || '',
      nitrogen: farms[0]?.nitrogen || '',
      phosphorus: farms[0]?.phosphorus || '',
      potassium: farms[0]?.potassium || '',
      organicCarbon: farms[0]?.organic_carbon || '',
      electricalConductivity: farms[0]?.electrical_conductivity || '',
      targetCrop: '',
      additionalObservations: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Soil Health Test Parameters</h3>
        <p className="text-xs text-gray-500 mt-0.5">Enter laboratory Soil Health Card values or visual field test indicators</p>
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
                {f.farm_name} ({f.district}, {f.state})
              </option>
            ))}
          </select>
          {errors.farmId && <p className="text-rose-500 text-xs mt-1">{errors.farmId.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Soil Classification *</label>
          <select
            {...register('soilType', { required: 'Soil type is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {SOIL_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Soil pH (0 - 14 scale)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            placeholder="e.g. 6.8 (Neutral) or 5.5 (Acidic)"
            {...register('soilPh', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Target Planned Crop (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Cotton, Wheat, Tomato..."
            {...register('targetCrop')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Available Nitrogen - N (kg/ha)</label>
          <input
            type="number"
            placeholder="e.g. 210"
            {...register('nitrogen', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Available Phosphorus - P (kg/ha)</label>
          <input
            type="number"
            placeholder="e.g. 22"
            {...register('phosphorus', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Available Potassium - K (kg/ha)</label>
          <input
            type="number"
            placeholder="e.g. 185"
            {...register('potassium', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Organic Carbon (%)</label>
          <input
            type="number"
            step="0.01"
            placeholder="e.g. 0.55"
            {...register('organicCarbon', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Field Observations / Soil Symptoms</label>
          <textarea
            rows="2"
            placeholder="e.g. Slow drainage, white salt crusts on ridges, crusting after rain..."
            {...register('additionalObservations')}
            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || farms.length === 0}
          className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Analyzing Soil Parameters...' : 'Analyze Soil Health'}
        </button>
      </div>
    </form>
  );
}

