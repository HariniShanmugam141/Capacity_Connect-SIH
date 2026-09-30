import React, { useState } from 'react';
import { usePlatform } from '../PlatformContext';
import {
  Users, Shield, UserCog, Search, Filter, CheckCircle2,
  AlertTriangle, ShieldCheck, Mail, Building
} from 'lucide-react';
import { UserRole } from '../types';

export const AdminRoleManagement: React.FC = () => {
  const { userRoster, updateUserRole, updateUserStatus } = usePlatform();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  const filteredUsers = userRoster.filter(usr => {
    const matchesRole = roleFilter === 'ALL' || usr.role === roleFilter;
    const matchesSearch =
      usr.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usr.department.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Clean Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <UserCog size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Roles Directory</h1>
            <p className="text-xs text-slate-500">Manage user roles and permissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-100">
            {userRoster.length} Accounts
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search account name, email or cohort..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border rounded-xl bg-gray-50 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border rounded-xl bg-gray-50 font-medium outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="TRAINEE">Trainees</option>
            <option value="TRAINER">Trainers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* User Roster Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">User Account</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Cohort / Department</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4 pl-6">
                    <div>
                      <span className="font-bold text-gray-900 block text-sm">{u.fullName}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Mail size={12} /> {u.email}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : u.role === 'TRAINER'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {u.role === 'ADMIN' && <Shield size={12} />}
                      {u.role === 'TRAINER' && <UserCog size={12} />}
                      {u.role === 'TRAINEE' && <CheckCircle2 size={12} />}
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4 text-gray-700 font-medium">
                    {u.department}
                  </td>

                  <td className="p-4 text-gray-500">
                    {u.joinDate}
                  </td>

                  <td className="p-4">
                    <select
                      value={u.status}
                      onChange={e => updateUserStatus(u.id, e.target.value as any)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border outline-none ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : u.status === 'Pending Approval'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Approval">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>

                  <td className="p-4 text-center">
                    <select
                      value={u.role}
                      onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                      className="px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/50 text-indigo-700 text-xs font-bold outline-none cursor-pointer hover:bg-indigo-100 transition"
                    >
                      <option value="TRAINEE">Set as Trainee</option>
                      <option value="TRAINER">Set as Trainer</option>
                      <option value="ADMIN">Set as Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
