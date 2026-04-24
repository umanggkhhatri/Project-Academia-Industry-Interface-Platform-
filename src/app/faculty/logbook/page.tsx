'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DashboardSidebar, { SidebarItem } from '@/components/layout/DashboardSidebar';
import { NotebookPen, CheckCircle2, AlertTriangle, RotateCcw, FileDown, Printer, Filter, Loader2 } from 'lucide-react';

type ReviewStatus = 'Pending' | 'Approved' | 'Needs Changes';

type LogEntry = {
  _id: string;
  studentUid: string;
  date: string;
  title: string;
  hours: number;
  notes?: string;
  tags?: string[];
  status?: ReviewStatus;
  reviewNote?: string;
};

export default function FacultyLogbookPage() {
  const { user } = useAuth();
  const isAuthed = user?.role === 'faculty';

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'All'>('All');
  const [toast, setToast] = useState<string | null>(null);

  const sidebarItems = useMemo<SidebarItem[]>(() => [
    { label: 'Dashboard/Home', href: '/faculty/dashboard', icon: <NotebookPen className="h-5 w-5" /> },
    { label: 'Profile Settings', href: '/faculty/profile', icon: <NotebookPen className="h-5 w-5" /> },
  ], []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // ── Fetch ALL students' logbook entries ───────────────────────────────────
  const fetchEntries = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const url = statusFilter === 'All' ? '/api/logbook?all=true' : `/api/logbook?all=true&status=${encodeURIComponent(statusFilter)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch logbook entries');
      const json = await res.json();
      setEntries(Array.isArray(json.entries) ? json.entries : []);
    } catch { setError('Could not load logbook entries. Please try again.'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { if (isAuthed) fetchEntries(); }, [isAuthed, fetchEntries]);

  // ── Faculty review actions ────────────────────────────────────────────────
  const updateEntry = async (id: string, patch: Partial<{ status: ReviewStatus; reviewNote: string; reviewedBy: string }>) => {
    try {
      const res = await fetch(`/api/logbook?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...patch, reviewedBy: user?.uid }),
      });
      if (!res.ok) throw new Error('Update failed');
      const json = await res.json();
      // Optimistic local update
      setEntries(prev => prev.map(e => e._id === id ? { ...e, ...json.entry } : e));
    } catch { showToast('Failed to update entry'); }
  };

  const setStatus = async (id: string, status: ReviewStatus) => {
    await updateEntry(id, { status });
    showToast(`Marked as ${status}`);
  };

  const setReviewNote = (id: string, note: string) => {
    // Debounced local update; persisted on blur
    setEntries(prev => prev.map(e => e._id === id ? { ...e, reviewNote: note } : e));
  };

  const persistReviewNote = async (id: string, note: string) => {
    await updateEntry(id, { reviewNote: note });
  };

  const resetStatus = async (id: string) => {
    await updateEntry(id, { status: 'Pending', reviewNote: '' });
    setEntries(prev => prev.map(e => e._id === id ? { ...e, status: 'Pending', reviewNote: '' } : e));
    showToast('Reset to Pending');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ reviewed: entries }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'reviewed-logbook.json'; a.click(); URL.revokeObjectURL(url);
  };

  const counts = {
    total: entries.length,
    approved: entries.filter(e => e.status === 'Approved').length,
    changes: entries.filter(e => e.status === 'Needs Changes').length,
    pending: entries.filter(e => (e.status ?? 'Pending') === 'Pending').length,
  };

  if (!isAuthed) return (
    <div className="max-w-3xl mx-auto p-6"><Card className="p-4"><p className="text-[#1A1A1A]">Please login as Faculty to review logbooks.</p></Card></div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <DashboardSidebar title="Faculty Menu" items={sidebarItems} footerLinks={[
            { label: 'Logbook', href: '/faculty/logbook' },
            { label: 'Report Generator', href: '/faculty/report' },
          ]} />

          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Logbook Review Header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NotebookPen className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                  <h1 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Logbook Review &amp; Approval</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-[#0F3D67] text-white" onClick={exportJSON}><FileDown className="h-4 w-4 mr-1" /> Export JSON</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Print</Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-[#1A1A1A]">
                {[['Total', counts.total], ['Approved', counts.approved], ['Needs Changes', counts.changes], ['Pending', counts.pending]].map(([label, val]) => (
                  <div key={String(label)} className="border rounded-md p-3">
                    <div className="text-sm text-[#555555]">{label}</div>
                    <div className="text-xl font-semibold">{val}</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Filter */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Filters">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-[#333333]">Status Filter</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Filter className="h-4 w-4 text-[#666666]" />
                    <select
                      className="border rounded-md px-2 py-1"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as 'All' | ReviewStatus)}
                    >
                      <option>All</option>
                      <option>Pending</option>
                      <option>Approved</option>
                      <option>Needs Changes</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            {/* Entries */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Entries">
              {loading && <div className="flex items-center gap-2 text-[#555555]"><Loader2 className="h-5 w-5 animate-spin text-[#0F3D67]" /><span>Loading entries…</span></div>}
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-700">{error}</p>
                  <button className="mt-1 text-sm text-red-700 underline" onClick={fetchEntries}>Retry</button>
                </div>
              )}
              {!loading && !error && entries.length === 0 && <p className="text-[#555555]">No entries matching the filter.</p>}
              {!loading && !error && entries.length > 0 && (
                <ul className="space-y-3">
                  {entries.map(e => (
                    <li key={e._id} className="border rounded-md p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-[#555555]">Student UID: {e.studentUid}</div>
                          <div className="text-sm text-[#333333]">{new Date(e.date).toLocaleDateString()}</div>
                          <div className="font-medium text-[#1A1A1A] truncate">{e.title}</div>
                          <div className="text-sm text-[#555555]">Hours: {e.hours}</div>
                          {e.notes && <div className="mt-2 text-sm text-[#555555]">{e.notes}</div>}
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <Button className="bg-[#137B0C] text-white text-xs" onClick={() => setStatus(e._id, 'Approved')}>
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button className="bg-[#B76E00] text-white text-xs" onClick={() => setStatus(e._id, 'Needs Changes')}>
                            <AlertTriangle className="h-4 w-4 mr-1" /> Needs Changes
                          </Button>
                          <Button className="bg-[#666666] text-white text-xs" onClick={() => resetStatus(e._id)}>
                            <RotateCcw className="h-4 w-4 mr-1" /> Reset
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-[#333333]">Review Note</label>
                        <textarea
                          className="mt-1 w-full border rounded-md px-2 py-1"
                          rows={2}
                          value={e.reviewNote || ''}
                          onChange={ev => setReviewNote(e._id, ev.target.value)}
                          onBlur={ev => persistReviewNote(e._id, ev.target.value)}
                          placeholder="Optional note for student"
                        />
                      </div>
                      {e.tags && e.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.tags.map(t => <span key={t} className="inline-block bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-xs">{t}</span>)}
                        </div>
                      )}
                      <div className="mt-2 text-sm text-[#333333]">
                        Status: <span className={`font-medium ${e.status === 'Approved' ? 'text-green-700' : e.status === 'Needs Changes' ? 'text-amber-700' : 'text-[#555555]'}`}>{e.status ?? 'Pending'}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {toast && (
              <div className="fixed bottom-4 right-4 z-50">
                <Card className="bg-[#0F3D67] text-white px-4 py-2 rounded-md" aria-live="polite">{toast}</Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}