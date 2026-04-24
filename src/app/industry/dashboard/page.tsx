"use client";

import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import {
  Briefcase,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Filter,
  Edit,
  XCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Listing = {
  id: string;
  title: string;
  type: "Internship" | "Job";
  location: string;
  status: "Open" | "Closed";
  applicants: number;
};

type Applicant = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  match: number; // percentage
  status: "Applied" | "Shortlisted" | "Interview";
};

export default function IndustryDashboardPage() {
  const { user, logout, loading } = useAuth();
  const isAuthed = user?.role === "industry";

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [skillFilter, setSkillFilter] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("listings");
  const [certName, setCertName] = useState<string>("");
  const [certTitle, setCertTitle] = useState<string>("");
  const [certDate, setCertDate] = useState<string>("");

  // Listings state
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);

  // Applicants state
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantsError, setApplicantsError] = useState<string | null>(null);

  // Create listing form state
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"Internship" | "Job">("Internship");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchListings = useCallback(async () => {
    if (!isAuthed || !user?.uid) return;
    setListingsLoading(true); setListingsError(null);
    try {
      const res = await fetch(`/api/internships?limit=50`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setListings((Array.isArray(json.internships) ? json.internships : []).map(
        (item: Record<string, unknown>) => ({
          id: String(item._id ?? ''),
          title: String(item.title ?? ''),
          type: (item.type as Listing['type']) ?? 'Internship',
          location: String(item.location ?? ''),
          status: (item.status as Listing['status']) ?? 'Open',
          applicants: Number(item.applicants ?? 0),
        })
      ));
    } catch { setListingsError('Could not load listings.'); }
    finally { setListingsLoading(false); }
  }, [isAuthed, user?.uid]);

  const fetchApplicants = useCallback(async () => {
    if (!isAuthed) return;
    setApplicantsLoading(true); setApplicantsError(null);
    try {
      const res = await fetch('/api/users?role=student');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setApplicants((Array.isArray(json.users) ? json.users : []).map(
        (u: Record<string, unknown>, i: number) => ({
          id: String(u.uid ?? u._id ?? i),
          name: String(u.name ?? 'Unknown'),
          email: String(u.email ?? ''),
          skills: [],
          match: 0,
          status: 'Applied' as Applicant['status'],
        })
      ));
    } catch { setApplicantsError('Could not load applicants.'); }
    finally { setApplicantsLoading(false); }
  }, [isAuthed]);

  useEffect(() => { if (isAuthed) { fetchListings(); fetchApplicants(); } }, [isAuthed, fetchListings, fetchApplicants]);

  const filteredApplicants = useMemo(() => {
    if (!skillFilter) return applicants;
    return applicants.filter((a) => a.skills.some((s) => s.toLowerCase().includes(skillFilter.toLowerCase())));
  }, [applicants, skillFilter]);

  const handleCreateListing = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle, company: user?.email ?? 'My Company',
          industry: newType === 'Internship' ? 'General' : 'General',
          skillsRequired: [], mode: 'on-site', durationWeeks: 12,
          location: newLocation || 'TBD', description: newDescription,
          verified: false, postedBy: user?.uid, status: 'Open',
        }),
      });
      if (!res.ok) throw new Error('Create failed');
      setShowCreateModal(false);
      setNewTitle(''); setNewType('Internship'); setNewLocation(''); setNewDescription('');
      await fetchListings();
    } catch { /* silently ignore */ }
    finally { setCreating(false); }
  };

  return (
    <main className="bg-[#F5F7FA] min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C]">Industry Partner Dashboard</h1>
            <p className="text-gray-600">Manage postings, applications, communication, and analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => setShowCreateModal(true)}>
              <Briefcase className="h-4 w-4 mr-2" /> Post Opportunity
            </Button>
            <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => setShowMessagePanel(true)}>
              <MessageSquare className="h-4 w-4 mr-2" /> Message
            </Button>
            {isAuthed && (
              <Button variant="outline" className="border-gray-300" onClick={logout}>Logout</Button>
            )}
          </div>
        </div>

        {/* Top Tab Bar removed per request; navigation moved to sidebar */}

        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-gray-600">Loading your session…</p>
          </div>
        )}

        {user && !isAuthed && (
          (() => {
            const dest = user.role === 'student' ? '/student/dashboard' : '/faculty/dashboard';
            if (typeof window !== 'undefined') {
              // Imperative redirect to correct dashboard
              window.location.replace(dest);
            }
            return null;
          })()
        )}

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              You are not logged in as industry. Please <Link href="/login/industry" className="underline">login</Link>.
            </p>
          </div>
        )}

        {isAuthed && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <DashboardSidebar
              title="Industry Menu"
              items={([
                { label: "Dashboard/Home", href: "/industry/dashboard", icon: <Briefcase className="h-5 w-5" /> },
                { label: "Internship Listings", onClick: () => setActiveTab("listings"), icon: <Briefcase className="h-5 w-5" />, active: activeTab === "listings" },
                { label: "Applications", onClick: () => setActiveTab("applications"), icon: <Users className="h-5 w-5" />, active: activeTab === "applications" },
                { label: "Communication", onClick: () => setActiveTab("communication"), icon: <MessageSquare className="h-5 w-5" />, active: activeTab === "communication" },
                { label: "Analytics", onClick: () => setActiveTab("analytics"), icon: <BarChart3 className="h-5 w-5" />, active: activeTab === "analytics" },
                { label: "Profile Settings", href: "/industry/profile", icon: <Settings className="h-5 w-5" /> },
                { label: "Certificates", onClick: () => setActiveTab("certificates"), icon: <FileText className="h-5 w-5" />, active: activeTab === "certificates" },
              ] as SidebarItem[])}
            />
            {/* Single content column showing only the active tab */}
            <div className="lg:col-span-3 space-y-6">
              {activeTab === "listings" && (
                <Card id="listings">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center">
                      <Briefcase className="h-5 w-5 mr-2" /> Internship/Job Posting Manager
                    </h2>
                    <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => setShowCreateModal(true)}>
                      Create Listing
                    </Button>
                  </div>
                <div className="space-y-3">
                    {listingsLoading && <div className="flex items-center gap-2 text-gray-500 py-2"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Loading listings…</span></div>}
                    {listingsError && <p className="text-sm text-amber-700">{listingsError}</p>}
                    {listings.map((l) => (
                      <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                        <div>
                          <div className="font-medium text-gray-900">{l.title}</div>
                          <div className="text-sm text-gray-600">{l.type} • {l.location}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${l.status === "Open" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-700 border border-gray-200"}`}>{l.status}</span>
                          <span className="text-sm text-gray-600">{l.applicants} applicants</span>
                          <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white">
                            <FileText className="h-4 w-4 mr-1" /> View Apps
                          </Button>
                          <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white">
                            <XCircle className="h-4 w-4 mr-1" /> Close
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {activeTab === "applications" && (
                <Card id="applications">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center">
                      <Users className="h-5 w-5 mr-2" /> Application Dashboard
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center px-2 py-1 bg-white border border-gray-300 rounded-md">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <input
                          value={skillFilter}
                          onChange={(e) => setSkillFilter(e.target.value)}
                          placeholder="Filter by skill"
                          className="ml-2 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-2">Name</th>
                          <th className="py-2">Email</th>
                          <th className="py-2">Skills</th>
                          <th className="py-2">Match</th>
                          <th className="py-2">Status</th>
                          <th className="py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApplicants.map((a) => (
                          <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                            <td className="py-2 font-medium text-gray-900">{a.name}</td>
                            <td className="py-2 text-gray-700">{a.email}</td>
                            <td className="py-2">
                              <div className="flex flex-wrap gap-1">
                                {a.skills.map((s) => (
                                  <span key={s} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{a.match}%</span>
                                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#0F4C5C]" style={{ width: `${a.match}%` }} />
                                </div>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{a.status}</span>
                            </td>
                            <td className="py-2">
                              <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white">
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Shortlist
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {activeTab === "communication" && (
                <Card id="communication">
                  <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center mb-4">
                    <MessageSquare className="h-5 w-5 mr-2" /> Communication Panel
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Meera Iyer</div>
                        <div className="text-sm text-gray-600">Regarding Backend position</div>
                      </div>
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => setShowMessagePanel(true)}>
                        Reply
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Rohan Das</div>
                        <div className="text-sm text-gray-600">Sharing internship log update</div>
                      </div>
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => setShowMessagePanel(true)}>
                        Message
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeTab === "analytics" && (
                <>
                  <Card id="analytics">
                    <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center mb-4">
                      <BarChart3 className="h-5 w-5 mr-2" /> Analytics
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Engagement</div>
                        <div className="text-2xl font-bold text-gray-900">78%</div>
                        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2" role="img" aria-label="Engagement trend">
                          <path d="M0,40 L40,35 L80,45 L120,30 L160,38 L200,28" fill="none" stroke="#0F4C5C" strokeWidth="3" />
                          <path d="M0,40 L40,35 L80,45 L120,30 L160,38 L200,28" fill="none" stroke="#9FB6C1" strokeWidth="10" strokeOpacity="0.25" />
                        </svg>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Skill Match</div>
                        <div className="text-2xl font-bold text-gray-900">86%</div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-[#0F4C5C]" style={{ width: "86%" }} />
                        </div>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Completion Rate</div>
                        <div className="text-2xl font-bold text-gray-900">68%</div>
                        <svg viewBox="0 0 200 60" className="w-full h-16 mt-2" role="img" aria-label="Completion trend">
                          <path d="M0,42 L40,38 L80,47 L120,28 L160,36 L200,30" fill="none" stroke="#0F4C5C" strokeWidth="3" />
                          <path d="M0,42 L40,38 L80,47 L120,28 L160,36 L200,30" fill="none" stroke="#9FB6C1" strokeWidth="10" strokeOpacity="0.25" />
                        </svg>
                      </div>
                      <div className="p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-600">Active Listings</div>
                        <div className="text-2xl font-bold text-gray-900">2</div>
                      </div>
                    </div>
                  </Card>
                  <Card>
                    <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center mb-4">
                      <FileText className="h-5 w-5 mr-2" /> Internship Progress Monitor
                    </h2>
                    <div className="space-y-3">
                      {[
                        { name: "Aarav Gupta", progress: 76, last: "Logbook week 6 submitted" },
                        { name: "Meera Iyer", progress: 54, last: "Mid-term assessment scheduled" },
                        { name: "Rohan Das", progress: 32, last: "Onboarding tasks pending" },
                      ].map((p) => (
                        <div key={p.name} className="p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-sm text-gray-600">{p.progress}%</div>
                          </div>
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-[#0F4C5C]" style={{ width: `${p.progress}%` }} />
                          </div>
                          <div className="text-sm text-gray-600 mt-2">{p.last}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </>
              )}

              {activeTab === "settings" && (
                <Card id="settings">
                  <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center mb-4">
                    <Settings className="h-5 w-5 mr-2" /> Profile / Organization Settings
                  </h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text(gray-700)">Organization Name</label>
                        <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="Your Company Pvt Ltd" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                        <input type="email" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="hr@company.com" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="City, Country" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Website</label>
                        <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="https://company.com" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white">Save Settings</Button>
                    </div>
                  </form>
                </Card>
              )}

              {activeTab === "certificates" && (
                <Card id="certificates">
                  <h2 className="text-xl font-semibold text-[#0F4C5C] flex items-center mb-4">
                    <FileText className="h-5 w-5 mr-2" /> Certificate Generator
                  </h2>
                  <p className="text-sm text-gray-700 mb-4">Generate a simple internship completion certificate for students.</p>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <input value={certName} onChange={(e) => setCertName(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="e.g., Meera Iyer" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Internship Title</label>
                        <input value={certTitle} onChange={(e) => setCertTitle(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="e.g., Frontend Development" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Issued Date</label>
                        <input type="date" value={certDate} onChange={(e) => setCertDate(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <Button
                        className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white"
                        onClick={() => {
                          const name = certName.trim() || "Student";
                          const title = certTitle.trim() || "Internship";
                          const date = certDate || new Date().toISOString().slice(0, 10);
                          const certHtml = `<!doctype html>
                            <html>
                              <head>
                                <meta charset=\"utf-8\" />
                                <title>Certificate</title>
                                <style>
                                  body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #f5f7fa; }
                                  .cert { width: 800px; margin: 40px auto; background: white; border: 2px solid #0F4C5C; border-radius: 12px; padding: 32px; }
                                  .head { text-align: center; color: #0F4C5C; }
                                  .title { font-size: 28px; font-weight: 700; margin: 8px 0; }
                                  .subtitle { color: #333; margin-bottom: 24px; }
                                  .name { font-size: 22px; font-weight: 600; color: #1A1A1A; }
                                  .text { color: #333; line-height: 1.6; }
                                  .row { display: flex; justify-content: space-between; margin-top: 32px; }
                                  .sig { text-align: center; }
                                  .line { margin-top: 12px; border-top: 1px solid #d1d5db; width: 220px; }
                                </style>
                              </head>
                              <body>
                                <div class=\"cert\">
                                  <div class=\"head\">
                                    <div class=\"title\">Certificate of Completion</div>
                                    <div class=\"subtitle\">This certifies that</div>
                                    <div class=\"name\">${name}</div>
                                  </div>
                                  <p class=\"text\">has successfully completed the internship titled <strong>${title}</strong> under the Industry Partner Program.</p>
                                  <p class=\"text\">Issued on <strong>${date}</strong>.</p>
                                  <div class=\"row\">
                                    <div class=\"sig\">
                                      <div>Authorized Signatory</div>
                                      <div class=\"line\"></div>
                                    </div>
                                    <div class=\"sig\">
                                      <div>Industry Partner</div>
                                      <div class=\"line\"></div>
                                    </div>
                                  </div>
                                </div>
                                <script>window.print && setTimeout(() => window.print(), 250)</script>
                              </body>
                            </html>`;
                          const w = window.open("", "_blank");
                          if (w) {
                            w.document.write(certHtml);
                            w.document.close();
                          }
                        }}
                      >
                        Generate & Print
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0F4C5C]">Create New Listing</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowCreateModal(false)}>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleCreateListing(); }}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="e.g., Frontend Intern" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" value={newType} onChange={e => setNewType(e.target.value as 'Internship' | 'Job')}>
                    <option>Internship</option>
                    <option>Job</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="Remote / City" value={newLocation} onChange={e => setNewLocation(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" rows={4} value={newDescription} onChange={e => setNewDescription(e.target.value)} />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" type="submit" disabled={creating}>
                  {creating ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" />Creating…</> : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Panel Modal */}
      {showMessagePanel && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0F4C5C]">Message Center</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowMessagePanel(false)}>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">To: Student / Faculty</div>
                <input className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" placeholder="Subject" />
              </div>
              <textarea className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F4C5C]" rows={5} placeholder="Type your message..." />
              <div className="flex items-center justify-end gap-2">
                <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => setShowMessagePanel(false)}>Cancel</Button>
                <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white">Send</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}