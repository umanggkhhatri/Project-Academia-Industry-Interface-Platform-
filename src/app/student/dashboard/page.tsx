"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/components/providers/AuthProvider";
import Card from "@/components/ui/Card";
import DashboardSidebar, { SidebarItem } from "@/components/layout/DashboardSidebar";
import { motion, Variants } from "framer-motion";
import {
  Briefcase,
  Sparkles,
  BarChart3,
  NotebookPen,
  Trophy,
  Bell,
  UserCircle,
  FileText,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  CloudUpload,
} from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, when: "beforeChildren" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

// Skill synonyms for better matching
const skillSynonyms: Record<string, string[]> = {
  'Machine Learning': ['ml', 'machine-learning', 'machine learning'],
  'Deep Learning': ['dl', 'deep-learning', 'deep learning'],
  'Artificial Intelligence': ['ai', 'a.i.', 'artificial intelligence'],
  'Natural Language Processing': ['nlp', 'natural-language-processing'],
  'Computer Vision': ['cv', 'computer-vision', 'image processing'],
  'Data Science': ['data-science', 'ds', 'data science'],
  'JavaScript': ['js', 'javascript'],
  'TypeScript': ['ts', 'typescript'],
  'React': ['react.js', 'reactjs', 'react'],
  'Node.js': ['node', 'nodejs', 'node.js'],
  'Python': ['py', 'python3', 'python'],
  'C++': ['cpp', 'c plus plus', 'c++'],
  'C#': ['c sharp', 'c-sharp', 'c#'],
  'AWS': ['amazon web services', 'aws cloud', 'aws'],
  'Azure': ['microsoft azure', 'azure cloud', 'azure'],
  'GCP': ['google cloud', 'gcp', 'google cloud platform'],
  'SQL': ['mysql', 'postgresql', 'postgres', 'sqlite', 'sql server'],
  'NoSQL': ['mongodb', 'cassandra', 'redis', 'dynamodb'],
};

// Common skills for autocomplete
const commonSkills = [
  'Python', 'Java', 'JavaScript', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
  'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Express',
  'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Machine Learning', 'Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision',
  'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins',
  'Git', 'GitHub', 'Linux', 'Agile', 'Scrum',
  'Data Science', 'Data Analysis', 'Statistics', 'Excel', 'Tableau', 'Power BI',
  'Accounting', 'Financial Analysis', 'Marketing', 'Sales', 'HR', 'Management',
];

type ExtractedSkill = {
  name: string;
  confidence: number;
};

