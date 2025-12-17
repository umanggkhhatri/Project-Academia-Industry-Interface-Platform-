// "use client";
// import { useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import Card from "@/components/ui/Card";
// import Button from "@/components/ui/Button";
// import { Search, Upload, X, Tags, FileText, Brain, Trophy, Building2, MapPin, Clock, DollarSign, TrendingUp } from "lucide-react";

// type SimpleInternship = {
//   title: string;
//   company: string;
//   location: string;
//   duration: string;
//   stipend?: string;
//   description?: string;
//   link?: string;
//   required_skills?: string[];
//   preferred_skills?: string[];
//   score?: number;
//   matchedSkills?: string[];
// };

// type ExtractedSkill = {
//   name: string;
//   confidence: number;
// };

// // Common skills for suggestions
// const commonSkills = [
//   'Python', 'Java', 'JavaScript', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go',
//   'React', 'Angular', 'Vue', 'Node.js', 'Django', 'Flask', 'Spring', 'Express',
//   'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
//   'Machine Learning', 'Deep Learning', 'Neural Networks', 'NLP', 'Computer Vision',
//   'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn',
//   'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins',
//   'Git', 'GitHub', 'Linux', 'Agile', 'Scrum',
//   'Data Science', 'Data Analysis', 'Statistics', 'Excel', 'Tableau', 'Power BI',
//   'Accounting', 'Financial Analysis', 'Marketing', 'Sales', 'HR', 'Management',
// ];

// // Skill synonyms for better matching
// const skillSynonyms: Record<string, string[]> = {
//   'Machine Learning': ['ml', 'machine-learning'],
//   'Deep Learning': ['dl', 'deep-learning'],
//   'Artificial Intelligence': ['ai', 'a.i.'],
//   'Natural Language Processing': ['nlp'],
//   'Computer Vision': ['cv', 'image processing'],
//   'Data Science': ['data-science', 'ds'],
//   'JavaScript': ['js', 'javascript'],
//   'TypeScript': ['ts', 'typescript'],
//   'React': ['react.js', 'reactjs'],
//   'Node.js': ['node', 'nodejs'],
//   'Python': ['py', 'python3'],
//   'C++': ['cpp', 'c plus plus'],
//   'C#': ['c sharp', 'c-sharp'],
// };

// export default function StudentInternshipsPage() {
//   const [data, setData] = useState<SimpleInternship[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [query, setQuery] = useState<string>("");
//   const [mode, setMode] = useState<'search' | 'skills' | 'resume'>('search');
//   const [userSkills, setUserSkills] = useState<string[]>([]);
//   const [skillInput, setSkillInput] = useState("");
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
//   const [processing, setProcessing] = useState(false);
//   const [pdfLoaded, setPdfLoaded] = useState(false);

//   useEffect(() => {
//     const run = async () => {
//       try {
//         const res = await fetch("/internships.json", { cache: "no-store" });
//         if (!res.ok) throw new Error("Failed to load internships.json");
//         const json = await res.json();
//         if (!Array.isArray(json)) throw new Error("Invalid internships format");
//         setData(json);
//       } catch (e: any) {
//         setError(e?.message ?? "Unable to load internships");
//       } finally {
//         setLoading(false);
//       }
//     };
//     run();
//   }, []);

//   // Load PDF.js on client side only
//   useEffect(() => {
//     const loadPdfJs = async () => {
//       try {
//         const pdfjsLib = await import('pdfjs-dist');
//         pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
//         setPdfLoaded(true);
//       } catch (err) {
//         console.error('Failed to load PDF.js:', err);
//       }
//     };
//     loadPdfJs();
//   }, []);

//   const skillSuggestions = useMemo(() => {
//     if (!skillInput.trim()) return [];
//     const q = skillInput.toLowerCase();
//     return commonSkills.filter(
//       skill => skill.toLowerCase().includes(q) && !userSkills.includes(skill)
//     ).slice(0, 8);
//   }, [skillInput, userSkills]);

//   const addSkill = (skill: string) => {
//     if (!userSkills.includes(skill)) {
//       setUserSkills([...userSkills, skill]);
//     }
//     setSkillInput("");
//     setShowSuggestions(false);
//   };

//   const removeSkill = (skill: string) => {
//     setUserSkills(userSkills.filter(s => s !== skill));
//   };

