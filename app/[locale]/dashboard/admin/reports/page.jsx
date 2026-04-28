'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';
import { connectDB } from '@/lib/db';

const REASON_LABELS = {
  spam: 'Spam', fake: 'Faux', inappropriate: 'Inapproprié',
  wrong_info: 'Mauvaise info', expired: 'Expiré', other: 'Autre',
};

const STATUS_VARIANT = { pending: 'warning', reviewed: 'info', resolved: 'success', dismissed: 'default' };

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/reports')
      .then(({ data }) => setReports(data.reports || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function updateReport(id, status) {
    try {
      await axios.patch(`/api/admin/reports/${id}`, { status });
      setReports((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      toast.success('Statut mis à jour');
    } catch { toast.error('Erreur'); }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Signalements</h1>
          <p className="text-gray-500 text-sm mt-1">
            {reports.filter((r) => r.status === 'pending').length} en attente
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
        ) : reports.length === 0 ? (
          <EmptyState icon="🚨" title="Aucun signalement" description="Aucun signalement pour le moment" />
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report._id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant={STATUS_VARIANT[report.status] || 'default'}>{report.status}</Badge>
                      <Badge variant="warning">{REASON_LABELS[report.reason] || report.reason}</Badge>
                      <span className="text-xs text-gray-400">Cible : {report.targetType}</span>
                    </div>
                    {report.description && <p className="text-sm text-gray-600 dark:text-gray-400">{report.description}</p>}
                    <p className="text-xs text-gray-400 mt-2">{formatDate(report.createdAt)}</p>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => updateReport(report._id, 'resolved')} className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100" title="Résoudre">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button onClick={() => updateReport(report._id, 'dismissed')} className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100" title="Ignorer">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
