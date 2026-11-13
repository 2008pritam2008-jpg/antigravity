// client/src/components/fertilizer/FertilizerAdvisoryForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { CROP_STAGES } from '../../constants/indianAgri.js';

export function FertilizerAdvisoryForm({ farms = [], onSubmit, isSubmitting = false }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      farmId: farms[0]?.id || '',
      cropName: '',
      growthStage: 'vegetative',
      cultivationArea: farms[0]?.land_area || '',
      areaUnit: farms[0]?.area_unit || 'acre',
      previousApplication: '',
      irrigationAvailability: farms[0]?.irrigation_type || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Nutrient & Fertigation Advisory Input</h3>
        <p className="text-xs text-gray-500 mt-0.5">Generate stage-specific NPK split and integrated organic fertilizer guidance</p>
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
          <label className="block text-xs font-semibold text-gray-700 mb-1">Target Crop *</label>
          <input
            type="text"
            placeholder="e.g. Wheat, Sugarcane, Cotton, Tomato..."
            {...register('cropName', { required: 'Crop name is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.cropName && <p className="text-rose-500 text-xs mt-1">{errors.cropName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Current Crop Growth Stage *</label>
          <select
            {...register('growthStage', { required: 'Growth stage is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {CROP_STAGES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Cultivation Area *</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 2.5"
              {...register('cultivationArea', { required: 'Area is required', valueAsNumber: true })}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
            <select
              {...register('areaUnit')}
              className="w-28 px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
            >
              <option value="acre">Acres</option>
              <option value="hectare">Hectares</option>
            </select>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Previous Fertilizer / Manure Applied (Optional)</label>
          <input
            type="text"
            placeholder="e.g. 50 kg DAP applied at sowing, 2 trolley cow dung manure..."
            {...register('previousApplication')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || farms.length === 0}
          className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Calculating Nutrient Schedule...' : 'Generate Fertilizer Advisory'}
        </button>
      </div>
    </form>
  );
}

