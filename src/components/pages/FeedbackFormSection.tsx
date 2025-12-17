'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { MessageSquare, Star, UserCircle, Mail } from 'lucide-react';

type FeedbackItem = {
  id: string;
  name: string;
  email?: string;
  role?: 'student' | 'faculty' | 'industry' | 'guest';
  rating?: number;
  message: string;
  time: string;
};

const STORAGE_KEY = 'site_feedback';

export default function FeedbackFormSection() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<FeedbackItem['role']>('guest');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);
  const [recent, setRecent] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setRecent(JSON.parse(raw) as FeedbackItem[]);
    } catch {}
  }, []);

  const saveFeedback = () => {
    if (!name.trim() || !message.trim()) {
      setToast('Please provide your name and feedback message');
      return;
    }
    const item: FeedbackItem = {
      id: `${Date.now()}`,
      name: name.trim(),
      email: email.trim() || undefined,
      role,
      rating,
      message: message.trim(),
      time: new Date().toISOString(),
    };
    const next = [item, ...recent].slice(0, 5);
    setRecent(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
    setToast('Thanks for your feedback!');
    setName('');
    setEmail('');
    setRole('guest');
    setRating(5);
    setMessage('');
  };

  return (
    <section className="py-12 md:py-16 bg-[#F0F4FA]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Card className="bg-white rounded-lg p-6 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6 text-[#0F3D67]" aria-hidden />
            <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">We value your feedback</h2>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333]" htmlFor="fb-name">Name</label>
              <div className="mt-1 flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-[#666666]" />
                <input id="fb-name" type="text" className="w-full border rounded-md px-2 py-1" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333]" htmlFor="fb-email">Email (optional)</label>
              <div className="mt-1 flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#666666]" />
                <input id="fb-email" type="email" className="w-full border rounded-md px-2 py-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333]" htmlFor="fb-role">Role</label>
              <select
                id="fb-role"
                className="mt-1 w-full border rounded-md px-2 py-1"
                value={role}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRole(e.target.value as FeedbackItem['role'])}
              >
                <option value="guest">Guest</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="industry">Industry</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333]">Rating</label>
              <div className="mt-1 flex items-center gap-2">
                {[1,2,3,4,5].map((r) => (
                  <button key={r} type="button" onClick={() => setRating(r)} aria-label={`Rating ${r}`} className={`p-2 rounded-md border ${rating >= r ? 'bg-[#0F3D67] text-white' : 'bg-white text-[#0F3D67]'}`}>
                    <Star className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#333333]" htmlFor="fb-message">Feedback</label>
              <textarea id="fb-message" className="mt-1 w-full border rounded-md px-2 py-1" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you think, what works, and what we can improve" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-[#0F3D67] text-white" onClick={saveFeedback}>Submit Feedback</Button>
          </div>

          {/* Recent submissions (local-only) */}
          {recent.length > 0 && (
            <div className="mt-6">
              <h3 className="text-[#1A1A1A] font-medium">Recent feedback</h3>
              <ul className="mt-2 space-y-2">
                {recent.map((f) => (
                  <li key={f.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#1A1A1A]">{f.name}{f.role ? ` • ${f.role}` : ''}</span>
                      <span className="text-xs text-[#555555]">{new Date(f.time).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-[#333333]">{f.message}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Toast */}
          {toast && (
            <div className="fixed bottom-4 right-4">
              <Card className="bg-[#0F3D67] text-white px-4 py-2 rounded-md" aria-live="polite">{toast}</Card>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}