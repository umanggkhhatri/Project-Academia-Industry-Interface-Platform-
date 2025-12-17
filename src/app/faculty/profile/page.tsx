"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { UserCircle, Building2, ShieldCheck, FileText, Bell, Eye } from "lucide-react";

type SectionId =
  | "personal"
  | "deptRole"
  | "supervision"
  | "reports"
  | "notifications"
  | "account"
  | "privacy";

export default function FacultyProfilePage() {
  const { user } = useAuth();
  const isAuthed = user?.role === "faculty";

  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    personal: true,
    deptRole: true,
    supervision: true,
    reports: true,
    notifications: true,
    account: true,
    privacy: true,
  });
  const [toast, setToast] = useState<string | null>(null);

  // Personal info
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [phone, setPhone] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");

  // Dept & Role
  const [institution, setInstitution] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");
  const [coursesHandled, setCoursesHandled] = useState<string>("");

  // Supervision Preferences
  const [studentCapacity, setStudentCapacity] = useState<string>("");
  const [mentoringAreas, setMentoringAreas] = useState<string>("");
  const [weeklySlots, setWeeklySlots] = useState<string>("");

  // Reports & Logbook Access
  const [logbookVisibility, setLogbookVisibility] = useState<boolean>(true);
  const [reportAccess, setReportAccess] = useState<boolean>(true);

  // Notification Settings
  const [logbookAlerts, setLogbookAlerts] = useState<boolean>(true);
  const [studentProgressAlerts, setStudentProgressAlerts] = useState<boolean>(true);

  // Account Settings
  const [newPassword, setNewPassword] = useState<string>("");
  const [notifyEmail, setNotifyEmail] = useState<boolean>(true);

  // Privacy Controls
  const [contactVisible, setContactVisible] = useState<boolean>(true);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Dashboard/Home", href: "/faculty/dashboard", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Students Overview", href: "/faculty/dashboard#students-overview", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Analytics Board", href: "/faculty/dashboard#analytics-board", icon: <FileText className="h-5 w-5" /> },
      { label: "Profile Settings", href: "/faculty/profile", icon: <UserCircle className="h-5 w-5" />, active: true },
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

  return (
    <main className="bg-[#F5F7FA] min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C]">Faculty Profile Settings</h1>
            <p className="text-sm text-[#333333]">Manage your details, supervision preferences, and privacy.</p>
          </div>
        </div>

        {!isAuthed && (
          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
            <p className="text-[#333333] text-sm md:text-base">
              You are not logged in as faculty. Please
              <Link href="/login/faculty" className="underline ml-1 text-[#0056A3] hover:text-[#003D73]">login</Link>.
            </p>
          </div>
        )}

        {isAuthed && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <DashboardSidebar title="Faculty Menu" items={sidebarItems} />

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
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Personal Information")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Department & Role */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-[#0F4C5C]" /> Department & Role
                  </h2>
                  <button onClick={() => handleToggle("deptRole")} className="text-sm text-[#0F4C5C]">
                    {openSections.deptRole ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.deptRole && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Institution</label>
                      <input value={institution} onChange={(e) => setInstitution(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Department</label>
                      <input value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Designation</label>
                      <input value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Courses/Areas handled</label>
                      <textarea value={coursesHandled} onChange={(e) => setCoursesHandled(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" rows={3} />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Department & Role")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Supervision Preferences */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-[#0F4C5C]" /> Supervision Preferences
                  </h2>
                  <button onClick={() => handleToggle("supervision")} className="text-sm text-[#0F4C5C]">
                    {openSections.supervision ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.supervision && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Student capacity</label>
                      <input value={studentCapacity} onChange={(e) => setStudentCapacity(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Weekly supervision slots</label>
                      <input value={weeklySlots} onChange={(e) => setWeeklySlots(e.target.value)} placeholder="e.g., 4 slots/week" className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Mentoring areas</label>
                      <textarea value={mentoringAreas} onChange={(e) => setMentoringAreas(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" rows={3} />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Supervision Preferences")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Reports & Logbook Access */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[#0F4C5C]" /> Reports & Logbook Access
                  </h2>
                  <button onClick={() => handleToggle("reports")} className="text-sm text-[#0F4C5C]">
                    {openSections.reports ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.reports && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input id="logbook-visibility" type="checkbox" checked={logbookVisibility} onChange={(e) => setLogbookVisibility(e.target.checked)} />
                      <label htmlFor="logbook-visibility" className="text-sm text-[#1A1A1A]">Logbook visibility enabled</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="report-access" type="checkbox" checked={reportAccess} onChange={(e) => setReportAccess(e.target.checked)} />
                      <label htmlFor="report-access" className="text-sm text-[#1A1A1A]">Allow report generation access</label>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Reports & Logbook Access")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Notification Settings */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Bell className="h-6 w-6 text-[#0F4C5C]" /> Notification Settings
                  </h2>
                  <button onClick={() => handleToggle("notifications")} className="text-sm text-[#0F4C5C]">
                    {openSections.notifications ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.notifications && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input id="logbook-alerts" type="checkbox" checked={logbookAlerts} onChange={(e) => setLogbookAlerts(e.target.checked)} />
                      <label htmlFor="logbook-alerts" className="text-sm text-[#1A1A1A]">Logbook alerts</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="student-progress-alerts" type="checkbox" checked={studentProgressAlerts} onChange={(e) => setStudentProgressAlerts(e.target.checked)} />
                      <label htmlFor="student-progress-alerts" className="text-sm text-[#1A1A1A]">Student progress alerts</label>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Notification Settings")}>Save Changes</Button>
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
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Account Settings")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Privacy Controls */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Eye className="h-6 w-6 text-[#0F4C5C]" /> Privacy Controls
                  </h2>
                  <button onClick={() => handleToggle("privacy")} className="text-sm text-[#0F4C5C]">
                    {openSections.privacy ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.privacy && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input id="contact-visible" type="checkbox" checked={contactVisible} onChange={(e) => setContactVisible(e.target.checked)} />
                      <label htmlFor="contact-visible" className="text-sm text-[#1A1A1A]">Make contact info visible to students</label>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Privacy Controls")}>Save Changes</Button>
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