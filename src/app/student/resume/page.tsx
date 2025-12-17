"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserCircle, FileText, MessageSquare, Sparkles, Briefcase, Download } from "lucide-react";

export default function StudentResumeBuilderPage() {
  const { user } = useAuth();
  const isAuthed = user?.role === "student";

  // Builder state
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [phone, setPhone] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [education, setEducation] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Dashboard/Home", href: "/student/dashboard", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Internship Finder", href: "/student/internships", icon: <Sparkles className="h-5 w-5" /> },
      { label: "Study Resources", href: "/student/dashboard", icon: <FileText className="h-5 w-5" /> },
      { label: "Chat Support", href: "/student/dashboard", icon: <MessageSquare className="h-5 w-5" /> },
      { label: "Profile Settings", href: "/student/profile", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Resume Builder", href: "/student/resume", icon: <Briefcase className="h-5 w-5" />, active: true },
    ],
    []
  );

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = () => showToast("Resume data saved successfully");

  const handleExport = () => {
    // Simple export of JSON data as a file for now
    const data = {
      fullName,
      email,
      phone,
      summary,
      education,
      skills,
      experience,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-data.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported resume data (JSON)");
  };

  return (
    <main className="bg-[#F5F7FA] min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C]">Resume Builder</h1>
            <p className="text-sm text-[#333333]">Fill your details and preview your resume.</p>
          </div>
        </div>

        {!isAuthed && (
          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
            <p className="text-[#333333] text-sm md:text-base">
              You are not logged in as a student. Please
              <Link href="/login/student" className="underline ml-1 text-[#0056A3] hover:text-[#003D73]">login</Link>.
            </p>
          </div>
        )}

        {isAuthed && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <DashboardSidebar title="Student Menu" items={sidebarItems} />

            {/* Builder Content */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Toast */}
              {toast && (
                <div className="fixed right-6 top-20 z-50 bg-[#0F4C5C] text-white px-4 py-2 rounded-md shadow-lg">
                  {toast}
                </div>
              )}

              {/* Form */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Resume Details</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Full Name</label>
                      <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Phone</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Professional Summary</label>
                      <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Education</label>
                      <textarea value={education} onChange={(e) => setEducation(e.target.value)} rows={3} placeholder="e.g., B.Tech CSE, XYZ University (2022–2026)" className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Skills</label>
                    <div className="flex gap-2 mb-2">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" className="flex-1 rounded-md border border-[#D1D5DB] p-2" />
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={addSkill}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s) => (
                        <span key={s} className="px-2 py-1 rounded-md border border-[#D0E4F7] bg-white text-[#0F4C5C] text-xs inline-flex items-center gap-2">
                          {s}
                          <button onClick={() => removeSkill(s)} className="text-[#0F4C5C]">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Experience / Projects</label>
                    <textarea value={experience} onChange={(e) => setExperience(e.target.value)} rows={3} placeholder="e.g., Frontend Intern at ABC, Built dashboard in React" className="w-full rounded-md border border-[#D1D5DB] p-2" />
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={handleSave}>Save</Button>
                    <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white flex items-center gap-2" onClick={handleExport}>
                      <Download className="h-4 w-4" /> Export JSON
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Preview */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Resume Preview</h2>
                </div>
                <div className="space-y-3 text-[#1A1A1A]">
                  <div>
                    <div className="text-xl font-semibold">{fullName || "Your Name"}</div>
                    <div className="text-sm text-[#555555]">{email || "email@example.com"} • {phone || "(+91) 00000 00000"}</div>
                  </div>
                  {summary && (
                    <div>
                      <div className="font-medium">Summary</div>
                      <p className="text-sm text-[#333333]">{summary}</p>
                    </div>
                  )}
                  {education && (
                    <div>
                      <div className="font-medium">Education</div>
                      <p className="text-sm text-[#333333] whitespace-pre-wrap">{education}</p>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div>
                      <div className="font-medium">Skills</div>
                      <p className="text-sm text-[#333333]">{skills.join(", ")}</p>
                    </div>
                  )}
                  {experience && (
                    <div>
                      <div className="font-medium">Experience / Projects</div>
                      <p className="text-sm text-[#333333] whitespace-pre-wrap">{experience}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}