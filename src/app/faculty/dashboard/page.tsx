"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Users,
  NotebookPen,
  FileText,
  BadgeCheck,
  ClipboardList,
  Bell,
  BarChart3,
  Search,
  Filter,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  department: string;
  status: "Applied" | "Shortlisted" | "Ongoing" | "Completed";
  progress: number;
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, when: "beforeChildren" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function FacultyDashboardPage() {
  const { user, logout, loading } = useAuth();
  const isAuthed = user?.role === "faculty";
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch students from MongoDB API
  useEffect(() => {
    if (!isAuthed) return;
    setStudentsLoading(true);
    setStudentsError(null);
    fetch('/api/users?role=student')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch students');
        return res.json();
      })
      .then(json => {
        const list: Student[] = (Array.isArray(json.users) ? json.users : []).map(
          (u: Record<string, unknown>) => ({
            id: String(u.uid ?? u._id ?? ''),
            name: String(u.name ?? 'Unknown'),
            department: String(u.department ?? 'General'),
            status: 'Applied' as Student['status'],  // default; real status comes from internship applications
            progress: 0,
          })
        );
        setStudents(list);
      })
      .catch(() => setStudentsError('Could not load students. Showing placeholder data.'))
      .finally(() => setStudentsLoading(false));
  }, [isAuthed]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch = [s.name, s.id, s.department].some((v) =>
        v.toLowerCase().includes(searchQuery.toLowerCase())
      );
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      const matchesDept = deptFilter === "All" || s.department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [students, searchQuery, statusFilter, deptFilter]);

  // Derived analytics from filtered students (must be declared before any conditional returns)
  const analytics = useMemo(() => {
    const total = filteredStudents.length;
    const deptCounts: Record<string, number> = {};
    const statusCounts: Record<Student["status"], number> = {
      Applied: 0,
      Shortlisted: 0,
      Ongoing: 0,
      Completed: 0,
    };

    let avgProgress = 0;
    filteredStudents.forEach((s, i) => {
      deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
      statusCounts[s.status] += 1;
      avgProgress += s.progress;
    });
    avgProgress = total ? Math.round(avgProgress / total) : 0;

    const deptPercents = Object.entries(deptCounts).map(([dept, count]) => ({
      dept,
      percent: total ? Math.round((count / total) * 100) : 0,
      count,
    }));

    // Progress buckets for quick visualization
    const buckets = [
      { label: "0–25%", min: 0, max: 25, count: 0 },
      { label: "26–50%", min: 26, max: 50, count: 0 },
      { label: "51–75%", min: 51, max: 75, count: 0 },
      { label: "76–100%", min: 76, max: 100, count: 0 },
    ];
    filteredStudents.forEach((s) => {
      const b = buckets.find((b) => s.progress >= b.min && s.progress <= b.max);
      if (b) b.count += 1;
    });

    // Sparkline points from progress values
    const sparkValues = filteredStudents.map((s) => s.progress);
    const width = 200;
    const height = 60;
    const step = sparkValues.length > 1 ? width / (sparkValues.length - 1) : width;
    const path = sparkValues
      .map((v, i) => {
        const x = Math.round(i * step);
        const y = Math.round(height - (v / 100) * height);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

    return { total, deptPercents, statusCounts, avgProgress, buckets, spark: { width, height, path } };
  }, [filteredStudents]);

  // Auth guard UI
  if (loading) {
    return (
      <section className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border border-gray-200 rounded-md p-6">
            <p className="text-gray-600">Loading your session…</p>
          </div>
        </div>
      </section>
    );
  }

  if (user && !isAuthed) {
    const dest = user.role === 'student' ? '/student/dashboard' : '/industry/dashboard';
    router.replace(dest);
    return null;
  }

  if (!user) {
    return (
      <section className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border-l-4 border-[#0277BD] rounded-md p-4 mb-6">
            <p className="text-[#333333] text-sm md:text-base">
              You are not logged in as a faculty. Please
              <Link href="/login/faculty" className="underline ml-1 text-[#0056A3] hover:text-[#003D73]">login</Link>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!isAuthed) {
    return (
      <main className="min-h-screen bg-[#F0F4FA]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-[#0F3D67]">Faculty & Admin Dashboard</h1>
              <p className="mt-1 text-sm md:text-base text-[#555555]">Manage student internships, approvals, credits, and analytics</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login/faculty" className="text-[#0F3D67] underline">
                Login as Faculty
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="bg-white border-l-4 border-[#0F3D67] rounded-md p-4 mb-6">
            <p className="text-[#333333] text-sm md:text-base">
              You are not logged in as faculty. Please
              <Link href="/login/faculty" className="underline ml-1 text-[#0F3D67]">login</Link>.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F4FA]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#0F3D67]">Faculty & Admin Dashboard</h1>
            <p className="mt-1 text-sm md:text-base text-[#555555]">Manage student internships, approvals, credits, and analytics</p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className="border-[#0F3D67]" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Filters/Search */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Filters and Search">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-[#333333]">Search Students</label>
              <div className="mt-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" aria-hidden />
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#0F3D67] focus:ring-offset-2 focus:ring-offset-[#EDF2F7]"
                  placeholder="Search by name, ID, or department"
                  aria-label="Search text"
                />
              </div>
            </div>
            <div className="md:w-48">
              <label htmlFor="status" className="block text-sm font-medium text-[#333333]">Status</label>
              <div className="mt-1 relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]" aria-hidden />
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#0F3D67] focus:ring-offset-2 focus:ring-offset-[#EDF2F7]"
                  aria-label="Status filter"
                >
                  <option>All</option>
                  <option>Applied</option>
                  <option>Shortlisted</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <div className="md:w-56">
              <label htmlFor="dept" className="block text-sm font-medium text-[#333333]">Department</label>
              <select
                id="dept"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="mt-1 w-full px-3 py-2 rounded-md border border-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-[#0F3D67] focus:ring-offset-2 focus:ring-offset-[#EDF2F7]"
                aria-label="Department filter"
              >
                <option>All</option>
                <option>Computer Science</option>
                <option>Electronics</option>
                <option>Mechanical</option>
                <option>Civil</option>
              </select>
            </div>
            <div className="md:self-end">
              <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-4 py-2 rounded-md">Apply Filters</Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <DashboardSidebar
            title="Faculty Menu"
            items={([
              { label: "Dashboard/Home", href: "/faculty/dashboard", icon: <Users className="h-5 w-5" /> },
              { label: "Students Overview", href: "#students-overview", icon: <Users className="h-5 w-5" /> },
              { label: "Analytics Board", href: "#analytics-board", icon: <BarChart3 className="h-5 w-5" /> },
              { label: "Profile Settings", href: "/faculty/profile", icon: <NotebookPen className="h-5 w-5" /> },
            ] as SidebarItem[])}
          />
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Student Internship Tracker */}
          <motion.div variants={cardVariants} className="h-full" id="students-overview">
            <Card className="h-full bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Student Internship Tracker">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Student Internship Tracker</h2>
              </div>
              <div className="overflow-x-auto" role="region" aria-label="Internship tracker table">
                {studentsLoading && (
                  <div className="flex items-center gap-2 py-4 text-[#555555]">
                    <span className="h-4 w-4 rounded-full border-2 border-[#0F3D67] border-t-transparent animate-spin" />
                    <span className="text-sm">Loading students…</span>
                  </div>
                )}
                {studentsError && (
                  <div className="py-4 px-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md">{studentsError}</div>
                )}
                {!studentsLoading && (
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-[#333333]">
                      <th className="py-2 px-2">Name</th>
                      <th className="py-2 px-2">ID</th>
                      <th className="py-2 px-2">Department</th>
                      <th className="py-2 px-2">Status</th>
                      <th className="py-2 px-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#555555]">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="align-middle">
                        <td className="py-2 px-2 font-medium text-[#1A1A1A]">{s.name}</td>
                        <td className="py-2 px-2">{s.id}</td>
                        <td className="py-2 px-2">{s.department}</td>
                        <td className="py-2 px-2">
                          <span className="inline-flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-[#0F3D67]" aria-hidden />
                            {s.status}
                          </span>
                        </td>
                        <td className="py-2 px-2">
                          <div className="h-2 w-full bg-[#D9DEE6] rounded-full overflow-hidden" aria-label={`Progress ${s.progress}%`}>
                            <div className="h-full bg-[#0F3D67]" style={{ width: `${s.progress}%` }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Logbook Review & Approval */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Logbook Review & Approval">
              <div className="flex items-center gap-2 mb-4">
                <NotebookPen className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Logbook Review & Approval</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">Pending Logbooks</span>
                  <span className="text-[#1A1A1A] font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#333333]">Reviewed Today</span>
                  <span className="text-[#1A1A1A] font-medium">3</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-3 py-2 rounded-md" onClick={() => router.push('/faculty/logbook')}>Open Logbooks</Button>
                  <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-3 py-2 rounded-md">Bulk Approve</Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Report Generator Access */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Report Generator Access">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Report Generator Access</h2>
              </div>
              <p className="text-[#555555]">Generate consolidated internship reports and performance summaries.</p>
              <div className="mt-3 flex items-center gap-3">
                <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-3 py-2 rounded-md" onClick={() => router.push('/faculty/report')}>Generate Report</Button>
                <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-3 py-2 rounded-md">Download Last</Button>
              </div>
              <div className="mt-4">
                <h3 className="text-[#1A1A1A] font-medium">Recent Reports</h3>
                <ul className="mt-2 space-y-2 text-[#555555]">
                  <li>Weekly Summary - Oct 01</li>
                  <li>Dept Overview - Sep 24</li>
                  <li>Monthly Consolidated - Sep 01</li>
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* Credit Mapping Dashboard */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Credit Mapping Dashboard">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardList className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Credit Mapping Dashboard</h2>
              </div>
              <div className="overflow-x-auto" role="region" aria-label="Credits table">
                <table className="min-w-full text-left">
                  <thead>
                    <tr className="text-[#333333]">
                      <th className="py-2 px-2">Student</th>
                      <th className="py-2 px-2">Hours</th>
                      <th className="py-2 px-2">Credits</th>
                      <th className="py-2 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#555555]">
                    {filteredStudents.slice(0, 4).map((s) => (
                      <tr key={`c-${s.id}`} className="align-middle">
                        <td className="py-2 px-2 font-medium text-[#1A1A1A]">{s.name}</td>
                        <td className="py-2 px-2">{Math.max(10, s.progress)} hrs</td>
                        <td className="py-2 px-2">{Math.round(s.progress / 10)}</td>
                        <td className="py-2 px-2">
                          <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-2 py-1 rounded-md">Assign</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Feedback & Evaluation Panel */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Feedback & Evaluation Panel">
              <div className="flex items-center gap-2 mb-4">
                <BadgeCheck className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Feedback & Evaluation Panel</h2>
              </div>
              <ul className="space-y-3 text-[#555555]">
                <li>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1A1A]">Rubric Update</span>
                    <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-2 py-1 rounded-md">Edit</Button>
                  </div>
                  <p className="text-sm">Latest rubric applied for CS department.</p>
                </li>
                <li>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#1A1A1A]">Faculty Evaluations</span>
                    <Button className="bg-[#0F3D67] hover:bg-[#0B2F50] text-white px-2 py-1 rounded-md">Review</Button>
                  </div>
                  <p className="text-sm">5 evaluations pending approval.</p>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Notifications for pending tasks */}
          <motion.div variants={cardVariants} className="h-full">
            <Card className="h-full bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Notifications">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Notifications</h2>
              </div>
              <ul className="space-y-3 text-[#555555]">
                <li>
                  <span className="font-medium text-[#1A1A1A]">3 internship applications awaiting review</span>
                  <p className="text-sm">CS: 2, Mechanical: 1</p>
                </li>
                <li>
                  <span className="font-medium text-[#1A1A1A]">Logbook approvals due by Friday</span>
                  <p className="text-sm">8 pending logbooks across departments</p>
                </li>
                <li>
                  <span className="font-medium text-[#1A1A1A]">Monthly report scheduled</span>
                  <p className="text-sm">Generation on 1st of next month</p>
                </li>
              </ul>
            </Card>
          </motion.div>

          {/* Analytics Dashboard */}
          <motion.div variants={cardVariants} className="lg:col-span-2" id="analytics-board">
            <Card className="bg-white rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]" aria-label="Analytics Dashboard">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-6 w-6 text-[#0F3D67]" aria-hidden />
                <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Analytics Dashboard</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Breakdown */}
                <div>
                  <h3 className="text-[#333333] font-medium mb-2">Status Breakdown</h3>
                  <div className="space-y-2">
                    {(["Applied", "Shortlisted", "Ongoing", "Completed"] as const).map((label) => {
                      const value = analytics.statusCounts[label];
                      const percent = analytics.total ? Math.round((value / analytics.total) * 100) : 0;
                      return (
                        <div key={label}>
                          <div className="flex items-center justify-between text-sm text-[#555555] mb-1">
                            <span>{label}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#D9DEE6] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0F3D67]" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Participation by Department */}
                <div>
                  <h3 className="text-[#333333] font-medium mb-2">Participation by Department</h3>
                  <div className="space-y-2 text-[#555555]">
                    {analytics.deptPercents.length === 0 && (
                      <p className="text-sm">No data available for selected filters.</p>
                    )}
                    {analytics.deptPercents.map((d) => (
                      <div key={d.dept}>
                        <div className="flex items-center justify-between">
                          <span>{d.dept}</span>
                          <span className="font-medium text-[#1A1A1A]">{d.percent}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#D9DEE6] rounded-full overflow-hidden">
                          <div className="h-full bg-[#0F3D67]" style={{ width: `${d.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Trends (Sparkline) */}
                <div>
                  <h3 className="text-[#333333] font-medium mb-2">Performance Trends</h3>
                  <svg viewBox={`0 0 ${analytics.spark.width} ${analytics.spark.height}`} className="w-full h-20" role="img" aria-label="Performance sparkline">
                    <path d={analytics.spark.path || `M0,${analytics.spark.height}`} fill="none" stroke="#0F3D67" strokeWidth="3" />
                    <path d={analytics.spark.path || `M0,${analytics.spark.height}`} fill="none" stroke="#9FB6CC" strokeWidth="10" strokeOpacity="0.2" />
                  </svg>
                  <p className="text-sm text-[#555555]">Avg progress: {analytics.avgProgress}%</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {analytics.buckets.map((b) => {
                      const percent = analytics.total ? Math.round((b.count / analytics.total) * 100) : 0;
                      return (
                        <div key={b.label} className="text-xs">
                          <div className="flex items-center justify-between text-[#555555]">
                            <span>{b.label}</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#D9DEE6] rounded-full overflow-hidden">
                            <div className="h-full bg-[#0F3D67]" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </main>
  );
}