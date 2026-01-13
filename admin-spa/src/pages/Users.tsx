import React, { useEffect, useState } from 'react';
import { Icons } from '../constants';
import { apiService } from '../services/api';

type UserRow = { id: string; email: string; role: string; createdAt: string };

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  useEffect(() => {
    apiService.get('/admin/users').then(list => {
      const mapped = list.map((u: any) => ({ id: u.id || u._id, email: u.email, role: u.role, createdAt: u.createdAt }));
      setUsers(mapped);
    }).catch(() => {});
  }, []);
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Team</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage admin users and roles.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 transition-all">
          {Icons.Add}
          Add User
        </button>
      </div>
      <div className="bg-white p-6 rounded-[2rem] border border-brand-divider shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="text-left text-[10px] uppercase tracking-widest font-black text-slate-400 border-b border-brand-divider">
              <th className="pb-4 px-4">User</th>
              <th className="pb-4 px-4">Role</th>
              <th className="pb-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-divider">
            {users.map(u => (
              <tr key={u.id}>
                <td className="py-4 px-4">
                  <p className="text-sm font-bold text-slate-900">{u.email}</p>
                  <p className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleString()}</p>
                </td>
                <td className="py-4 px-4"><span className="text-[10px] font-black px-2 py-1 rounded-lg bg-brand-bg text-slate-500 uppercase">{u.role}</span></td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-colors">
                      {Icons.Edit}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-brand-cta hover:bg-brand-cta/10 rounded-lg transition-colors">
                      {Icons.Delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
