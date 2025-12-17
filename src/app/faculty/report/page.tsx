'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DashboardSidebar, { SidebarItem } from '@/components/layout/DashboardSidebar';
import { FileText, CalendarDays, BarChart3, FileDown, Printer } from 'lucide-react';

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

type ReportSummary = {
  from: string;
  to: string;
  totalEntries: number;
  totalHours: number;
  approved: number;
  pending: number;
  changes: number;
  byTag: Record<string, number>;
};

export default function FacultyReportPage() {
  const { user } = useAuth();
  const isAuthed = user?.role === 'faculty';

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw) as LogEntry[]);
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      setToDate(today.toISOString().slice(0, 10));
      setFromDate(lastWeek.toISOString().slice(0, 10));
    } catch {}
  }, []);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: 'Dashboard/Home', href: '/faculty/dashboard', icon: <FileText className="h-5 w-5" /> },
      { label: 'Profile Settings', href: '/faculty/profile', icon: <FileText className="h-5 w-5" /> },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!fromDate || !toDate) return entries;
    return entries.filter((e) => e.date >= fromDate && e.date <= toDate);
  }, [entries, fromDate, toDate]);

  const generateSummary = () => {
    const totalEntries = filtered.length;
    const totalHours = filtered.reduce((sum, e) => sum + (Number(e.hours) || 0), 0);
    const approved = filtered.filter((e) => e.status === 'Approved').length;
    const changes = filtered.filter((e) => e.status === 'Needs Changes').length;
    const pending = filtered.filter((e) => (e.status ?? 'Pending') === 'Pending').length;
    const byTag: Record<string, number> = {};
    filtered.forEach((e) => (e.tags || []).forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; }));
    setSummary({ from: fromDate, to: toDate, totalEntries, totalHours, approved, pending, changes, byTag });
    setToast('Faculty report generated');
  };

  const exportJSON = () => {
    const payload = {
      period: { from: fromDate, to: toDate },
      entries: filtered,
      summary,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faculty-internship-report.json';
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
          <p className="text-[#1A1A1A]">Please login as Faculty to access Report Generator.</p>
        </Card>
      </div>
    );
  }

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
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Report Header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                  <h1 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Faculty Report Generator</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-[#0F3D67] text-white" onClick={exportJSON}><FileDown className="h-4 w-4 mr-1" /> Export JSON</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={printPDF}><Printer className="h-4 w-4 mr-1" /> Print</Button>
                </div>
              </div>
            </Card>

            {/* Filters */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Filters">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="from">From</label>
                  <div className="mt-1 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#666666]" />
                    <input id="from" type="date" className="w-full border rounded-md px-2 py-1" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="to">To</label>
                  <div className="mt-1 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#666666]" />
                    <input id="to" type="date" className="w-full border rounded-md px-2 py-1" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-[#0F3D67] text-white" onClick={generateSummary}><BarChart3 className="h-4 w-4 mr-1" /> Generate</Button>
                </div>
              </div>
            </Card>

            {/* Summary */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Summary">
              {!summary ? (
                <p className="text-[#555555]">Choose a date range and generate the report.</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-[#0F3D67]" />
                    <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Summary ({new Date(summary.from).toLocaleDateString()} - {new Date(summary.to).toLocaleDateString()})</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3"><div className="text-[#333333]">Total Entries</div><div className="text-[#1A1A1A] text-xl font-semibold">{summary.totalEntries}</div></div>
                    <div className="border rounded-md p-3"><div className="text-[#333333]">Total Hours</div><div className="text-[#1A1A1A] text-xl font-semibold">{summary.totalHours}</div></div>
                    <div className="border rounded-md p-3"><div className="text-[#333333]">Approved</div><div className="text-[#1A1A1A] text-xl font-semibold">{summary.approved}</div></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border rounded-md p-3"><div className="text-[#333333]">Pending</div><div className="text-[#1A1A1A] text-xl font-semibold">{summary.pending}</div></div>
                    <div className="border rounded-md p-3"><div className="text-[#333333]">Needs Changes</div><div className="text-[#1A1A1A] text-xl font-semibold">{summary.changes}</div></div>
                    <div className="border rounded-md p-3">
                      <div className="text-[#333333]">Top Tags</div>
                      <div className="text-[#1A1A1A] text-sm mt-1">
                        {Object.entries(summary.byTag)
                          .sort((a, b) => b[1] - a[1])
                          .slice(0, 5)
                          .map(([tag, count]) => (
                            <span key={tag} className="inline-block bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-xs mr-2 mb-2">{tag} ({count})</span>
                          ))}
                        {Object.keys(summary.byTag).length === 0 && <span className="text-[#555555]">No tags</span>}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#1A1A1A] font-medium">Entries in Range</h3>
                    <ul className="mt-2 space-y-2">
                      {filtered.length === 0 ? (
                        <li className="text-[#555555]">No entries in selected range.</li>
                      ) : (
                        filtered.map((e) => (
                          <li key={e.id} className="border rounded-md p-3">
                            <div className="text-sm text-[#333333]">{new Date(e.date).toLocaleDateString()}</div>
                            <div className="font-medium text-[#1A1A1A]">{e.title}</div>
                            <div className="text-sm text-[#555555]">Hours: {e.hours}</div>
                            <div className="text-sm text-[#555555]">Status: {e.status ?? 'Pending'}</div>
                            {e.reviewNote && <div className="text-sm text-[#555555]">Note: {e.reviewNote}</div>}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
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