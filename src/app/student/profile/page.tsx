"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserCircle, Briefcase, BarChart3, FileText, MessageSquare, Sparkles, CloudUpload, ShieldCheck } from "lucide-react";

type SectionId =
  | "personal"
  | "academic"
  | "skills"
  | "preferences"
  | "resume"
  | "account";

export default function StudentProfilePage() {
  const { user } = useAuth();
  const isAuthed = user?.role === "student";

  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    personal: true,
    academic: true,
    skills: true,
    preferences: true,
    resume: true,
    account: true,
  });
  const [toast, setToast] = useState<string | null>(null);

  // Personal info state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  // Academic details state
  const [college, setCollege] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [cgpa, setCgpa] = useState<string>("");

  // Skills & Interests
  const [skillInput, setSkillInput] = useState<string>("");
  const [skills, setSkills] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [industryInput, setIndustryInput] = useState<string>("");

  // Internship Preferences
  const [domain, setDomain] = useState<string>("");
  const [locationPref, setLocationPref] = useState<string>("");
  const [availability, setAvailability] = useState<string>("");

  // Resume & Portfolio
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [portfolioLink, setPortfolioLink] = useState<string>("");

  // Account Settings
  const [newPassword, setNewPassword] = useState<string>("");
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);
  const [privateProfile, setPrivateProfile] = useState<boolean>(false);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Dashboard/Home", href: "/student/dashboard", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Internship Finder", href: "/student/internships", icon: <Sparkles className="h-5 w-5" /> },
      { label: "Study Resources", href: "/student/dashboard", icon: <FileText className="h-5 w-5" /> },
      { label: "Chat Support", href: "/student/dashboard", icon: <MessageSquare className="h-5 w-5" /> },
      { label: "Profile Settings", href: "/student/profile", icon: <UserCircle className="h-5 w-5" />, active: true },
    ],
    []
  );

  const handleToggle = (id: SectionId) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSave = (section: string) => {
    showToast(`${section} saved successfully`);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
  };

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    setSkills((prev) => [...prev, v]);
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills((prev) => prev.filter((x) => x !== s));

  const addIndustry = () => {
    const v = industryInput.trim();
    if (!v) return;
    setIndustries((prev) => [...prev, v]);
    setIndustryInput("");
  };

  const removeIndustry = (s: string) => setIndustries((prev) => prev.filter((x) => x !== s));

  return (
    <main className="bg-[#F5F7FA] min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C]">Profile Settings</h1>
            <p className="text-sm text-[#333333]">Manage your personal and academic information.</p>
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
            <DashboardSidebar
              title="Student Menu"
              items={sidebarItems}
              footerLinks={[
                { label: "Logbook", href: "/student/logbook" },
                { label: "Report Generator", href: "/student/report" },
                { label: "Resume Builder", href: "/student/resume" },
              ]}
            />

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Toast */}
              {toast && (
                <div className="fixed right-6 top-20 z-50 bg-[#0F4C5C] text-white px-4 py-2 rounded-md shadow-lg">
                  {toast}
                </div>
              )}

              {/* Personal Information */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <UserCircle className="h-6 w-6 text-[#0F4C5C]" /> Personal Information
                  </h2>
                  <button onClick={() => handleToggle("personal")} className="text-sm text-[#0F4C5C]">
                    {openSections.personal ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.personal && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#E6F0FA] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photoUrl || "/avatar-placeholder.png"} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Profile Photo</label>
                        <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
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
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" rows={3} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Personal Information")}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Academic Details */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Briefcase className="h-6 w-6 text-[#0F4C5C]" /> Academic Details
                  </h2>
                  <button onClick={() => handleToggle("academic")} className="text-sm text-[#0F4C5C]">
                    {openSections.academic ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.academic && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">College</label>
                      <input value={college} onChange={(e) => setCollege(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Course</label>
                      <input value={course} onChange={(e) => setCourse(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Year</label>
                      <input value={year} onChange={(e) => setYear(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">CGPA</label>
                      <input value={cgpa} onChange={(e) => setCgpa(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Academic Details")}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Skills & Interests */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-[#0F4C5C]" /> Skills & Interests
                  </h2>
                  <button onClick={() => handleToggle("skills")} className="text-sm text-[#0F4C5C]">
                    {openSections.skills ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.skills && (
                  <div className="space-y-4">
                    <div className="flex gap-2">
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
                    <div className="flex gap-2">
                      <input value={industryInput} onChange={(e) => setIndustryInput(e.target.value)} placeholder="Preferred industry" className="flex-1 rounded-md border border-[#D1D5DB] p-2" />
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={addIndustry}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {industries.map((s) => (
                        <span key={s} className="px-2 py-1 rounded-md border border-[#D0E4F7] bg-white text-[#0F4C5C] text-xs inline-flex items-center gap-2">
                          {s}
                          <button onClick={() => removeIndustry(s)} className="text-[#0F4C5C]">×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Skills & Interests")}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Internship Preferences */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-[#0F4C5C]" /> Internship Preferences
                  </h2>
                  <button onClick={() => handleToggle("preferences")} className="text-sm text-[#0F4C5C]">
                    {openSections.preferences ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.preferences && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Domain</label>
                      <input value={domain} onChange={(e) => setDomain(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Location</label>
                      <input value={locationPref} onChange={(e) => setLocationPref(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Availability</label>
                      <input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="e.g., 20 hrs/week" className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Internship Preferences")}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Resume & Portfolio */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <CloudUpload className="h-6 w-6 text-[#0F4C5C]" /> Resume & Portfolio
                  </h2>
                  <button onClick={() => handleToggle("resume")} className="text-sm text-[#0F4C5C]">
                    {openSections.resume ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.resume && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Upload Resume (PDF)</label>
                      <input type="file" accept="application/pdf" onChange={(e) => {
                        const file = e.target.files?.[0];
                        setResumeFileName(file ? file.name : "");
                      }} />
                      {resumeFileName && <p className="text-xs text-[#666666] mt-1">Selected: {resumeFileName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Portfolio Link</label>
                      <input type="url" value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Resume & Portfolio")}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Account Settings */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[#0F4C5C]" /> Account Settings
                  </h2>
                  <button onClick={() => handleToggle("account")} className="text-sm text-[#0F4C5C]">
                    {openSections.account ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.account && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">New Password</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="notify-email" type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} />
                        <label htmlFor="notify-email" className="text-sm text-[#1A1A1A]">Email notifications</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="private-profile" type="checkbox" checked={privateProfile} onChange={(e) => setPrivateProfile(e.target.checked)} />
                        <label htmlFor="private-profile" className="text-sm text-[#1A1A1A]">Privacy: hide contact info</label>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Account Settings")}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}