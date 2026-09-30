import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  UserCheck, Check, X, ShieldAlert, Clock, Filter,
  Search, AlertCircle, Sparkles, Building, Mail, Award
} from 'lucide-react';

export const AdminUserApproval: React.FC = () => {
  const { userApprovals, approveUser, rejectUser } = usePlatform();
  const [filterRole, setFilterRole] = useState<'ALL' | 'TRAINEE' | 'TRAINER'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApprovals = userApprovals.filter(item => {
    const matchesRole = filterRole === 'ALL' || item.requestedRole === filterRole;
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesStatus && matchesSearch;
  });

  const pendingCount = userApprovals.filter(a => a.status === 'Pending').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              User Approvals
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify credentials and approve onboarding requests
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-amber-50 text-amber-800 font-semibold text-xs rounded-full border border-amber-200">
            {pendingCount} Pending
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search candidate name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl bg-gray-50 focus:bg-white outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-gray-500">Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="px-2.5 py-1.5 border rounded-lg bg-gray-50 text-xs font-semibold"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending">Pending Only</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-gray-500">Requested Role:</span>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value as any)}
              className="px-2.5 py-1.5 border rounded-lg bg-gray-50 text-xs font-semibold"
            >
              <option value="ALL">All Roles</option>
              <option value="TRAINEE">Trainee</option>
              <option value="TRAINER">Trainer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Approvals Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApprovals.map(candidate => (
          <div
            key={candidate.id}
            className={`bg-white rounded-2xl p-6 shadow-sm border transition flex flex-col justify-between ${
              candidate.status === 'Pending'
                ? 'border-amber-200 hover:border-amber-300'
                : candidate.status === 'Approved'
                ? 'border-emerald-100'
                : 'border-rose-100 opacity-75'
            }`}
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  candidate.requestedRole === 'TRAINER'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  Requested: {candidate.requestedRole}
                </span>

                <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                  candidate.status === 'Pending'
                    ? 'bg-amber-100 text-amber-800'
                    : candidate.status === 'Approved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {candidate.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base text-gray-900">{candidate.fullName}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <Mail size={12} className="text-gray-400" />
                  {candidate.email}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs border border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Building size={13} className="text-gray-400 shrink-0" />
                  <span className="font-medium truncate">{candidate.organizationOrDegree}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Award size={13} className="text-indigo-600 shrink-0" />
                  <span className="font-semibold">{candidate.domain}</span>
                </div>
              </div>

              {candidate.approvalNotes && (
                <p className="text-xs text-gray-500 italic bg-white p-2 rounded-lg border border-gray-100">
                  "{candidate.approvalNotes}"
                </p>
              )}

              <div className="text-[11px] text-gray-400">
                Applied on: {candidate.registeredDate}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-2">
              {candidate.status === 'Pending' ? (
                <>
                  <button
                    onClick={() => approveUser(candidate.id, 'Verified and approved by admin.')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <Check size={14} /> Approve User
                  </button>
                  <button
                    onClick={() => rejectUser(candidate.id, 'Documentation criteria not fulfilled.')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition border border-rose-200"
                  >
                    <X size={14} /> Reject
                  </button>
                </>
              ) : (
                <div className="w-full text-center text-xs font-semibold text-gray-400 py-1">
                  Status Resolved: {candidate.status}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