export default function StudentDashboardPage() {
  const { user, logout, loading } = useAuth();
  const isAuthed = user?.role === "student";
  const router = useRouter();

  // Redirect on role mismatch after hooks to satisfy rules-of-hooks
  useEffect(() => {
    if (user && !isAuthed) {
      const dest = user.role === 'faculty' ? '/faculty/dashboard' : '/industry/dashboard';
      router.replace(dest);
    }
  }, [user, isAuthed, router]);

  const [activeTab, setActiveTab] = useState<
    "active"
    | "progress"
    | "resources"
    | "finder"
    | "chat"
  >("active");

  // Internship Finder state
  type Internship = {
    id?: number;
    title: string;
    company: string;
    location: string;
    duration: string;
    stipend?: string;
    description?: string;
    required_skills?: string[];
    preferred_skills?: string[];
    link?: string;
  };

  const [finderData, setFinderData] = useState<Internship[]>([]);
  const [finderLoading, setFinderLoading] = useState(false);
  const [finderError, setFinderError] = useState<string | null>(null);
  const [finderMode, setFinderMode] = useState<"skills" | "resume">("skills");
  const [skillInput, setSkillInput] = useState<string>("");
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [resumeSkills, setResumeSkills] = useState<ExtractedSkill[]>([]);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeProcessing, setResumeProcessing] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement | null>(null);

  // Study Resources state
  type StudyResource = {
    title: string;
    description: string;
    type: "PDF" | "video" | "article";
    link: string;
    category: "Pre-Internship" | "Soft Skills" | "Domain Basics";
  };

  const [resourcesData, setResourcesData] = useState<StudyResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [resourcesError, setResourcesError] = useState<string | null>(null);
  const [resourcesQuery, setResourcesQuery] = useState("");
  const [resourcesCategory, setResourcesCategory] = useState<
    "All" | "Pre-Internship" | "Soft Skills" | "Domain Basics"
  >("All");
  const [resourcesType, setResourcesType] = useState<"All" | "PDF" | "video" | "article">("All");

  // Guard views rendered after all hooks are declared
  const guardView = (() => {
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
      return (
        <section className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white border border-gray-200 rounded-md p-6">
              <p className="text-gray-600">Redirecting to your dashboard…</p>
            </div>
          </div>
        </section>
      );
    }
    if (!user) {
      return (
        <section className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white border-l-4 border-[#0277BD] rounded-md p-4 mb-6">
              <p className="text-[#333333] text-sm md:text-base">
                You are not logged in as a student. Please
                <Link href="/login/student" className="underline ml-1 text-[#0056A3] hover:text-[#003D73]">login</Link>.
              </p>
            </div>
          </div>
        </section>
      );
    }
    return null;
  })();

  // Do not return early before hooks; render guardView at final return

  // Load PDF.js on client side with robust worker setup
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
        // Prefer bundler-resolved worker URL; fallback to CDN if unavailable
        try {
          const workerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
          pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
        } catch (e) {
          const v = (pdfjsLib as Record<string, unknown>).version;
          const version = typeof v === 'string' ? v : '4.0.379';
          pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`;
        }
        setPdfLoaded(true);
      } catch (err) {
        console.error('Failed to load PDF.js:', err);
      }
    };
    loadPdfJs();
  }, []);

  // Fetch internships from MongoDB API
  useEffect(() => {
    if (activeTab !== "finder") return;
    let mounted = true;
    const fetchData = async () => {
      setFinderLoading(true);
      setFinderError(null);
      try {
        const res = await fetch("/api/internships?limit=200", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch internships");
        const json = await res.json();
        if (!mounted) return;
        // API returns { internships: [...], total, limit, skip }
        const list = Array.isArray(json.internships) ? json.internships : [];
        // Map MongoDB fields (_id, skillsRequired) to the local Internship type
        setFinderData(list.map((item: Record<string, unknown>) => ({
          id: item._id,
          title: item.title,
          company: item.company,
          location: item.location,
          duration: item.durationWeeks ? `${item.durationWeeks} weeks` : '',
          stipend: item.stipend,
          description: item.description,
          required_skills: Array.isArray(item.skillsRequired) ? item.skillsRequired : [],
          preferred_skills: [],
          link: item.link,
        })));
      } catch (e) {
        if (!mounted) return;
        setFinderError("Failed to load internships. Please try again later.");
      } finally {
        if (!mounted) return;
        setFinderLoading(false);
      }
    };
    fetchData();
    return () => { mounted = false; };
  }, [activeTab]);

  // Canonicalize skill names
  const canonicalizeSkill = (raw: string): string => {
    const lc = raw.toLowerCase().trim();
    for (const [canon, aliases] of Object.entries(skillSynonyms)) {
      if (canon.toLowerCase() === lc || aliases.some(a => a.toLowerCase() === lc)) {
        return canon;
      }
    }
    // Return with proper capitalization
    return raw.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Type-safe text extraction for PDF.js text items
  const textItemToString = (item: unknown): string => {
    if (item && typeof item === 'object' && 'str' in item) {
      const s = (item as { str?: unknown }).str;
      if (typeof s === 'string') return s;
    }
    return '';
  };

  // Extract text from PDF with improved robustness
  const extractTextFromPDF = async (file: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    const arrayBuffer = await file.arrayBuffer();
    try {
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map(textItemToString)
          .filter(Boolean)
          .join(' ');
        text += pageText + (i < pdf.numPages ? '\n' : '');
      }

      return text.trim();
    } catch (e) {
      console.error('PDF parsing failed:', e);
      throw new Error('Failed to parse PDF. Please try another file.');
    }
  };

  // Extract skills from text with confidence scoring
  const extractSkillsFromText = (text: string): ExtractedSkill[] => {
    const normalizedText = text.toLowerCase();
    const results: ExtractedSkill[] = [];
    const seen = new Set<string>();

    commonSkills.forEach(skillName => {
      const canon = canonicalizeSkill(skillName);
      const phrase = canon.toLowerCase();
      const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      let occurrences = 0;

      // Count occurrences of the skill
      if (phrase.includes(' ')) {
        const regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
        const matches = text.match(regex);
        occurrences = matches ? matches.length : 0;
      } else {
        const regex = new RegExp(`(^|[^A-Za-z0-9])${escapedPhrase}([^A-Za-z0-9]|$)`, 'gi');
        const matches = normalizedText.match(regex);
        occurrences = matches ? matches.length : 0;
      }

      // Check synonyms
      const aliases = skillSynonyms[canon] || [];
      aliases.forEach(alias => {
        const aliasPhrase = alias.toLowerCase();
        const escapedAlias = aliasPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        if (aliasPhrase.includes(' ')) {
          const regex = new RegExp(`\\b${escapedAlias}\\b`, 'gi');
          const matches = text.match(regex);
          occurrences += matches ? matches.length : 0;
        } else {
          const regex = new RegExp(`(^|[^A-Za-z0-9])${escapedAlias}([^A-Za-z0-9]|$)`, 'gi');
          const matches = normalizedText.match(regex);
          occurrences += matches ? matches.length : 0;
        }
      });

      if (occurrences > 0) {
        // Calculate confidence based on occurrences
        let confidence = Math.min(0.95, 0.40 + 0.15 * Math.min(occurrences, 4));
        
        // Boost for multi-word phrases
        if (phrase.includes(' ')) {
          confidence = Math.min(0.98, confidence + 0.10);
        }

        if (!seen.has(canon)) {
          seen.add(canon);
          results.push({ name: canon, confidence });
        }
      }
    });

    // Sort by confidence
    return results.sort((a, b) => b.confidence - a.confidence);
  };

  const handleResumeUpload = async (file: File) => {
    setResumeError(null);
    setResumeSkills([]);
    if (!file) return;

    // Check file type (PDF or TXT)
    const isText = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isText && !isPdf) {
      // Mirror internships validation message content
      setResumeError('Please upload a PDF or TXT file only.');
      return;
    }

    if (isPdf && file.size > 10 * 1024 * 1024) {
      setResumeError('File size must be less than 10MB');
      return;
    }

    if (isPdf && !pdfLoaded) {
      setResumeError('PDF processing is still loading. Please try again in a moment.');
      return;
    }

    setResumeProcessing(true);

    try {
      let text = '';

      if (isText) {
        // Handle text files
        text = await file.text();
      } else {
        // Handle PDF files
        text = await extractTextFromPDF(file);
      }

      // Extract skills from text
      const skills = extractSkillsFromText(text);
      setResumeSkills(skills);

      if (skills.length === 0) {
        setResumeError('No recognizable skills found in the resume. Please try adding skills manually.');
      }
    } catch (err) {
      console.error('Error processing resume:', err);
      setResumeError('Error processing resume. Please try again or add skills manually.');
    } finally {
      setResumeProcessing(false);
      // Reset file input to allow re-uploading the same file
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  };

  const onDropResume = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleResumeUpload(file);
  };

  const onDragOverResume = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const openFilePicker = () => {
    pdfInputRef.current?.click();
  };

  // User skills (from manual input or resume)
  const userSkills = useMemo(() => {
    if (finderMode === "skills") {
      return skillsList.map(s => canonicalizeSkill(s).toLowerCase());
    } else {
      return resumeSkills
        .filter(s => s.confidence >= 0.55)
        .map(s => canonicalizeSkill(s.name).toLowerCase());
    }
  }, [finderMode, skillsList, resumeSkills]);

  // Calculate match score
  const calculateMatch = (internship: Internship): number => {
    if (userSkills.length === 0) return 0;
    
    const allSkills = [
      ...(internship.required_skills || []),
      ...(internship.preferred_skills || [])
    ].map(s => canonicalizeSkill(s).toLowerCase());
    
    const matches = allSkills.filter(s => userSkills.includes(s));
    
    // Score: percentage of user skills that match + bonus
    return Math.min(100, (matches.length / Math.max(userSkills.length, 1)) * 100 + 20);
  };

  // Recommended internships
  const recommendedFinder = useMemo(() => {
    if (!finderData.length || !userSkills.length) {
      return [] as (Internship & { score: number; matchedSkills: string[] })[];
    }

    const scored = finderData.map((job) => {
      const score = calculateMatch(job);
      const allSkills = [...(job.required_skills || []), ...(job.preferred_skills || [])];
      const matchedSkills = allSkills.filter(s => 
        userSkills.includes(canonicalizeSkill(s).toLowerCase())
      );
      
      return { ...job, score, matchedSkills };
    }).filter((j) => j.score > 0);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6); // Show top 6 in dashboard
  }, [finderData, userSkills]);

  const addSkillFromInput = () => {
    const raw = skillInput.trim();
    if (!raw) return;
    const normalized = raw.replace(/[,;]+$/g, "").trim();
    if (!normalized) return;
    const canonical = canonicalizeSkill(normalized);
    if (!skillsList.some((s) => canonicalizeSkill(s).toLowerCase() === canonical.toLowerCase())) {
      setSkillsList((prev) => [...prev, canonical]);
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => {
    setSkillsList((prev) => prev.filter((k) => canonicalizeSkill(k).toLowerCase() !== canonicalizeSkill(s).toLowerCase()));
  };

  // Fetch study resources from MongoDB API
  useEffect(() => {
    if (activeTab !== "resources") return;
    let mounted = true;
    const loadResources = async () => {
      setResourcesLoading(true);
      setResourcesError(null);
      try {
        const res = await fetch("/api/study-resources", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch study resources");
        const json = await res.json();
        if (!mounted) return;
        // API returns { resources: [...] }
        setResourcesData(Array.isArray(json.resources) ? json.resources : []);
      } catch (e) {
        if (!mounted) return;
        setResourcesError("Failed to load study resources. Please try again later.");
      } finally {
        if (!mounted) return;
        setResourcesLoading(false);
      }
    };
    loadResources();
    return () => { mounted = false; };
  }, [activeTab]);

  const filteredResources = useMemo(() => {
    let list = resourcesData;
    if (resourcesCategory !== "All") {
      list = list.filter((r) => r.category === resourcesCategory);
    }
    if (resourcesType !== "All") {
      list = list.filter((r) => r.type === resourcesType);
    }
    const q = resourcesQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((r) =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [resourcesData, resourcesCategory, resourcesType, resourcesQuery]);

  const recommended = [
    { title: "Frontend Intern", company: "TechNova", skills: ["React", "TypeScript", "CSS"], deadline: "2025-10-15" },
    { title: "Data Analyst Intern", company: "DataWorks", skills: ["Python", "SQL", "Tableau"], deadline: "2025-10-20" },
    { title: "Cloud Ops Intern", company: "SkyNet", skills: ["AWS", "Docker", "CI/CD"], deadline: "2025-11-05" },
  ];

  const active = [
    { title: "AI Research Intern", company: "InnovateAI", status: "In Progress", progress: 65 },
    { title: "Mobile Dev Intern", company: "Appify", status: "Applied", progress: 15 },
  ];

  const skills = [
    { name: "React", level: 78 },
    { name: "TypeScript", level: 70 },
    { name: "Python", level: 60 },
    { name: "SQL", level: 55 },
  ];

  const credits = { earned: 12, total: 20 };
  const deadlines = [
    { text: "Submit weekly logbook", due: "Fri, Oct 10", urgent: true },
    { text: "Resume update for HR review", due: "Tue, Oct 14", urgent: false },
  ];

  return guardView ?? (
    <section className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A]">Student Portal</h1>
          {isAuthed && (
            <button
              onClick={logout}
              aria-label="Logout"
              className="px-4 py-2 rounded-md bg-[#0056A3] text-white hover:bg-[#003D73] transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          )}
        </div>

        {!isAuthed && (
          <div className="bg-white border-l-4 border-[#0277BD] rounded-md p-4 mb-6">
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
              items={([
                {
                  label: "Dashboard/Home",
                  href: "/student/dashboard",
                  icon: <UserCircle className="h-5 w-5" />,
                },
                {
                  label: "Active Internships",
                  onClick: () => setActiveTab("active"),
                  icon: <Briefcase className="h-5 w-5" />,
                  active: activeTab === "active",
                },
                {
                  label: "Live Interns Progress",
                  onClick: () => setActiveTab("progress"),
                  icon: <BarChart3 className="h-5 w-5" />,
                  active: activeTab === "progress",
                },
                {
                  label: "Study Resources",
                  onClick: () => setActiveTab("resources"),
                  icon: <FileText className="h-5 w-5" />,
                  active: activeTab === "resources",
                },
                {
                  label: "Internship Finder",
                  onClick: () => setActiveTab("finder"),
                  icon: <Sparkles className="h-5 w-5" />,
                  active: activeTab === "finder",
                },
                {
                  label: "Chat Support",
                  onClick: () => setActiveTab("chat"),
                  icon: <MessageSquare className="h-5 w-5" />,
                  active: activeTab === "chat",
                },
                {
                  label: "Profile Settings",
                  href: "/student/profile",
                  icon: <UserCircle className="h-5 w-5" />,
                },
              ] as SidebarItem[])}
              footerLinks={[
                { label: "Logbook", href: "/student/logbook" },
                { label: "Report Generator", href: "/student/report" },
                { label: "Resume Builder", href: "/student/resume" },
              ]}
            />

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === "active" && (
                  <motion.div variants={cardVariants} className="md:col-span-2">
                    <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-6 w-6 text-[#0056A3]" />
                          <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Active Internships</h2>
                        </div>
                        <span className="text-xs md:text-sm text-[#333333]">Status tracker</span>
                      </div>
                      <ul className="space-y-4">
                        {active.map((item, idx) => (
                          <li key={idx} className="group">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm md:text-base font-medium text-[#1A1A1A]">{item.title}</p>
                                <p className="text-xs md:text-sm text-[#666666]">{item.company}</p>
                              </div>
                              <span className="inline-flex items-center gap-2 text-xs md:text-sm">
                                <CheckCircle2 className="h-4 w-4 text-[#0277BD]" />
                                <span className="text-[#333333]">{item.status}</span>
                              </span>
                            </div>
                            <div className="mt-2 h-2 w-full bg-[#D9DEE6] rounded-full overflow-hidden">
                              <div className="h-full bg-[#0277BD] transition-colors" style={{ width: `${item.progress}%` }} />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "progress" && (
                  <motion.div variants={cardVariants} className="md:col-span-2">
                    <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="h-6 w-6 text-[#0056A3]" />
                        <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Live Interns Progress</h2>
                      </div>
                      <div className="space-y-4">
                        {active.map((p, idx) => (
                          <div key={idx} className="p-3 rounded-lg border border-[#E5E7EB]">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-[#1A1A1A]">{p.title}</div>
                              <div className="text-sm text-[#666666]">{p.progress}%</div>
                            </div>
                            <div className="h-2 w-full bg-[#D9DEE6] rounded-full overflow-hidden mt-2">
                              <div className="h-full bg-[#0056A3]" style={{ width: `${p.progress}%` }} />
                            </div>
                            <div className="text-sm text-[#666666] mt-2">Company: {p.company} • Status: {p.status}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "resources" && (
                  <motion.div variants={cardVariants} className="md:col-span-2">
                    <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="h-6 w-6 text-[#0056A3]" />
                        <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Study Resources</h2>
                      </div>
                      {/* Controls */}
                      <div className="flex flex-col md:flex-row gap-3 md:items-end mb-4">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Search</label>
                          <input
                            type="text"
                            value={resourcesQuery}
                            onChange={(e) => setResourcesQuery(e.target.value)}
                            placeholder="Search title or description"
                            className="w-full px-3 py-2 rounded-md border border-[#D9DEE6] bg-white text-[#1A1A1A]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Category</label>
                          <div className="flex flex-wrap gap-2">
                            {(["All","Pre-Internship","Soft Skills","Domain Basics"] as const).map((c) => (
                              <button
                                key={c}
                                className={`px-3 py-2 rounded-md text-sm border ${resourcesCategory === c ? "bg-[#0056A3] text-white border-transparent" : "border-[#D9DEE6] text-[#1A1A1A] hover:bg-[#E6F0FA]"}`}
                                onClick={() => setResourcesCategory(c)}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Type</label>
                          <div className="flex flex-wrap gap-2">
                            {(["All","PDF","video","article"] as const).map((t) => (
                              <button
                                key={t}
                                className={`px-3 py-2 rounded-md text-sm border ${resourcesType === t ? "bg-[#0056A3] text-white border-transparent" : "border-[#D9DEE6] text-[#1A1A1A] hover:bg-[#E6F0FA]"}`}
                                onClick={() => setResourcesType(t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {resourcesLoading && <p className="text-sm text-[#666666]">Loading resources…</p>}
                      {resourcesError && <p className="text-sm text-[#A61B1B]">{resourcesError}</p>}

                      {!resourcesLoading && !resourcesError && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredResources.map((r, idx) => (
                            <div key={idx} className="p-3 rounded-lg border border-[#E5E7EB] bg-white">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="font-medium text-[#1A1A1A]">{r.title}</div>
                                  <p className="text-sm text-[#666666] mt-1">{r.description}</p>
                                </div>
                                <span className="text-xs px-2 py-1 rounded-md border border-[#D0E4F7] text-[#0056A3] bg-white">{r.type}</span>
                              </div>
                              <div className="mt-2 text-xs text-[#666666]">Category: {r.category}</div>
                              <div className="mt-3 flex gap-2">
                                <a
                                  href={r.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 rounded-md bg-[#0056A3] text-white hover:bg-[#003D73] text-sm"
                                >
                                  Open Resource
                                </a>
                              </div>
                            </div>
                          ))}
                          {filteredResources.length === 0 && (
                            <p className="text-sm text-[#666666] md:col-span-2 lg:col-span-3">No resources found. Try adjusting filters or search.</p>
                          )}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                )}

                {activeTab === "chat" && (
                  <motion.div variants={cardVariants} className="md:col-span-2">
                    <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-6 w-6 text-[#0056A3]" />
                          <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Chat Support</h2>
                        </div>
                        <Link href="/student/support" className="text-[#0056A3] hover:text-[#003D73] text-sm md:text-base">Open Chat</Link>
                      </div>
                      <p className="text-sm md:text-base text-[#333333]">Access real-time support from the Student Helpdesk. Click &quot;Open Chat&quot; to start a conversation.</p>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "finder" && (
                  <motion.div variants={cardVariants} className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A] flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-[#0056A3]" /> Internship Finder
                      </h2>
                      <span className="text-xs md:text-sm text-[#333333]">Recommend by skills or resume</span>
                    </div>
                    {/* Mode Switch */}
                    <Card className="bg-white p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap gap-3">
                          <button
                            className={`px-4 py-2 rounded-md text-sm md:text-base border ${finderMode === "skills" ? "bg-[#0056A3] text-white border-transparent" : "border-[#D9DEE6] text-[#1A1A1A] hover:bg-[#E6F0FA]"}`}
                            onClick={() => setFinderMode("skills")}
                          >
                            Search by Skills
                          </button>
                          <button
                            className={`px-4 py-2 rounded-md text-sm md:text-base border ${finderMode === "resume" ? "bg-[#0056A3] text-white border-transparent" : "border-[#D9DEE6] text-[#1A1A1A] hover:bg-[#E6F0FA]"}`}
                            onClick={() => setFinderMode("resume")}
                          >
                            Upload Resume
                          </button>
                        </div>

                        {finderMode === "skills" && (
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Enter Your Skills</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                placeholder="Type a skill and press Enter (e.g., Python, Machine Learning, React...)"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkillFromInput(); } }}
                                className="flex-1 px-3 py-2 rounded-md border border-[#D9DEE6] bg-white text-[#1A1A1A]"
                              />
                              <Button
                                variant="outline"
                                size="md"
                                className="border-[#0056A3] text-[#0056A3] hover:bg-[#E6F0FA]"
                                onClick={addSkillFromInput}
                              >
                                Add
                              </Button>
                            </div>
                            {skillsList.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {skillsList.map((s) => (
                                  <span key={s} className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-[#D0E4F7] bg-white text-[#0056A3] text-xs">
                                    {s}
                                    <button onClick={() => removeSkill(s)} className="text-[#0056A3] hover:text-[#003D73]">×</button>
                                  </span>
                                ))}
                                <button
                                  className="text-xs underline text-[#0056A3] hover:text-[#003D73]"
                                  onClick={() => setSkillsList([])}
                                >
                                  Clear all
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {finderMode === "resume" && (
                          <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Upload Your Resume</label>
                            <div
                              onDragOver={onDragOverResume}
                              onDrop={onDropResume}
                              className="rounded-lg border-2 border-dashed border-[#D9DEE6] bg-[#0B66C2] text-white p-8 flex flex-col items-center justify-center gap-3"
                            >
                              <CloudUpload className="h-8 w-8" />
                              <div className="text-center">
                                <p className="font-medium">Drag & Drop your resume here</p>
                                <p className="text-sm opacity-90">or click to browse (PDF or TXT, max 10MB)</p>
                              </div>
                              <button
                                type="button"
                                onClick={openFilePicker}
                                className="mt-2 px-4 py-2 rounded-md bg-white text-[#0056A3] hover:bg-[#E6F0FA]"
                              >
                                Browse
                              </button>
                              <input
                                ref={pdfInputRef}
                                type="file"
                                accept="application/pdf,.pdf,.txt,text/plain"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleResumeUpload(f); }}
                                className="hidden"
                              />
                            </div>
                            {resumeProcessing && (
                              <div className="mt-3 flex items-center gap-2 text-sm text-[#0056A3]">
                                <div className="h-4 w-4 rounded-full border-2 border-[#0056A3] border-t-transparent animate-spin" />
                                <span>Processing resume...</span>
                              </div>
                            )}
                            {resumeError && (
                              <p className="mt-2 text-sm text-[#A61B1B]">{resumeError}</p>
                            )}
                            {resumeSkills.length > 0 && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm font-semibold text-green-800 mb-2">
                                  Extracted {resumeSkills.length} skills from resume:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {resumeSkills.map((s) => (
                                    <span key={s.name} className="px-2 py-1 rounded-md bg-green-100 border border-green-300 text-green-800 text-xs">
                                      {s.name} ({Math.round(s.confidence * 100)}%)
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>

                    {/* Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {finderLoading && (
                        <Card className="bg-white p-4">Loading internships…</Card>
                      )}
                      {finderError && (
                        <Card className="bg-white p-4 text-[#A61B1B]">{finderError}</Card>
                      )}
                      {!finderLoading && !finderError && userSkills.length === 0 && (
                        <Card className="bg-white p-4">Enter skills or upload your resume to see recommendations.</Card>
                      )}
                      {!finderLoading && !finderError && userSkills.length > 0 && recommendedFinder.length === 0 && (
                        <Card className="bg-white p-4">No matching internships found. Try adding different skills.</Card>
                      )}
                      {recommendedFinder.map((job, idx) => (
                        <Card key={idx} className="bg-white p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-[#1A1A1A]">{job.title}</h3>
                            <span className="px-2 py-1 text-xs rounded bg-[#E6F0FA] text-[#0056A3]">{Math.round(job.score)}%</span>
                          </div>
                          <p className="text-sm text-[#666666]">{job.company}</p>
                          <p className="text-sm text-[#666666]">{job.location} • {job.duration}</p>
                          {job.matchedSkills && job.matchedSkills.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="text-xs text-[#666666]">Matched:</span>
                              {job.matchedSkills.slice(0, 3).map((s) => (
                                <span key={s} className="px-2 py-1 rounded-md bg-[#0056A3] text-white text-xs">
                                  {s}
                                </span>
                              ))}
                              {job.matchedSkills.length > 3 && (
                                <span className="text-xs text-[#666666]">+{job.matchedSkills.length - 3} more</span>
                              )}
                            </div>
                          )}
                          <div className="mt-4 flex gap-3">
                            {job.link ? (
                              <Link href={job.link} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md bg-[#0056A3] text-white hover:bg-[#003D73] text-sm">View Details</Link>
                            ) : (
                              <Button size="sm" className="bg-[#0056A3] text-white hover:bg-[#003D73]">Apply</Button>
                            )}
                            <Button variant="outline" size="sm" className="border-[#0056A3] text-[#0056A3] hover:bg-[#E6F0FA]">Save</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Default dashboard extras */}
                {(activeTab === "active" || activeTab === "progress") && (
                  <>
                    <motion.div variants={cardVariants}>
                      <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-2 mb-4">
                          <BarChart3 className="h-6 w-6 text-[#0056A3]" />
                          <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Skill Progress</h2>
                        </div>
                        <div className="space-y-4">
                          {skills.map((skill) => (
                            <div key={skill.name}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm md:text-base font-medium text-[#1A1A1A]">{skill.name}</span>
                                <span className="text-xs md:text-sm text-[#666666]">{skill.level}%</span>
                              </div>
                              <div className="mt-2 h-2 w-full bg-[#D9DEE6] rounded-full overflow-hidden">
                                <div className="h-full" style={{ width: `${skill.level}%`, backgroundColor: skill.name === 'React' ? '#1976D2' : skill.name === 'TypeScript' ? '#1565C0' : skill.name === 'Python' ? '#2E7D32' : skill.name === 'SQL' ? '#6A1B9A' : '#0056A3' }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>

                    <motion.div variants={cardVariants}>
                      <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                        <div className="flex items-center gap-2 mb-4">
                          <Bell className="h-6 w-6 text-[#0056A3]" />
                          <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Notifications & Deadlines</h2>
                        </div>
                        <ul className="space-y-3">
                          {deadlines.map((d, idx) => (
                            <li key={idx} className="flex items-start justify-between">
                              <div>
                                <p className="text-sm md:text-base text-[#1A1A1A]">{d.text}</p>
                                <p className="text-xs md:text-sm text-[#666666]">Due: {d.due}</p>
                              </div>
                              {d.urgent && (
                                <span className="px-2 py-1 rounded text-xs bg-[#B00020] text-white">Urgent</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </motion.div>
                  </>
                )}

                {activeTab === "resources" && (
                  <motion.div variants={cardVariants}>
                    <Card className="bg-[#FFFFFF] rounded-lg p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                      <div className="flex items-center gap-2 mb-4">
                        <UserCircle className="h-6 w-6 text-[#0056A3]" />
                        <h2 className="text-lg md:text-xl font-semibold text-[#1A1A1A]">Profile & Resume Builder</h2>
                      </div>
                      <p className="text-sm md:text-base text-[#333333] mb-4">
                        Keep your profile updated and generate recruiter-friendly resumes.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/student/profile" className="px-4 py-2 rounded-md bg-[#0056A3] text-white hover:bg-[#003D73] transition-colors text-sm md:text-base">
                          Edit Profile
                        </Link>
                        <Link href="/student/resume" className="px-4 py-2 rounded-md border border-[#0056A3] text-[#0056A3] hover:bg-[#E6F0FA] transition-colors text-sm md:text-base">
                          Build Resume
                        </Link>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        )}

        {/* Helpful links row */}
        {isAuthed && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <Link href="/student/help" className="block">
              <Card className="bg-[#FFFFFF] rounded-lg h-full p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-2 h-full">
                  <FileText className="h-5 w-5 text-[#0056A3]" />
                  <span className="text-sm md:text-base text-[#1A1A1A]">Guides & Docs</span>
                </div>
              </Card>
            </Link>
            <Link href="/student/calendar" className="block">
              <Card className="bg-[#FFFFFF] rounded-lg h-full p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-2 h-full">
                  <CalendarDays className="h-5 w-5 text-[#0056A3]" />
                  <span className="text-sm md:text-base text-[#1A1A1A]">Calendar</span>
                </div>
              </Card>
            </Link>
            <Link href="/student/support" className="block">
              <Card className="bg-[#FFFFFF] rounded-lg h-full p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                <div className="flex items-center gap-2 h-full">
                  <MessageSquare className="h-5 w-5 text-[#0056A3]" />
                  <span className="text-sm md:text-base text-[#1A1A1A]">Chat Support</span>
                </div>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}