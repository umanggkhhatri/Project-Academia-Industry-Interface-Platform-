"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import { Briefcase, UserCircle, Building2, Settings, ShieldCheck, Bell, FileText, Eye, MessageSquare, Cog } from "lucide-react";
import Image from "next/image";
import Avatar from "@/components/ui/Avatar";

type SectionId =
  | "org"
  | "contact"
  | "preferences"
  | "listingDefaults"
  | "workflow"
  | "communication"
  | "account"
  | "privacy";

export default function IndustryProfilePage() {
  const { user } = useAuth();
  const isAuthed = user?.role === "industry";

  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    org: true,
    contact: true,
    preferences: true,
    listingDefaults: true,
    workflow: true,
    communication: true,
    account: true,
    privacy: true,
  });
  const [toast, setToast] = useState<string | null>(null);

  // Organization details
  const [companyName, setCompanyName] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Contact & HR details
  const [primaryContactName, setPrimaryContactName] = useState<string>(user?.email?.split('@')[0] ?? "");
  const [primaryContactEmail, setPrimaryContactEmail] = useState<string>(user?.email ?? "");
  const [primaryContactPhone, setPrimaryContactPhone] = useState<string>("");
  const [hrContactName, setHrContactName] = useState<string>("");
  const [hrContactEmail, setHrContactEmail] = useState<string>("");

  // Internship preferences
  const [domainInput, setDomainInput] = useState<string>("");
  const [preferredDomains, setPreferredDomains] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState<string>("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [workMode, setWorkMode] = useState<"onsite" | "remote" | "hybrid">("onsite");
  const [durationRange, setDurationRange] = useState<string>("");
  const [stipendRange, setStipendRange] = useState<string>("");

  // Listing defaults
  const [defaultEligibility, setDefaultEligibility] = useState<string>("");
  const [skillInput, setSkillInput] = useState<string>("");
  const [defaultSkillsRequired, setDefaultSkillsRequired] = useState<string[]>([]);
  const [defaultQuestions, setDefaultQuestions] = useState<string>("");

  // Application workflow
  const [useAutoScreening, setUseAutoScreening] = useState<boolean>(true);
  const [autoScreeningThreshold, setAutoScreeningThreshold] = useState<number>(75);
  const [enableShortlist, setEnableShortlist] = useState<boolean>(true);
  const [enableInterviews, setEnableInterviews] = useState<boolean>(true);

  // Communication preferences
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [inAppNotifications, setInAppNotifications] = useState<boolean>(true);
  const [notificationFrequency, setNotificationFrequency] = useState<"immediate" | "daily" | "weekly">("immediate");

  // Account Settings
  const [newPassword, setNewPassword] = useState<string>("");
  const [twoFA, setTwoFA] = useState<boolean>(false);
  const [themeDark, setThemeDark] = useState<boolean>(false);

  // Privacy & Visibility
  const [publicCompanyProfile, setPublicCompanyProfile] = useState<boolean>(true);
  const [contactInfoVisible, setContactInfoVisible] = useState<boolean>(true);

  const sidebarItems = useMemo<SidebarItem[]>(
    () => [
      { label: "Dashboard/Home", href: "/industry/dashboard", icon: <Briefcase className="h-5 w-5" /> },
      { label: "Internship Listings", href: "/industry/dashboard", icon: <Briefcase className="h-5 w-5" /> },
      { label: "Applications", href: "/industry/dashboard", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Communication", href: "/industry/dashboard", icon: <UserCircle className="h-5 w-5" /> },
      { label: "Analytics", href: "/industry/dashboard", icon: <FileText className="h-5 w-5" /> },
      { label: "Profile Settings", href: "/industry/profile", icon: <Settings className="h-5 w-5" />, active: true },
      { label: "Certificates", href: "/industry/dashboard", icon: <FileText className="h-5 w-5" /> },
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

  const handleSave = (section: string) => showToast(`${section} saved successfully`);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  return (
    <main className="bg-[#F5F7FA] min-h-[calc(100vh-64px)] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0F4C5C]">Industry Profile Settings</h1>
            <p className="text-sm text-[#333333]">Company details, application workflow, and communication preferences.</p>
          </div>
        </div>

        {!isAuthed && (
          <div className="bg-white rounded-lg p-4 border border-[#E5E7EB]">
            <p className="text-[#333333] text-sm md:text-base">
              You are not logged in as industry. Please
              <Link href="/login/industry" className="underline ml-1 text-[#0F4C5C] hover:text-[#0b3a46]">login</Link>.
            </p>
          </div>
        )}

        {isAuthed && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <DashboardSidebar title="Industry Menu" items={sidebarItems} />
            <div className="lg:col-span-3 space-y-6">
              {toast && (
                <div className="fixed right-6 top-20 z-50 bg-[#0F4C5C] text-white px-4 py-2 rounded-md shadow-lg">{toast}</div>
              )}

              {/* Organization Details */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-[#0F4C5C]" /> Organization Details
                  </h2>
                  <button onClick={() => handleToggle("org")} className="text-sm text-[#0F4C5C]">
                    {openSections.org ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.org && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#E6F0FA] overflow-hidden">
                        {logoUrl ? (
                          <div className="relative w-full h-full">
                            <Image src={logoUrl} alt="Company Logo" fill className="object-cover" />
                          </div>
                        ) : (
                          <Avatar name={companyName || user?.name || "Company"} size="lg" />
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Company Logo</label>
                        <input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Company Name</label>
                        <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Website</label>
                        <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Address</label>
                        <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">About</label>
                        <textarea value={about} onChange={(e) => setAbout(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" rows={3} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Organization Details")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Contact & HR Details */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <UserCircle className="h-6 w-6 text-[#0F4C5C]" /> Contact & HR Details
                  </h2>
                  <button onClick={() => handleToggle("contact")} className="text-sm text-[#0F4C5C]">
                    {openSections.contact ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.contact && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Primary Contact Name</label>
                      <input value={primaryContactName} onChange={(e) => setPrimaryContactName(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Primary Contact Email</label>
                      <input type="email" value={primaryContactEmail} onChange={(e) => setPrimaryContactEmail(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text sm font-medium text-[#1A1A1A] mb-1">Primary Contact Phone</label>
                      <input value={primaryContactPhone} onChange={(e) => setPrimaryContactPhone(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">HR/Recruiter Name</label>
                      <input value={hrContactName} onChange={(e) => setHrContactName(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">HR/Recruiter Email</label>
                      <input type="email" value={hrContactEmail} onChange={(e) => setHrContactEmail(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Contact & HR Details")}>Save Changes</Button>
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
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input value={domainInput} onChange={(e) => setDomainInput(e.target.value)} placeholder="Preferred domain" className="flex-1 rounded-md border border-[#D1D5DB] p-2" />
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => {
                        const v = domainInput.trim();
                        if (!v) return;
                        setPreferredDomains((prev) => [...prev, v]);
                        setDomainInput("");
                      }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {preferredDomains.map((s) => (
                        <span key={s} className="px-2 py-1 rounded-md border border-[#D0E4F7] bg-white text-[#0F4C5C] text-xs inline-flex items-center gap-2">
                          {s}
                          <button className="text-[#0F4C5C]" onClick={() => setPreferredDomains((prev) => prev.filter((x) => x !== s))}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={locationInput} onChange={(e) => setLocationInput(e.target.value)} placeholder="Preferred location" className="flex-1 rounded-md border border-[#D1D5DB] p-2" />
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => {
                        const v = locationInput.trim();
                        if (!v) return;
                        setPreferredLocations((prev) => [...prev, v]);
                        setLocationInput("");
                      }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {preferredLocations.map((s) => (
                        <span key={s} className="px-2 py-1 rounded-md border border-[#D0E4F7] bg-white text-[#0F4C5C] text-xs inline-flex items-center gap-2">
                          {s}
                          <button className="text-[#0F4C5C]" onClick={() => setPreferredLocations((prev) => prev.filter((x) => x !== s))}>×</button>
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Work Mode</label>
                        <select
                          value={workMode}
                          onChange={(e) => setWorkMode(e.target.value as "onsite" | "remote" | "hybrid")}
                          className="w-full rounded-md border border-[#D1D5DB] p-2"
                        >
                          <option value="onsite">On-site</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Typical Duration</label>
                        <input value={durationRange} onChange={(e) => setDurationRange(e.target.value)} placeholder="e.g., 8–12 weeks" className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Stipend Range</label>
                        <input value={stipendRange} onChange={(e) => setStipendRange(e.target.value)} placeholder="e.g., ₹10k–₹25k" className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Internship Preferences")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Listing Defaults */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[#0F4C5C]" /> Listing Defaults
                  </h2>
                  <button onClick={() => handleToggle("listingDefaults")} className="text-sm text-[#0F4C5C]">
                    {openSections.listingDefaults ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.listingDefaults && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Default Eligibility</label>
                      <textarea value={defaultEligibility} onChange={(e) => setDefaultEligibility(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" rows={3} />
                    </div>
                    <div className="flex gap-2">
                      <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Required skill" className="flex-1 rounded-md border border-[#D1D5DB] p-2" />
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => {
                        const v = skillInput.trim();
                        if (!v) return;
                        setDefaultSkillsRequired((prev) => [...prev, v]);
                        setSkillInput("");
                      }}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {defaultSkillsRequired.map((s) => (
                        <span key={s} className="px-2 py-1 rounded-md border border-[#D0E4F7] bg-white text-[#0F4C5C] text-xs inline-flex items-center gap-2">
                          {s}
                          <button className="text-[#0F4C5C]" onClick={() => setDefaultSkillsRequired((prev) => prev.filter((x) => x !== s))}>×</button>
                        </span>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Default Screening Questions</label>
                      <textarea value={defaultQuestions} onChange={(e) => setDefaultQuestions(e.target.value)} className="w-full rounded-md border border-[#D1D5DB] p-2" rows={3} />
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Listing Defaults")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Application Workflow */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Cog className="h-6 w-6 text-[#0F4C5C]" /> Application Workflow
                  </h2>
                  <button onClick={() => handleToggle("workflow")} className="text-sm text-[#0F4C5C]">
                    {openSections.workflow ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.workflow && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input id="use-auto-screening" type="checkbox" checked={useAutoScreening} onChange={(e) => setUseAutoScreening(e.target.checked)} />
                        <label htmlFor="use-auto-screening" className="text-sm text-[#1A1A1A]">Enable auto-screening</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Auto-screening threshold (%)</label>
                        <input type="number" min={0} max={100} value={autoScreeningThreshold} onChange={(e) => setAutoScreeningThreshold(Number(e.target.value))} className="w-full rounded-md border border-[#D1D5DB] p-2" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="enable-shortlist" type="checkbox" checked={enableShortlist} onChange={(e) => setEnableShortlist(e.target.checked)} />
                        <label htmlFor="enable-shortlist" className="text-sm text-[#1A1A1A]">Enable shortlist stage</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="enable-interviews" type="checkbox" checked={enableInterviews} onChange={(e) => setEnableInterviews(e.target.checked)} />
                        <label htmlFor="enable-interviews" className="text-sm text-[#1A1A1A]">Enable interview stage</label>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Application Workflow")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Communication Preferences */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-[#0F4C5C]" /> Communication Preferences
                  </h2>
                  <button onClick={() => handleToggle("communication")} className="text-sm text-[#0F4C5C]">
                    {openSections.communication ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.communication && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input id="email-notifications" type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
                        <label htmlFor="email-notifications" className="text-sm text-[#1A1A1A]">Email notifications</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="inapp-notifications" type="checkbox" checked={inAppNotifications} onChange={(e) => setInAppNotifications(e.target.checked)} />
                        <label htmlFor="inapp-notifications" className="text-sm text-[#1A1A1A]">In-app notifications</label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Notification frequency</label>
                        <select
                          value={notificationFrequency}
                          onChange={(e) => setNotificationFrequency(e.target.value as "immediate" | "daily" | "weekly")}
                          className="w-full rounded-md border border-[#D1D5DB] p-2"
                        >
                          <option value="immediate">Immediate</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Communication Preferences")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Account Settings */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Settings className="h-6 w-6 text-[#0F4C5C]" /> Account Settings
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
                        <input id="twofa" type="checkbox" checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} />
                        <label htmlFor="twofa" className="text-sm text-[#1A1A1A]">Enable 2FA</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input id="theme-dark" type="checkbox" checked={themeDark} onChange={(e) => setThemeDark(e.target.checked)} />
                        <label htmlFor="theme-dark" className="text-sm text-[#1A1A1A]">Dark theme</label>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Account Settings")}>Save Changes</Button>
                    </div>
                  </div>
                )}
              </Card>

              {/* Privacy & Visibility */}
              <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                    <Eye className="h-6 w-6 text-[#0F4C5C]" /> Privacy & Visibility
                  </h2>
                  <button onClick={() => handleToggle("privacy")} className="text-sm text-[#0F4C5C]">
                    {openSections.privacy ? "Collapse" : "Expand"}
                  </button>
                </div>
                {openSections.privacy && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input id="public-company-profile" type="checkbox" checked={publicCompanyProfile} onChange={(e) => setPublicCompanyProfile(e.target.checked)} />
                      <label htmlFor="public-company-profile" className="text-sm text-[#1A1A1A]">Public company profile</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input id="contact-info-visible" type="checkbox" checked={contactInfoVisible} onChange={(e) => setContactInfoVisible(e.target.checked)} />
                      <label htmlFor="contact-info-visible" className="text-sm text-[#1A1A1A]">Show contact info to applicants</label>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#0F4C5C] hover:bg-[#0b3a46] text-white" onClick={() => handleSave("Privacy & Visibility")}>Save Changes</Button>
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