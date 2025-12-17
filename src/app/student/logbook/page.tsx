'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import DashboardSidebar, { SidebarItem } from '@/components/layout/DashboardSidebar';
import { NotebookPen, FileDown, Printer, Trash2, Edit, CalendarDays, Clock, Tag } from 'lucide-react';

type LogEntry = {
  id: string;
  date: string; // ISO date
  title: string;
  hours: number;
  notes?: string;
  tags?: string[];
};

const STORAGE_KEY = 'student_logbook';

export default function StudentLogbookPage() {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthed = user?.role === 'student';

  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const [formDate, setFormDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [formTitle, setFormTitle] = useState<string>('');
  const [formHours, setFormHours] = useState<number>(0);
  const [formNotes, setFormNotes] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const editingId = useRef<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as LogEntry[];
        setEntries(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: 'Dashboard/Home', href: '/student/dashboard', icon: <NotebookPen className="h-5 w-5" /> },
      { label: 'Internship Finder', href: '/student/internships', icon: <NotebookPen className="h-5 w-5" /> },
      { label: 'Profile Settings', href: '/student/profile', icon: <NotebookPen className="h-5 w-5" /> },
    ],
    []
  );

  const resetForm = () => {
    editingId.current = null;
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormTitle('');
    setFormHours(0);
    setFormNotes('');
    setFormTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    if (!formTags.includes(t)) setFormTags((prev) => [...prev, t]);
    setTagInput('');
  };

  const removeTag = (t: string) => {
    setFormTags((prev) => prev.filter((x) => x !== t));
  };

  const handleSaveEntry = () => {
    if (!formTitle.trim() || !formDate) {
      setToast('Please enter a date and title');
      return;
    }
    const next: LogEntry = {
      id: editingId.current ?? `${Date.now()}`,
      date: formDate,
      title: formTitle.trim(),
      hours: Math.max(0, Number(formHours) || 0),
      notes: formNotes.trim(),
      tags: formTags,
    };
    setEntries((prev) => {
      const exists = prev.some((e) => e.id === next.id);
      const updated = exists ? prev.map((e) => (e.id === next.id ? next : e)) : [next, ...prev];
      return updated.sort((a, b) => b.date.localeCompare(a.date));
    });
    setToast(editingId.current ? 'Entry updated' : 'Entry added');
    resetForm();
  };

  const handleEdit = (id: string) => {
    const entry = entries.find((e) => e.id === id);
    if (!entry) return;
    editingId.current = id;
    setFormDate(entry.date);
    setFormTitle(entry.title);
    setFormHours(entry.hours);
    setFormNotes(entry.notes || '');
    setFormTags(entry.tags || []);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setToast('Entry deleted');
    if (editingId.current === id) resetForm();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logbook.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPDF = () => {
    window.print();
  };

  const goToReport = () => {
    router.push('/student/report');
  };

  if (!isAuthed) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="p-4">
          <p className="text-[#1A1A1A]">Please login as Student to access Logbook.</p>
        </Card>
      </div>
    );
  }

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
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Logbook Header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NotebookPen className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                  <h1 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Internship Logbook</h1>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-[#0F3D67] text-white" onClick={exportJSON}><FileDown className="h-4 w-4 mr-1" /> Export JSON</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={printPDF}><Printer className="h-4 w-4 mr-1" /> Print</Button>
                  <Button className="bg-[#0F3D67] text-white" onClick={goToReport}>Go to Report</Button>
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
                    <input id="date" type="date" className="w-full border rounded-md px-2 py-1" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="hours">Hours</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#666666]" />
                    <input id="hours" type="number" min={0} step={0.5} className="w-full border rounded-md px-2 py-1" value={formHours} onChange={(e) => setFormHours(Number(e.target.value))} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="title">Title / Activity</label>
                  <input id="title" type="text" className="mt-1 w-full border rounded-md px-2 py-1" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Implemented login form and validation" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333]" htmlFor="notes">Notes</label>
                  <textarea id="notes" className="mt-1 w-full border rounded-md px-2 py-1" rows={3} value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Details, blockers, learnings" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#333333]">Tags</label>
                  <div className="mt-1 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#666666]" />
                    <input type="text" className="flex-1 border rounded-md px-2 py-1" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g., frontend, api, testing" />
                    <Button className="bg-[#0F3D67] text-white" onClick={handleAddTag}>Add</Button>
                  </div>
                  {formTags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formTags.map((t) => (
                        <span key={t} className="inline-flex items-center gap-2 bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-sm">
                          {t}
                          <button className="text-[#0F3D67]" onClick={() => removeTag(t)}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <Button className="bg-[#0F3D67] text-white" onClick={handleSaveEntry}>{editingId.current ? 'Update Entry' : 'Add Entry'}</Button>
                {editingId.current && <Button className="bg-[#999999] text-white" onClick={resetForm}>Cancel Edit</Button>}
              </div>
            </Card>

            {/* Entries List */}
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Logbook Entries">
              <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] mb-3">Entries</h2>
              {entries.length === 0 ? (
                <p className="text-[#555555]">No entries yet. Add your first entry above.</p>
              ) : (
                <ul className="space-y-3">
                  {entries.map((e) => (
                    <li key={e.id} className="border rounded-md p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-[#333333]">{new Date(e.date).toLocaleDateString()}</div>
                          <div className="font-medium text-[#1A1A1A]">{e.title}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button className="bg-[#0F3D67] text-white" onClick={() => handleEdit(e.id)}><Edit className="h-4 w-4" /></Button>
                          <Button className="bg-[#B00020] text-white" onClick={() => handleDelete(e.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-[#555555]">Hours: {e.hours}</div>
                      {e.notes && <div className="mt-1 text-sm text-[#555555]">{e.notes}</div>}
                      {e.tags && e.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {e.tags.map((t) => (
                            <span key={t} className="inline-block bg-[#EEF3F8] text-[#0F3D67] px-2 py-1 rounded-md text-xs">{t}</span>
                          ))}
                        </div>
                      )}
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