import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client.js';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import AlertBanner from '../../components/common/AlertBanner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import CultivationTimeline from '../../components/cultivation/CultivationTimeline.jsx';
import { ArrowLeft, Calendar, MapPin, Sprout, CheckCircle2, Clock, AlertTriangle, Leaf, ChevronDown, ChevronUp } from 'lucide-react';

export default function PlanDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const { data: planRes, isLoading, error } = useQuery({
    queryKey: ['cultivation-plan', id],
    queryFn: () => api.getCultivationPlanById(id),
  });

  const taskMutation = useMutation({
    mutationFn: ({ taskId, status }) => api.updateTaskStatus(id, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cultivation-plan', id] });
    },
  });

  const handleToggleTask = (taskId, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    taskMutation.mutate({ taskId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <AlertBanner type="error" message={error?.message || 'Failed to load cultivation plan.'} />
      </div>
    );
  }

  const planData = planRes?.data || planRes;
  if (!planData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6">
        <EmptyState icon={Sprout} title="Plan Not Found" description="This cultivation plan could not be found." />
      </div>
    );
  }

  const totalTasks = planData.tasks?.length || 0;
  const completedTasks = planData.tasks?.filter((t) => t.status === 'completed').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by phase
  const phases = {};
  (planData.tasks || []).forEach((task) => {
    const phase = task.phase || 'General';
    if (!phases[phase]) phases[phase] = [];
    phases[phase].push(task);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <Link
        to="/cultivation-plans"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Plans
      </Link>

      <PageHeader
        title={planData.plan_name || planData.crop_name || 'Cultivation Plan'}
        subtitle={`Crop cycle plan for ${planData.crop_name || 'your farm'}`}
      />

      {/* Plan Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-green-100 rounded-lg">
            <Sprout className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Crop</p>
            <p className="text-sm font-semibold text-gray-800">{planData.crop_name || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Season</p>
            <p className="text-sm font-semibold text-gray-800">{planData.season || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-amber-100 rounded-lg">
            <MapPin className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Farm / Location</p>
            <p className="text-sm font-semibold text-gray-800">{planData.farm_name || planData.location || 'Plot A'}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Clock className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Duration</p>
            <p className="text-sm font-semibold text-gray-800">{planData.duration || planData.total_duration || '120 Days'}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">Overall Execution Progress</h3>
          <span className="text-sm font-medium text-green-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{completedTasks} of {totalTasks} stage tasks completed</p>
      </div>

      {/* Timeline Component */}
      {planData.timeline && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-800 mb-4">Stage-Wise Timeline</h3>
          <CultivationTimeline plan={planData} />
        </div>
      )}

      {/* Task Phases */}
      {Object.keys(phases).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Actionable Checklist</h3>
          {Object.entries(phases).map(([phase, tasks]) => (
            <div key={phase} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedPhase(expandedPhase === phase ? null : phase)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">{phase}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {tasks.filter((t) => t.status === 'completed').length}/{tasks.length}
                  </span>
                </div>
                {expandedPhase === phase ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              {(expandedPhase === null || expandedPhase === phase) && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {tasks.map((task) => (
                    <div key={task.id || task.task_name} className="flex items-start gap-3 p-4 hover:bg-gray-50">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id, task.status)}
                        disabled={taskMutation.isPending}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-green-500 transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium ${
                            task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'
                          }`}
                        >
                          {task.task_name || task.title || task.name}
                        </p>
                        {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                        {task.due_date && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {task.due_date}
                          </p>
                        )}
                      </div>
                      {task.priority === 'high' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* AI Recommendations */}
      {planData.ai_recommendations && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Leaf className="w-4 h-4" /> AI Advisory & Best Practices
          </h3>
          <p className="text-sm text-green-800 whitespace-pre-wrap leading-relaxed">
            {typeof planData.ai_recommendations === 'string'
              ? planData.ai_recommendations
              : JSON.stringify(planData.ai_recommendations, null, 2)}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Agricultural Advisory Notice:</strong> This cultivation schedule is generated based on standard agronomic practices and user inputs. Real-world conditions such as erratic rainfall, pest outbreaks, or localized weather fluctuations may require adjusting your irrigation, fertilizer schedule, or harvest timing.
        </p>
      </div>
    </div>
  );
}