//   // Canonicalize skill names
//   const canonicalizeSkill = (raw: string): string => {
//     const lc = raw.toLowerCase();
//     for (const [canon, aliases] of Object.entries(skillSynonyms)) {
//       if (canon.toLowerCase() === lc || aliases.some(a => a.toLowerCase() === lc)) {
//         return canon;
//       }
//     }
//     return raw;
//   };

//   // Extract text from PDF
//   const extractTextFromPDF = async (file: File): Promise<string> => {
//     const pdfjsLib = await import('pdfjs-dist');
//     const arrayBuffer = await file.arrayBuffer();
//     const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
//     let text = '';

//     for (let i = 1; i <= pdf.numPages; i++) {
//       const page = await pdf.getPage(i);
//       const content = await page.getTextContent();
//       const pageText = content.items
//         .map((item: any) => item.str)
//         .join(' ');
//       text += pageText + ' ';
//     }

//     return text;
//   };

//   // Extract skills from text
//   const extractSkillsFromText = (text: string): ExtractedSkill[] => {
//     const normalizedText = text.toLowerCase();
//     const results: ExtractedSkill[] = [];
//     const seen = new Set<string>();

//     // Check each common skill
//     commonSkills.forEach(skillName => {
//       const canon = canonicalizeSkill(skillName);
//       const phrase = canon.toLowerCase();
//       const escapedPhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

//       let occurrences = 0;

//       // Count occurrences of the skill
//       if (phrase.includes(' ')) {
//         const regex = new RegExp(`\\b${escapedPhrase}\\b`, 'gi');
//         const matches = text.match(regex);
//         occurrences = matches ? matches.length : 0;
//       } else {
//         const regex = new RegExp(`(^|[^A-Za-z0-9])${escapedPhrase}([^A-Za-z0-9]|$)`, 'gi');
//         const matches = normalizedText.match(regex);
//         occurrences = matches ? matches.length : 0;
//       }

//       // Check synonyms
//       const aliases = skillSynonyms[canon] || [];
//       aliases.forEach(alias => {
//         const aliasPhrase = alias.toLowerCase();
//         const escapedAlias = aliasPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//         if (aliasPhrase.includes(' ')) {
//           const regex = new RegExp(`\\b${escapedAlias}\\b`, 'gi');
//           const matches = text.match(regex);
//           occurrences += matches ? matches.length : 0;
//         } else {
//           const regex = new RegExp(`(^|[^A-Za-z0-9])${escapedAlias}([^A-Za-z0-9]|$)`, 'gi');
//           const matches = normalizedText.match(regex);
//           occurrences += matches ? matches.length : 0;
//         }
//       });

//       if (occurrences > 0) {
//         // Calculate confidence based on occurrences
//         let confidence = Math.min(0.95, 0.40 + 0.15 * Math.min(occurrences, 4));
        
//         // Boost for multi-word phrases
//         if (phrase.includes(' ')) {
//           confidence = Math.min(0.98, confidence + 0.10);
//         }

//         if (!seen.has(canon)) {
//           seen.add(canon);
//           results.push({ name: canon, confidence });
//         }
//       }
//     });

