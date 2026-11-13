// client/src/components/disease/DiseaseDetectionForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PLANT_PARTS } from '../../constants/indianAgri.js';
import { UploadCloud, Image as ImageIcon, X, Camera } from 'lucide-react';

export function DiseaseDetectionForm({ farms = [], onSubmit, isSubmitting = false }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      farmId: farms[0]?.id || '',
      cropName: '',
      growthStage: '',
      affectedPart: 'leaf',
      symptoms: '',
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setFileError('');
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setFileError('Invalid format. Please upload JPG, PNG, or WEBP image.');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFileError('Image exceeds the maximum 8 MB size limit.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError('');
  };

  const handleFormSubmit = (data) => {
    const formData = new FormData();
    if (data.farmId) formData.append('farmId', data.farmId);
    formData.append('cropName', data.cropName);
    if (data.growthStage) formData.append('growthStage', data.growthStage);
    formData.append('affectedPart', data.affectedPart);
    formData.append('symptoms', data.symptoms);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-100 pb-3">
        <h3 className="text-lg font-bold text-gray-900">Crop Disease & Pest Diagnosis Lab</h3>
        <p className="text-xs text-gray-500 mt-0.5">Upload a photo of the affected plant tissue and describe field symptoms</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Crop Under Inspection *</label>
          <input
            type="text"
            placeholder="e.g. Tomato, Cotton, Wheat, Chilli..."
            {...register('cropName', { required: 'Crop name is required', minLength: { value: 2, message: 'Minimum 2 characters' } })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
          {errors.cropName && <p className="text-rose-500 text-xs mt-1">{errors.cropName.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Affected Plant Part *</label>
          <select
            {...register('affectedPart', { required: 'Please select affected plant part' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            {PLANT_PARTS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Associated Farm Plot (Optional)</label>
          <select
            {...register('farmId')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          >
            <option value="">Unlinked / Ad-hoc Query</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>{f.farm_name} ({f.district})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Current Growth Stage (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Flowering, Vegetative, Pod development..."
            {...register('growthStage')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
          />
        </div>
      </div>

      {/* Image Uploader */}
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
          Plant / Leaf Photograph (JPG, PNG, WEBP — Max 8 MB)
        </label>

        {!previewUrl ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-agri-green rounded-2xl p-6 cursor-pointer bg-gray-50/50 hover:bg-forest-50/20 transition">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <span className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</span>
            <span className="text-xs text-gray-500 mt-0.5">Take clear close-up of leaf lesions or stem discoloration</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative inline-block border rounded-xl overflow-hidden shadow-sm">
            <img src={previewUrl} alt="Inspection preview" className="max-h-56 w-auto object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {fileError && <p className="text-rose-500 text-xs mt-1.5 font-medium">{fileError}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Detailed Field Symptoms * (Min 10 characters)
        </label>
        <textarea
          rows="3"
          placeholder="Describe discoloration, lesions, leaf curling, wilting, powdery mildew, insect holes, or progression rate..."
          {...register('symptoms', {
            required: 'Please describe the symptoms observed',
            minLength: { value: 10, message: 'Please describe symptoms in at least 10 characters' },
          })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-agri-green"
        />
        {errors.symptoms && <p className="text-rose-500 text-xs mt-1">{errors.symptoms.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Analyzing Pathology with Gemini Vision...' : 'Diagnose Plant Pathology'}
        </button>
      </div>
    </form>
  );
}

