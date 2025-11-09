import React, { useState, useMemo } from 'react';
import { User, UserRole, Activity, ActivityStatus, TransactionType } from '../types';
import { ACTIVITY_REWARDS } from '../constants';

interface ActivityFeedProps {
  user: User;
  activities: Activity[];
  onSubmit: (activityData: Omit<Activity, 'id' | 'status' | 'submittedAt' | 'userId' | 'userName'>) => void;
  onVerify: (activityId: string, newStatus: ActivityStatus.Approved | ActivityStatus.Rejected) => void;
}

const EARN_CATEGORIES = Object.values(TransactionType).filter(t => Object.keys(ACTIVITY_REWARDS).includes(t));

const StatusBadge: React.FC<{ status: ActivityStatus }> = ({ status }) => {
  const styles = {
    [ActivityStatus.Pending]: 'bg-yellow-500/20 text-yellow-300',
    [ActivityStatus.Approved]: 'bg-green-500/20 text-green-300',
    [ActivityStatus.Rejected]: 'bg-red-500/20 text-red-300',
  };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

const ActivityFeed: React.FC<ActivityFeedProps> = ({ user, activities, onSubmit, onVerify }) => {

  // --- Student View State & Logic ---
  const [activityType, setActivityType] = useState<TransactionType>(EARN_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [submitError, setSubmitError] = useState('');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setSubmitError('Description cannot be empty.');
      return;
    }
    onSubmit({ type: activityType, description });
    setDescription('');
    setSubmitError('');
  };

  const studentActivities = useMemo(() =>
    activities.filter(a => a.userId === user.id),
  [activities, user.id]);

  // --- Faculty View State & Logic ---
  const pendingActivities = useMemo(() =>
    activities.filter(a => a.status === ActivityStatus.Pending),
  [activities]);


  if (user.role === UserRole.Student) {
    return (
      <div className="p-8 animate-fade-in space-y-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Activity Feed</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Submit an Activity</h2>
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label htmlFor="activityType" className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                  <select
                    id="activityType"
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as TransactionType)}
                    className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {EARN_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder={`Describe your activity...\nE.g., "Mentored a junior student in React for 5 hours."`}
                        className="w-full bg-slate-700 p-2 rounded-md border border-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                {submitError && <p className="text-sm text-red-400">{submitError}</p>}
                <button type="submit" className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md font-semibold transition-colors">Submit for Verification</button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Your Submissions</h2>
            <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
                {studentActivities.length > 0 ? studentActivities.map(activity => (
                    <div key={activity.id} className="bg-slate-800 p-4 rounded-md">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-300">{activity.type}</p>
                                <p className="text-sm text-slate-400">{activity.description}</p>
                            </div>
                            <StatusBadge status={activity.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-right">{activity.submittedAt.toLocaleDateString()}</p>
                    </div>
                )) : (
                    <div className="text-center py-16 text-slate-500">You haven't submitted any activities yet.</div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Faculty View ---
  return (
     <div className="p-8 animate-fade-in space-y-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">Activity Verification Feed</h1>
        <p className="text-slate-400">Review and verify student-submitted activities to award Time Credits.</p>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold">Pending Submissions ({pendingActivities.length})</h2>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">
                {pendingActivities.length > 0 ? (
                    <ul className="divide-y divide-slate-700">
                        {pendingActivities.map(activity => (
                             <li key={activity.id} className="p-4 hover:bg-slate-800">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div className="md:col-span-2">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-semibold text-white">{activity.userName}</span>
                                            <span className="text-sm text-slate-500">({activity.userId})</span>
                                        </div>
                                        <p className="text-sm font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full inline-block mb-2">
                                            {activity.type} (+{ACTIVITY_REWARDS[activity.type]} TC)
                                        </p>
                                        <p className="text-slate-400 text-sm">{activity.description}</p>
                                    </div>
                                    <div className="flex items-center justify-end gap-3">
                                        <button onClick={() => onVerify(activity.id, ActivityStatus.Rejected)} className="px-4 py-2 bg-red-600/20 text-red-300 hover:bg-red-600/40 rounded-md font-semibold text-sm transition-colors">
                                            Reject
                                        </button>
                                        <button onClick={() => onVerify(activity.id, ActivityStatus.Approved)} className="px-4 py-2 bg-green-600/20 text-green-300 hover:bg-green-600/40 rounded-md font-semibold text-sm transition-colors">
                                            Approve
                                        </button>
                                    </div>
                                </div>
                                 <p className="text-xs text-slate-500 mt-2 text-right">{activity.submittedAt.toLocaleString()}</p>
                             </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <p className="font-semibold text-lg">All caught up!</p>
                        <p>There are no pending activities to review.</p>
                    </div>
                )}
            </div>
        </div>
     </div>
  );
};

export default ActivityFeed;
