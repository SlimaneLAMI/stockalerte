'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Badge from '@/components/ui/Badge';
import { Search, Loader2, Ban, CheckCircle, Shield } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

const ROLE_VARIANT = { admin: 'danger', merchant: 'info', client: 'default' };

export default function AdminUsersPage() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ]           = useState('');
  const [role, setRole]     = useState('');

  useEffect(() => { fetchUsers(); }, [q, role]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 20 });
      if (q)    params.set('q', q);
      if (role) params.set('role', role);
      const { data } = await axios.get(`/api/admin/users?${params}`);
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  async function handleAction(userId, action) {
    try {
      const { data } = await axios.patch(`/api/admin/users/${userId}`, { action });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, ...data.user } : u));
      toast.success('Action effectuée');
    } catch { toast.error('Erreur'); }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des utilisateurs</h1>
          <p className="text-gray-500 text-sm mt-1">{users.length} résultats</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher..."
              className="input ps-9"
            />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input w-auto">
            <option value="">Tous rôles</option>
            <option value="client">Client</option>
            <option value="merchant">Commerçant</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr className="text-xs text-gray-400">
                    <th className="text-start px-4 py-3 font-medium">Utilisateur</th>
                    <th className="text-start px-4 py-3 font-medium hidden sm:table-cell">Rôle</th>
                    <th className="text-start px-4 py-3 font-medium hidden md:table-cell">Inscrit le</th>
                    <th className="text-start px-4 py-3 font-medium">Statut</th>
                    <th className="text-start px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-semibold text-primary-600 shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-[150px]">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[150px]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant={ROLE_VARIANT[user.role] || 'default'}>{user.role}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        {user.isSuspended ? (
                          <Badge variant="danger">Suspendu</Badge>
                        ) : user.isVerified ? (
                          <Badge variant="success">Vérifié</Badge>
                        ) : (
                          <Badge variant="warning">Non vérifié</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {!user.isVerified && (
                            <button onClick={() => handleAction(user._id, 'verify')} className="p-1.5 rounded hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600" title="Vérifier">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {user.isSuspended ? (
                            <button onClick={() => handleAction(user._id, 'unsuspend')} className="p-1.5 rounded hover:bg-blue-50 text-blue-600" title="Réactiver">
                              <Shield className="w-4 h-4" />
                            </button>
                          ) : (
                            <button onClick={() => { if (confirm('Suspendre cet utilisateur ?')) handleAction(user._id, 'suspend'); }} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Suspendre">
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
