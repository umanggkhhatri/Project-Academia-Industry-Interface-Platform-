'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DashboardSidebar, { SidebarItem } from '@/components/layout/DashboardSidebar';
import { NotebookPen, CheckCircle2, AlertTriangle, RotateCcw, FileDown, Printer, Filter } from 'lucide-react';

type ReviewStatus = 'Pending' | 'Approved' | 'Needs Changes';

type LogEntry = {
  id: string;
  date: string;
  title: string;
  hours: number;
  notes?: string;
  tags?: string[];
  status?: ReviewStatus;
  reviewNote?: string;
};

const STORAGE_KEY = 'student_logbook';

export default function FacultyLogbookPage() {
  const { user } = useAuth();
  const isAuthed = user?.role === 'faculty';

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | 'All'>('All');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as LogEntry[]);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: 'Dashboard/Home', href: '/faculty/dashboard', icon: <NotebookPen className="h-5 w-5" /> },
      { label: 'Profile Settings', href: '/faculty/profile', icon: <NotebookPen className="h-5 w-5" /> },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return entries;
    return entries.filter((e) => (e.status ?? 'Pending') === statusFilter);
  }, [entries, statusFilter]);

  const setStatus = (id: string, status: ReviewStatus) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    setToast(`Marked as ${status}`);
  };

  const setReviewNote = (id: string, note: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, reviewNote: note } : e)));
  };

  const resetStatus = (id: string) => {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: 'Pending', reviewNote: '' } : e)));
    setToast('Reset to Pending');
  };

  const exportJSON = () => {
    const payload = { reviewed: entries };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reviewed-logbook.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    window.print();
  };

  if (!isAuthed) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="p-4">
          <p className="text-[#1A1A1A]">Please login as Faculty to review logbooks.</p>
        </Card>
      </div>
    );
  }

  const counts = {
    total: entries.length,
    approved: entries.filter((e) => e.status === 'Approved').length,
    changes: entries.filter((e) => e.status === 'Needs Changes').length,
    pending: entries.filter((e) => (e.status ?? 'Pending') === 'Pending').length,
  };

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
                  <h1 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Logbook Review & Approval</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-[#0F3D67] text-white" onClick={exportJSON}><FileDown className="h-4 w-4 mr-1" /> Export JSON</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={printPDF}><Printer className="h-4 w-4 mr-1" /> Print</Button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-[#1A1A1A]">
                <div className="border rounded-md p-3"><div>Total</div><div className="text-xl font-semibold">{counts.total}</div></div>
                <div className="border rounded-md p-3"><div>Approved</div><div className="text-xl font-semibold">{counts.approved}</div></div>
                <div className="border rounded-md p-3"><div>Needs Changes</div><div className="text-xl font-semibold">{counts.changes}</div></div>
                <div className="border rounded-md p-3"><div>Pending</div><div className="text-xl font-semibold">{counts.pending}</div></div>
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
                      onChange={(e) => {
                        const v = e.target.value as 'All' | ReviewStatus;
                        setStatusFilter(v);
                      }}
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
              {filtered.length === 0 ? (
                <p className="text-[#555555]">No entries matching the filter.</p>
              ) : (
                <ul className="space-y-3">
                  {filtered.map((e) => (
                    <li key={e.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-[#333333]">{new Date(e.date).toLocaleDateString()}</div>
                          <div className="font-medium text-[#1A1A1A]">{e.title}</div>
                          <div className="text-sm text-[#555555]">Hours: {e.hours}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button className="bg-[#137B0C] text-white" onClick={() => setStatus(e.id, 'Approved')}><CheckCircle2 className="h-4 w-4 mr-1" /> Approve</Button>
                          <Button className="bg-[#B76E00] text-white" onClick={() => setStatus(e.id, 'Needs Changes')}><AlertTriangle className="h-4 w-4 mr-1" /> Needs Changes</Button>
                          <Button className="bg-[#666666] text-white" onClick={() => resetStatus(e.id)}><RotateCcw className="h-4 w-4 mr-1" /> Reset</Button>
                        </div>
                      </div>
                      {e.notes && <div className="mt-2 text-sm text-[#555555]">{e.notes}</div>}
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-[#333333]">Review Note</label>
                        <textarea className="mt-1 w-full border rounded-md px-2 py-1" rows={2} value={e.reviewNote || ''} onChange={(ev) => setReviewNote(e.id, ev.target.value)} placeholder="Optional note for student" />
                      </div>
                      {e.tags && e.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.tags.map((t) => (
                            <span key={t} className="inline-block bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-xs">{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 text-sm text-[#333333]">Status: <span className="font-medium">{e.status ?? 'Pending'}</span></div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Toast */}
            {toast && (
              <div className="fixed bottom-4 right-4">
                <Card className="bg-[#0F3D67] text-white px-4 py-2 rounded-md" aria-live="polite">{toast}</Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}