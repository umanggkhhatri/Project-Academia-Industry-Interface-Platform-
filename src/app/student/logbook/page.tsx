'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DashboardSidebar, { SidebarItem } from '@/components/layout/DashboardSidebar';
import { NotebookPen, FileDown, Printer, Trash2, Edit, CalendarDays, Clock, Tag, Loader2 } from 'lucide-react';

type LogEntry = {
  _id: string;
  studentUid: string;
  date: string;
  title: string;
  hours: number;
  notes?: string;
  tags?: string[];
  status?: 'Pending' | 'Approved' | 'Needs Changes';
  reviewNote?: string;
};

export default function StudentLogbookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthed = user?.role === 'student';

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [formTitle, setFormTitle] = useState('');
  const [formHours, setFormHours] = useState(0);
  const [formNotes, setFormNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const editingId = useRef<string | null>(null);

  const sidebarItems = useMemo<SidebarItem[]>(() => [
    { label: 'Dashboard/Home', href: '/student/dashboard', icon: <NotebookPen className="h-5 w-5" /> },
    { label: 'Internship Finder', href: '/student/internships', icon: <NotebookPen className="h-5 w-5" /> },
    { label: 'Profile Settings', href: '/student/profile', icon: <NotebookPen className="h-5 w-5" /> },
  ], []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchEntries = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/logbook?uid=${encodeURIComponent(user.uid)}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setEntries(Array.isArray(json.entries) ? json.entries : []);
    } catch { setError('Could not load logbook entries. Please try again.'); }
    finally { setLoading(false); }
  }, [user?.uid]);

  useEffect(() => { if (isAuthed && user?.uid) fetchEntries(); }, [isAuthed, user?.uid, fetchEntries]);

  const resetForm = () => {
    editingId.current = null;
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormTitle(''); setFormHours(0); setFormNotes(''); setFormTags([]); setTagInput('');
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!formTags.includes(t)) setFormTags(p => [...p, t]);
    setTagInput('');
  };

  const handleSaveEntry = async () => {
    if (!formTitle.trim() || !formDate) { showToast('Please enter a date and title'); return; }
    if (!user?.uid) return;
    setSaving(true);
    try {
      const payload = { studentUid: user.uid, date: formDate, title: formTitle.trim(), hours: Math.max(0, formHours), notes: formNotes.trim(), tags: formTags };
      const url = editingId.current ? `/api/logbook?id=${encodeURIComponent(editingId.current)}` : '/api/logbook';
      const method = editingId.current ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? 'Save failed'); }
      showToast(editingId.current ? 'Entry updated' : 'Entry added');
      resetForm(); await fetchEntries();
    } catch (e) { showToast((e as Error).message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleEdit = (id: string) => {
    const entry = entries.find(e => e._id === id); if (!entry) return;
    editingId.current = id; setFormDate(entry.date); setFormTitle(entry.title);
    setFormHours(entry.hours); setFormNotes(entry.notes || ''); setFormTags(entry.tags || []);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    try {
      const res = await fetch(`/api/logbook?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Entry deleted'); if (editingId.current === id) resetForm(); await fetchEntries();
    } catch { showToast('Failed to delete entry'); }
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'logbook.json'; a.click(); URL.revokeObjectURL(url);
  };

  if (!isAuthed) return (
    <div className="max-w-3xl mx-auto p-6"><Card className="p-4"><p className="text-[#1A1A1A]">Please login as Student to access Logbook.</p></Card></div>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-6">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <DashboardSidebar title="Student Menu" items={sidebarItems} footerLinks={[
            { label: 'Logbook', href: '/student/logbook' },
            { label: 'Report Generator', href: '/student/report' },
            { label: 'Resume Builder', href: '/student/resume' },
          ]} />

          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NotebookPen className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                  <h1 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Internship Logbook</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-[#0F3D67] text-white" onClick={exportJSON}><FileDown className="h-4 w-4 mr-1" /> Export JSON</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /> Print</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={() => router.push('/student/report')}>Go to Report</Button>
                </div>
              </div>
            </Card>

            {/* Entry Form */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Add Logbook Entry">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="date">Date</label>
                  <div className="mt-1 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-[#666666]" />
                    <input id="date" type="date" className="w-full border rounded-md px-2 py-1" value={formDate} onChange={e => setFormDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="hours">Hours</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#666666]" />
                    <input id="hours" type="number" min={0} step={0.5} className="w-full border rounded-md px-2 py-1" value={formHours} onChange={e => setFormHours(Number(e.target.value))} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="title">Title / Activity</label>
                  <input id="title" type="text" className="mt-1 w-full border rounded-md px-2 py-1" value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="e.g., Implemented login form" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="notes">Notes</label>
                  <textarea id="notes" className="mt-1 w-full border rounded-md px-2 py-1" rows={3} value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Details, blockers, learnings" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333]">Tags</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#666666]" />
                    <input type="text" className="flex-1 border rounded-md px-2 py-1" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }} placeholder="e.g., frontend, api" />
                    <Button className="bg-[#0F3D67] text-white" onClick={handleAddTag}>Add</Button>
                  </div>
                  {formTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formTags.map(t => (
                        <span key={t} className="inline-flex items-center gap-2 bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-sm">
                          {t}<button className="text-[#0F3D67]" onClick={() => setFormTags(p => p.filter(x => x !== t))}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button className="bg-[#0F3D67] text-white" onClick={handleSaveEntry} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Saving…</> : editingId.current ? 'Update Entry' : 'Add Entry'}
                </Button>
                {editingId.current && <Button className="bg-[#999999] text-white" onClick={resetForm}>Cancel Edit</Button>}
              </div>
            </Card>

            {/* Entries List */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Logbook Entries">
              <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] mb-3">Entries</h2>
              {loading && <div className="flex items-center gap-2 text-[#555555]"><Loader2 className="h-5 w-5 animate-spin text-[#0F3D67]" /><span>Loading entries…</span></div>}
              {error && <div className="p-3 rounded-md bg-red-50 border border-red-200"><p className="text-sm text-red-700">{error}</p><button className="mt-1 text-sm text-red-700 underline" onClick={fetchEntries}>Retry</button></div>}
              {!loading && !error && entries.length === 0 && <p className="text-[#555555]">No entries yet. Add your first entry above.</p>}
              {!loading && !error && entries.length > 0 && (
                <ul className="space-y-3">
                  {entries.map(e => (
                    <li key={e._id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-[#333333]">{new Date(e.date).toLocaleDateString()}</div>
                          <div className="font-medium text-[#1A1A1A]">{e.title}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button className="bg-[#0F3D67] text-white" onClick={() => handleEdit(e._id)}><Edit className="h-4 w-4" /></Button>
                          <Button className="bg-[#B00020] text-white" onClick={() => handleDelete(e._id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-[#555555]">Hours: {e.hours}</div>
                      {e.notes && <div className="mt-1 text-sm text-[#555555]">{e.notes}</div>}
                      {e.status && (
                        <div className="mt-1 text-xs text-[#555555]">
                          Status: <span className={`font-medium ${e.status === 'Approved' ? 'text-green-700' : e.status === 'Needs Changes' ? 'text-amber-700' : 'text-[#333333]'}`}>{e.status}</span>
                          {e.reviewNote && <span className="ml-2 italic">— {e.reviewNote}</span>}
                        </div>
                      )}
                      {e.tags && e.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.tags.map(t => <span key={t} className="inline-block bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-xs">{t}</span>)}
                        </div>
                      )}
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