//     // Sort by confidence
//     return results.sort((a, b) => b.confidence - a.confidence);
//   };

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.type !== 'application/pdf') {
//       alert('Please upload a PDF file only.');
//       return;
//     }

//     if (file.size > 10 * 1024 * 1024) {
//       alert('File size must be less than 10MB');
//       return;
//     }

//     if (!pdfLoaded) {
//       alert('PDF processing is still loading. Please try again in a moment.');
//       return;
//     }

//     setProcessing(true);
//     try {
//       // Extract text from PDF
//       const text = await extractTextFromPDF(file);
      
//       // Extract skills from text
//       const skills = extractSkillsFromText(text);
      
//       setExtractedSkills(skills);
      
//       // Add high confidence skills to user skills
//       const highConfidence = skills
//         .filter(s => s.confidence >= 0.55)
//         .map(s => s.name);
      
//       setUserSkills(prev => [...new Set([...prev, ...highConfidence])]);

//       if (highConfidence.length === 0) {
//         alert('No recognizable skills found in the resume. Please try adding skills manually.');
//       }
//     } catch (err) {
//       console.error('Error processing resume:', err);
//       alert('Error processing resume. Please try again or add skills manually.');
//     } finally {
//       setProcessing(false);
//       // Reset file input
//       e.target.value = '';
//     }
//   };

//   const calculateMatch = (internship: SimpleInternship): number => {
//     if (userSkills.length === 0) return 0;
    
//     const allSkills = [
//       ...(internship.required_skills || []),
//       ...(internship.preferred_skills || [])
//     ].map(s => canonicalizeSkill(s).toLowerCase());
    
//     const userSkillsLower = userSkills.map(s => canonicalizeSkill(s).toLowerCase());
//     const matches = allSkills.filter(s => userSkillsLower.includes(s));
    
//     // Calculate match percentage with bonus for having skills
//     return Math.min(100, (matches.length / Math.max(userSkills.length, 1)) * 100 + 20);
//   };

//   const filtered = useMemo(() => {
//     let result = data;

//     // Text search
//     if (mode === 'search' && query.trim()) {
//       const q = query.trim().toLowerCase();
//       result = result.filter((item) => {
//         const title = (item.title || "").toLowerCase();
//         const company = (item.company || "").toLowerCase();
//         const location = (item.location || "").toLowerCase();
//         return title.includes(q) || company.includes(q) || location.includes(q);
//       });
//     }

//     // Skill-based matching
//     if ((mode === 'skills' || mode === 'resume') && userSkills.length > 0) {
//       result = result.map(item => {
//         const score = calculateMatch(item);
//         const allSkills = [...(item.required_skills || []), ...(item.preferred_skills || [])];
//         const matchedSkills = allSkills.filter(s => 
//           userSkills.map(us => canonicalizeSkill(us).toLowerCase()).includes(canonicalizeSkill(s).toLowerCase())
//         );
        
//         return {
//           ...item,
//           score,
//           matchedSkills
//         };
//       }).sort((a, b) => (b.score || 0) - (a.score || 0));
//     }

//     return result;
//   }, [data, query, mode, userSkills]);

//   return (
//     <section id="internship-finder" className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A] dark:bg-[#0B1E36] dark:text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
//             <Brain className="h-10 w-10 text-[#0056A3]" />
//             AI Internship Recommender
//           </h1>
//           <p className="text-sm text-[#333333] dark:text-gray-300 mt-2">
//             Find your perfect internship match with AI-powered recommendations
//           </p>
//         </div>

//         {/* Mode Toggle */}
//         <div className="flex gap-2 mb-6 bg-white dark:bg-white/10 p-1 rounded-xl border border-[#D9DEE6] dark:border-white/10">
//           <button
//             onClick={() => setMode('search')}
//             className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//               mode === 'search'
//                 ? 'bg-[#0056A3] text-white shadow-lg'
//                 : 'text-[#666666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
//             }`}
//           >
//             <Search className="h-5 w-5" />
//             Search
//           </button>
//           <button
//             onClick={() => setMode('skills')}
//             className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//               mode === 'skills'
//                 ? 'bg-[#0056A3] text-white shadow-lg'
//                 : 'text-[#666666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
//             }`}
//           >
//             <Tags className="h-5 w-5" />
//             By Skills
//           </button>
//           <button
//             onClick={() => setMode('resume')}
//             className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//               mode === 'resume'
//                 ? 'bg-[#0056A3] text-white shadow-lg'
//                 : 'text-[#666666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
//             }`}
//           >
//             <FileText className="h-5 w-5" />
//             Resume
//           </button>
//         </div>

//         {/* Search Mode */}
//         {mode === 'search' && (
//           <div className="mb-6">
//             <div className="relative max-w-2xl">
//               <span className="absolute inset-y-0 left-3 flex items-center text-[#666666] dark:text-gray-400">
//                 <Search className="h-5 w-5" />
//               </span>
//               <input
//                 type="text"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search by title, company, or location"
//                 aria-label="Search internships"
//                 className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#D9DEE6] bg-white/90 backdrop-blur-sm text-[#1A1A1A] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#0056A3] dark:bg-white/10 dark:text-white dark:border-white/10"
//               />
//             </div>
//           </div>
//         )}

//         {/* Skills Mode */}
//         {mode === 'skills' && (
//           <Card padding="sm" className="mb-6 bg-white/80 dark:bg-white/10">
//             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <Tags className="h-5 w-5" />
//               Enter Your Skills
//             </h3>
//             <div className="relative mb-4">
//               <input
//                 type="text"
//                 value={skillInput}
//                 onChange={(e) => {
//                   setSkillInput(e.target.value);
//                   setShowSuggestions(true);
//                 }}
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter' && skillInput.trim()) {
//                     addSkill(skillInput.trim());
//                   }
//                 }}
//                 onFocus={() => setShowSuggestions(true)}
//                 onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
//                 placeholder="Type a skill and press Enter (e.g., Python, React...)"
//                 className="w-full px-4 py-3 rounded-xl border border-[#D9DEE6] bg-white dark:bg-white/5 text-[#1A1A1A] dark:text-white placeholder-[#666666] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0056A3]"
//               />
//               {showSuggestions && skillSuggestions.length > 0 && (
//                 <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#161b22] border border-[#D9DEE6] dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
//                   {skillSuggestions.map((skill) => (
//                     <div
//                       key={skill}
//                       onClick={() => addSkill(skill)}
//                       className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer border-b border-[#D9DEE6] dark:border-white/10 last:border-b-0"
//                     >
//                       {skill}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {userSkills.map((skill) => (
//                 <span
//                   key={skill}
//                   className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0056A3] text-white text-sm font-medium"
//                 >
//                   {skill}
//                   <button
//                     onClick={() => removeSkill(skill)}
//                     className="hover:bg-white/20 rounded-full p-0.5"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 </span>
//               ))}
//             </div>
//           </Card>
//         )}

//         {/* Resume Mode */}
//         {mode === 'resume' && (
//           <Card padding="sm" className="mb-6 bg-white/80 dark:bg-white/10">
//             <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
//               <Upload className="h-5 w-5" />
//               Upload Your Resume
//             </h3>
//             <label className="block border-2 border-dashed border-[#D9DEE6] dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#0056A3] hover:bg-[#0056A3]/5 transition-all">
//               <Upload className="h-12 w-12 mx-auto mb-3 text-[#666666] dark:text-gray-400" />
//               <p className="text-[#1A1A1A] dark:text-white font-medium mb-1">
//                 Drag & Drop your resume here
//               </p>
//               <p className="text-sm text-[#666666] dark:text-gray-400">
//                 or click to browse (PDF only, max 10MB)
//               </p>
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileUpload}
//                 className="hidden"
//               />
//             </label>

