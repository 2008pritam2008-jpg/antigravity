// client/src/components/farms/FarmForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  INDIAN_STATES_DISTRICTS,
  SOIL_TYPES,
  IRRIGATION_TYPES,
  WATER_AVAILABILITY,
} from '../../constants/indianAgri.js';

export function FarmForm({ initialData = {}, onSubmit, isSubmitting = false }) {
  const [selectedState, setSelectedState] = useState(initialData.state || 'Maharashtra');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      farmName: initialData.farm_name || initialData.farmName || '',
      state: initialData.state || 'Maharashtra',
      district: initialData.district || 'Nashik',
      village: initialData.village || '',
      latitude: initialData.latitude || '',
      longitude: initialData.longitude || '',
      landArea: initialData.land_area || initialData.landArea || '',
      areaUnit: initialData.area_unit || initialData.areaUnit || 'acre',
      soilType: initialData.soil_type || initialData.soilType || 'black soil',
      soilPh: initialData.soil_ph || initialData.soilPh || '',
      nitrogen: initialData.nitrogen || '',
      phosphorus: initialData.phosphorus || '',
      potassium: initialData.potassium || '',
      organicCarbon: initialData.organic_carbon || initialData.organicCarbon || '',
      electricalConductivity: initialData.electrical_conductivity || initialData.electricalConductivity || '',
      irrigationType: initialData.irrigation_type || initialData.irrigationType || 'drip_system',
      waterAvailability: initialData.water_availability || initialData.waterAvailability || 'abundant',
      notes: initialData.notes || '',
    },
  });

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    setValue('state', newState);
    const districts = INDIAN_STATES_DISTRICTS[newState] || [];
    if (districts.length > 0) {
      setValue('district', districts[0]);
    }
  };

  const districts = INDIAN_STATES_DISTRICTS[selectedState] || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-900">Farm Location & Land Dimensions</h3>
        <p className="text-xs text-gray-500 mt-0.5">Specify geographic jurisdiction and measured acreage</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Farm / Plot Name *</label>
          <input
            type="text"
            placeholder="e.g. Ganga Acre South"
            {...register('farmName', { required: 'Farm name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.farmName && <p className="text-rose-500 text-xs mt-1">{errors.farmName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
          <select
            {...register('state', { required: 'State is required' })}
            onChange={handleStateChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {Object.keys(INDIAN_STATES_DISTRICTS).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">District *</label>
          <select
            {...register('district', { required: 'District is required' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Village / Locality (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Sinnar, Pimpalgaon"
            {...register('village')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Land Area *</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              min="0.1"
              placeholder="e.g. 5.0"
              {...register('landArea', { required: 'Area size is required', valueAsNumber: true })}
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
          {errors.landArea && <p className="text-rose-500 text-xs mt-1">{errors.landArea.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">GPS Coordinates (Lat / Lng for live weather)</label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.0001"
              placeholder="Latitude (e.g. 19.99)"
              {...register('latitude', { valueAsNumber: true })}
              className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Longitude (e.g. 73.78)"
              {...register('longitude', { valueAsNumber: true })}
              className="w-1/2 px-3 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-agri-green"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-gray-100 pb-4 pt-2">
        <h3 className="text-lg font-bold text-gray-900">Soil & Irrigation Taxonomy</h3>
        <p className="text-xs text-gray-500 mt-0.5">Enter existing soil laboratory parameters if tested</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Soil Classification *</label>
          <select
            {...register('soilType')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {SOIL_TYPES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Soil pH (0 - 14)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="14"
            placeholder="e.g. 6.8"
            {...register('soilPh', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Irrigation System *</label>
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
          <label className="block text-xs font-semibold text-gray-700 mb-1">Available Nitrogen (N kg/ha)</label>
          <input
            type="number"
            step="1"
            placeholder="e.g. 240"
            {...register('nitrogen', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Available Phosphorus (P kg/ha)</label>
          <input
            type="number"
            step="1"
            placeholder="e.g. 28"
            {...register('phosphorus', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Available Potassium (K kg/ha)</label>
          <input
            type="number"
            step="1"
            placeholder="e.g. 190"
            {...register('potassium', { valueAsNumber: true })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Water Reliability *</label>
          <select
            {...register('waterAvailability')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {WATER_AVAILABILITY.map((w) => (
              <option key={w.value} value={w.value}>{w.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">Agronomic Notes & History</label>
          <input
            type="text"
            placeholder="Previous crop, drainage issues, salinity notes..."
            {...register('notes')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Saving Farm Plot...' : 'Save Farm Plot'}
        </button>
      </div>
    </form>
  );
}
