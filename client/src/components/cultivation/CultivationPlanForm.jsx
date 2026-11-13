// client/src/components/cultivation/CultivationPlanForm.jsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { IRRIGATION_TYPES } from '../../constants/indianAgri.js';

export function CultivationPlanForm({ farms = [], defaultCrop = '', defaultFarmId = '', onSubmit, isSubmitting = false }) {
  const todayStr = new Date().toISOString().split('T')[0];

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      farmId: defaultFarmId || farms[0]?.id || '',
      cropName: defaultCrop || '',
      landArea: farms[0]?.land_area || '',
      areaUnit: farms[0]?.area_unit || 'acre',
      sowingDate: todayStr,
      irrigationType: farms[0]?.irrigation_type || 'drip_system',
      preferredPlanLanguage: 'en',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Generate Cultivation Operational Schedule</h3>
        <p className="text-xs text-gray-500 mt-0.5">Create a full agronomic calendar from land prep to harvest</p>
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
          <label className="block text-xs font-semibold text-gray-700 mb-1">Crop Name *</label>
          <input
            type="text"
            placeholder="e.g. Wheat, Rice, Cotton, Tomato, Chickpea..."
            {...register('cropName', { required: 'Crop name is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.cropName && <p className="text-rose-500 text-xs mt-1">{errors.cropName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Cultivation Area *</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 3.0"
              {...register('landArea', { required: 'Area is required', valueAsNumber: true })}
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

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Planned Sowing / Transplant Date *</label>
          <input
            type="date"
            {...register('sowingDate', { required: 'Sowing date is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Irrigation Method</label>
          <select
            {...register('irrigationType')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {IRRIGATION_TYPES.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Language for Plan</label>
          <select
            {...register('preferredPlanLanguage')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="te">Telugu (తెలుగు)</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting || farms.length === 0}
          className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Generating 6-Stage Timeline...' : 'Generate Full Cultivation Plan'}
        </button>
      </div>
    </form>
  );
}