//             {extractedSkills.length > 0 && (
//               <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
//                 <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
//                   <TrendingUp className="h-5 w-5" />
//                   Extracted Skills from Resume:
//                 </h4>
//                 <div className="flex flex-wrap gap-2">
//                   {extractedSkills.map((skill) => (
//                     <span
//                       key={skill.name}
//                       className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm border border-green-200 dark:border-green-800"
//                     >
//                       {skill.name} ({Math.round(skill.confidence * 100)}%)
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </Card>
//         )}

//         {/* Status */}
//         {loading && (
//           <div className="flex items-center gap-2 text-[#333333] dark:text-gray-300">
//             <span className="inline-block h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
//             <span>Loading internships…</span>
//           </div>
//         )}

//         {processing && (
//           <div className="flex items-center gap-2 text-[#333333] dark:text-gray-300 mb-6">
//             <span className="inline-block h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
//             <span>AI is analyzing your profile…</span>
//           </div>
//         )}

//         {error && (
//           <Card padding="sm" className="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
//             <div className="text-sm">{error}</div>
//           </Card>
//         )}

//         {/* Results Count */}
//         {!loading && !error && ((mode === 'skills' || mode === 'resume') && userSkills.length > 0) && (
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-2xl font-bold flex items-center gap-2">
//               <Trophy className="h-6 w-6 text-[#0056A3]" />
//               Recommended Internships
//             </h2>
//             <span className="text-[#666666] dark:text-gray-400">
//               {filtered.length} match{filtered.length !== 1 ? 'es' : ''} found
//             </span>
//           </div>
//         )}

//         {/* Grid */}
//         {!loading && !error && (
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filtered.length === 0 && (mode === 'search' ? query : userSkills.length > 0) && (
//               <Card padding="sm" className="bg-white/80 dark:bg-white/10 col-span-full text-center py-12">
//                 <Search className="h-16 w-16 mx-auto mb-4 text-[#666666] dark:text-gray-400 opacity-50" />
//                 <h3 className="text-lg font-semibold mb-2">No internships found</h3>
//                 <p className="text-sm text-[#333333] dark:text-gray-300">
//                   {mode === 'search' 
//                     ? `No internships match "${query}". Try a different search.`
//                     : 'Try adjusting your skills for better matches.'}
//                 </p>
//               </Card>
//             )}
//             {filtered.map((item, idx) => {
//               const matchPercentage = item.score ? Math.round(item.score) : 0;
//               const showMatch = (mode === 'skills' || mode === 'resume') && userSkills.length > 0;
              
//               return (
//                 <Card
//                   key={`${item.title}-${idx}`}
//                   padding="sm"
//                   hover
//                   className={`opacity-0 translate-y-2 transition-all duration-500 backdrop-blur-md bg-white/70 dark:bg-white/10 border ${
//                     showMatch && matchPercentage >= 70 
//                       ? 'border-[#0056A3] shadow-xl shadow-[#0056A3]/20' 
//                       : 'border-white/40 dark:border-white/10'
//                   } rounded-2xl shadow-xl`}
//                   style={{ transitionDelay: `${Math.min(idx, 6) * 90}ms` }}
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex-1">
//                       <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">
//                         {item.title || "Untitled Position"}
//                       </h3>
//                       <p className="text-sm text-[#666666] dark:text-gray-300 flex items-center gap-1 mt-1">
//                         <Building2 className="h-4 w-4" />
//                         {item.company || "Company"}
//                       </p>
//                     </div>
//                     {showMatch && (
//                       <div className="flex flex-col items-center ml-2">
//                         <div 
//                           className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm relative"
//                           style={{
//                             background: `conic-gradient(#0056A3 ${matchPercentage * 3.6}deg, #D9DEE6 ${matchPercentage * 3.6}deg)`
//                           }}
//                         >
//                           <div className="absolute inset-1 bg-white dark:bg-[#0B1E36] rounded-full flex items-center justify-center">
//                             <span className="text-[#0056A3]">{matchPercentage}%</span>
//                           </div>
//                         </div>
//                         <span className="text-xs text-[#666666] dark:text-gray-400 mt-1">Match</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="space-y-2 mb-3">
//                     <div className="text-sm text-[#333333] dark:text-gray-300 flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       {item.location || "—"}
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="text-[#333333] dark:text-gray-300 flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         <span className="font-medium text-[#1A1A1A] dark:text-white">Duration:</span> {item.duration || "—"}
//                       </div>
//                       <div className="text-[#333333] dark:text-gray-300 flex items-center gap-1">
//                         <DollarSign className="h-4 w-4" />
//                         <span className="font-medium text-[#1A1A1A] dark:text-white">Stipend:</span> {item.stipend || "—"}
//                       </div>
//                     </div>
//                   </div>

//                   {item.description && (
//                     <p className="text-sm text-[#333333] dark:text-gray-300 mb-3 line-clamp-2">
//                       {item.description}
//                     </p>
//                   )}

//                   {showMatch && item.required_skills && item.required_skills.length > 0 && (
//                     <div className="mb-3">
//                       <div className="text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2">Required Skills:</div>
//                       <div className="flex flex-wrap gap-1">
//                         {item.required_skills.slice(0, 4).map((skill) => {
//                           const isMatched = item.matchedSkills?.map(s => s.toLowerCase()).includes(skill.toLowerCase());
//                           return (
//                             <span
//                               key={skill}
//                               className={`px-2 py-1 rounded-lg text-xs font-medium ${
//                                 isMatched
//                                   ? 'bg-[#0056A3] text-white'
//                                   : 'bg-gray-100 dark:bg-white/5 text-[#666666] dark:text-gray-400'
//                               }`}
//                             >
//                               {skill}
//                             </span>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   <div className="mt-4 flex gap-3">
//                     {item.link && (
//                       <Link href={(item.link || '').replace(/`/g, '').trim()} target="_blank" rel="noopener noreferrer" className="flex-1">
//                         <Button size="sm" className="w-full bg-[#0056A3] text-white hover:bg-[#003D73]">
//                           View Details
//                         </Button>
//                       </Link>
//                     )}
//                   </div>
//                 </Card>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Search, Upload, X, Tags, FileText, Brain, Trophy, Building2, MapPin, Clock, DollarSign, TrendingUp } from "lucide-react";

type SimpleInternship = {
  title: string;
  company: string;
  location: string;
  duration: string;
  stipend?: string;
  description?: string;
  link?: string;
  required_skills?: string[];
  preferred_skills?: string[];
  score?: number;
  matchedSkills?: string[];
};

type ExtractedSkill = {
  name: string;
  confidence: number;
};

// Common skills for suggestions
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

export default function StudentInternshipsPage() {
  const [data, setData] = useState<SimpleInternship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [mode, setMode] = useState<'search' | 'skills' | 'resume'>('search');
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/internships.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load internships.json");
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error("Invalid internships format");
        setData(json);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Unable to load internships";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Load PDF.js on client side only with robust worker setup
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist');
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

  const skillSuggestions = useMemo(() => {
    if (!skillInput.trim()) return [];
    const q = skillInput.toLowerCase();
    return commonSkills.filter(
      skill => skill.toLowerCase().includes(q) && !userSkills.includes(skill)
    ).slice(0, 8);
  }, [skillInput, userSkills]);

  const addSkill = (skill: string) => {
    const canonical = canonicalizeSkill(skill);
    if (!userSkills.some(s => canonicalizeSkill(s).toLowerCase() === canonical.toLowerCase())) {
      setUserSkills([...userSkills, canonical]);
    }
    setSkillInput("");
    setShowSuggestions(false);
  };

  const removeSkill = (skill: string) => {
    setUserSkills(userSkills.filter(s => canonicalizeSkill(s).toLowerCase() !== canonicalizeSkill(skill).toLowerCase()));
  };

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

  // Extract text from PDF with improved robustness
  const textItemToString = (item: unknown): string => {
    if (item && typeof item === 'object' && 'str' in item) {
      const s = (item as { str?: unknown }).str;
      if (typeof s === 'string') return s;
    }
    return '';
  };

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

  // Extract skills from text
  const extractSkillsFromText = (text: string): ExtractedSkill[] => {
    const normalizedText = text.toLowerCase();
    const results: ExtractedSkill[] = [];
    const seen = new Set<string>();

    // Check each common skill
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const isText = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isText && !isPdf) {
      alert('Please upload a PDF or TXT file only.');
      return;
    }

    if (isPdf && file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    if (isPdf && !pdfLoaded) {
      alert('PDF processing is still loading. Please try again in a moment.');
      return;
    }

    setProcessing(true);
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
      
      setExtractedSkills(skills);
      
      // Add high confidence skills to user skills
      const highConfidence = skills
        .filter(s => s.confidence >= 0.55)
        .map(s => s.name);
      
      setUserSkills(prev => [...new Set([...prev, ...highConfidence])]);

      if (highConfidence.length === 0) {
        alert('No recognizable skills found in the resume. Please try adding skills manually.');
      }
    } catch (err) {
      console.error('Error processing resume:', err);
      alert('Error processing resume. Please try again or add skills manually.');
    } finally {
      setProcessing(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const calculateMatch = (internship: SimpleInternship): number => {
    if (userSkills.length === 0) return 0;
    
    const allSkills = [
      ...(internship.required_skills || []),
      ...(internship.preferred_skills || [])
    ].map(s => canonicalizeSkill(s).toLowerCase());
    
    const userSkillsLower = userSkills.map(s => canonicalizeSkill(s).toLowerCase());
    const matches = allSkills.filter(s => userSkillsLower.includes(s));
    
    // Calculate match percentage with bonus for having skills
    return Math.min(100, (matches.length / Math.max(userSkills.length, 1)) * 100 + 20);
  };

  const filtered = useMemo(() => {
    let result = data;

    // Text search
    if (mode === 'search' && query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter((item) => {
        const title = (item.title || "").toLowerCase();
        const company = (item.company || "").toLowerCase();
        const location = (item.location || "").toLowerCase();
        return title.includes(q) || company.includes(q) || location.includes(q);
      });
    }

    // Skill-based matching
    if ((mode === 'skills' || mode === 'resume') && userSkills.length > 0) {
      result = result.map(item => {
        const score = calculateMatch(item);
        const allSkills = [...(item.required_skills || []), ...(item.preferred_skills || [])];
        const matchedSkills = allSkills.filter(s => 
          userSkills.map(us => canonicalizeSkill(us).toLowerCase()).includes(canonicalizeSkill(s).toLowerCase())
        );
        
        return {
          ...item,
          score,
          matchedSkills
        };
      }).sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    return result;
  }, [data, query, mode, userSkills]);

  return (
    <section id="internship-finder" className="min-h-screen bg-[#F0F4FA] text-[#1A1A1A] dark:bg-[#0B1E36] dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Brain className="h-10 w-10 text-[#0056A3]" />
            AI Internship Recommender
          </h1>
          <p className="text-sm text-[#333333] dark:text-gray-300 mt-2">
            Find your perfect internship match with AI-powered recommendations
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6 bg-white dark:bg-white/10 p-1 rounded-xl border border-[#D9DEE6] dark:border-white/10">
          <button
            onClick={() => setMode('search')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'search'
                ? 'bg-[#0056A3] text-white shadow-lg'
                : 'text-[#666666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <Search className="h-5 w-5" />
            Search
          </button>
          <button
            onClick={() => setMode('skills')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'skills'
                ? 'bg-[#0056A3] text-white shadow-lg'
                : 'text-[#666666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <Tags className="h-5 w-5" />
            By Skills
          </button>
          <button
            onClick={() => setMode('resume')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              mode === 'resume'
                ? 'bg-[#0056A3] text-white shadow-lg'
                : 'text-[#666666] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
            }`}
          >
            <FileText className="h-5 w-5" />
            Resume
          </button>
        </div>

        {/* Search Mode */}
        {mode === 'search' && (
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <span className="absolute inset-y-0 left-3 flex items-center text-[#666666] dark:text-gray-400">
                <Search className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, company, or location"
                aria-label="Search internships"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-[#D9DEE6] bg-white/90 backdrop-blur-sm text-[#1A1A1A] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#0056A3] dark:bg-white/10 dark:text-white dark:border-white/10"
              />
            </div>
          </div>
        )}

        {/* Skills Mode */}
        {mode === 'skills' && (
          <Card padding="sm" className="mb-6 bg-white/80 dark:bg-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Enter Your Skills
            </h3>
            <div className="relative mb-4">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && skillInput.trim()) {
                    addSkill(skillInput.trim());
                  }
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Type a skill and press Enter (e.g., Python, React...)"
                className="w-full px-4 py-3 rounded-xl border border-[#D9DEE6] bg-white dark:bg-white/5 text-[#1A1A1A] dark:text-white placeholder-[#666666] dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0056A3]"
              />
              {showSuggestions && skillSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#161b22] border border-[#D9DEE6] dark:border-white/10 rounded-xl shadow-xl max-h-60 overflow-y-auto z-50">
                  {skillSuggestions.map((skill) => (
                    <div
                      key={skill}
                      onClick={() => addSkill(skill)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer border-b border-[#D9DEE6] dark:border-white/10 last:border-b-0"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {userSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0056A3] text-white text-sm font-medium"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Resume Mode */}
        {mode === 'resume' && (
          <Card padding="sm" className="mb-6 bg-white/80 dark:bg-white/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your Resume
            </h3>
            <label className="block border-2 border-dashed border-[#D9DEE6] dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#0056A3] hover:bg-[#0056A3]/5 transition-all">
              <Upload className="h-12 w-12 mx-auto mb-3 text-[#666666] dark:text-gray-400" />
              <p className="text-[#1A1A1A] dark:text-white font-medium mb-1">
                Drag & Drop your resume here
              </p>
              <p className="text-sm text-[#666666] dark:text-gray-400">
                or click to browse (PDF or TXT, max 10MB)
              </p>
              <input
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {processing && (
              <div className="mt-4 flex items-center gap-2 text-[#0056A3]">
                <div className="h-4 w-4 rounded-full border-2 border-[#0056A3] border-t-transparent animate-spin" />
                <span>AI is analyzing your resume...</span>
              </div>
            )}

            {extractedSkills.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Extracted {extractedSkills.length} Skills from Resume:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map((skill) => (
                    <span
                      key={skill.name}
                      className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm border border-green-200 dark:border-green-800"
                    >
                      {skill.name} ({Math.round(skill.confidence * 100)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Status */}
        {loading && (
          <div className="flex items-center gap-2 text-[#333333] dark:text-gray-300">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span>Loading internships…</span>
          </div>
        )}

        {processing && (
          <div className="flex items-center gap-2 text-[#333333] dark:text-gray-300 mb-6">
            <span className="inline-block h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <span>AI is analyzing your profile…</span>
          </div>
        )}

        {error && (
          <Card padding="sm" className="bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
            <div className="text-sm">{error}</div>
          </Card>
        )}

        {/* Results Count */}
        {!loading && !error && ((mode === 'skills' || mode === 'resume') && userSkills.length > 0) && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="h-6 w-6 text-[#0056A3]" />
              Recommended Internships
            </h2>
            <span className="text-[#666666] dark:text-gray-400">
              {filtered.length} match{filtered.length !== 1 ? 'es' : ''} found
            </span>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length === 0 && (mode === 'search' ? query : userSkills.length > 0) && (
              <Card padding="sm" className="bg-white/80 dark:bg-white/10 col-span-full text-center py-12">
                <Search className="h-16 w-16 mx-auto mb-4 text-[#666666] dark:text-gray-400 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No internships found</h3>
                <p className="text-sm text-[#333333] dark:text-gray-300">
                  {mode === 'search' 
                    ? `No internships match "${query}". Try a different search.`
                    : 'Try adjusting your skills for better matches.'}
                </p>
              </Card>
            )}
            {filtered.map((item, idx) => {
              const matchPercentage = item.score ? Math.round(item.score) : 0;
              const showMatch = (mode === 'skills' || mode === 'resume') && userSkills.length > 0;
              
              return (
                <Card
                  key={`${item.title}-${idx}`}
                  padding="sm"
                  hover
                  className={`opacity-0 translate-y-2 transition-all duration-500 backdrop-blur-md bg-white/70 dark:bg-white/10 border ${
                    showMatch && matchPercentage >= 70 
                      ? 'border-[#0056A3] shadow-xl shadow-[#0056A3]/20' 
                      : 'border-white/40 dark:border-white/10'
                  } rounded-2xl shadow-xl`}
                  style={{ transitionDelay: `${Math.min(idx, 6) * 90}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">
                        {item.title || "Untitled Position"}
                      </h3>
                      <p className="text-sm text-[#666666] dark:text-gray-300 flex items-center gap-1 mt-1">
                        <Building2 className="h-4 w-4" />
                        {item.company || "Company"}
                      </p>
                    </div>
                    {showMatch && (
                      <div className="flex flex-col items-center ml-2">
                        <div 
                          className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm relative"
                          style={{
                            background: `conic-gradient(#0056A3 ${matchPercentage * 3.6}deg, #D9DEE6 ${matchPercentage * 3.6}deg)`
                          }}
                        >
                          <div className="absolute inset-1 bg-white dark:bg-[#0B1E36] rounded-full flex items-center justify-center">
                            <span className="text-[#0056A3]">{matchPercentage}%</span>
                          </div>
                        </div>
                        <span className="text-xs text-[#666666] dark:text-gray-400 mt-1">Match</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="text-sm text-[#333333] dark:text-gray-300 flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {item.location || "—"}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-[#333333] dark:text-gray-300 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium text-[#1A1A1A] dark:text-white">Duration:</span> {item.duration || "—"}
                      </div>
                      <div className="text-[#333333] dark:text-gray-300 flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium text-[#1A1A1A] dark:text-white">Stipend:</span> {item.stipend || "—"}
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-sm text-[#333333] dark:text-gray-300 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {showMatch && item.required_skills && item.required_skills.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2">Required Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {item.required_skills.slice(0, 4).map((skill) => {
                          const isMatched = item.matchedSkills?.map(s => s.toLowerCase()).includes(skill.toLowerCase());
                          return (
                            <span
                              key={skill}
                              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                                isMatched
                                  ? 'bg-[#0056A3] text-white'
                                  : 'bg-gray-100 dark:bg-white/5 text-[#666666] dark:text-gray-400'
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3">
                    {item.link && (
                      <Link href={(item.link || '').replace(/`/g, '').trim()} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button size="sm" className="w-full bg-[#0056A3] text-white hover:bg-[#003D73]">
                          View Details
                        </Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
//