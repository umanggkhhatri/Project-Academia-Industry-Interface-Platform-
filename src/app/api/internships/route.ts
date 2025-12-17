import { NextResponse } from 'next/server';

export type Internship = {
  id: string;
  title: string;
  company: string;
  industry: string; // e.g., IT, Finance, Healthcare
  skillsRequired: string[];
  mode: 'remote' | 'on-site' | 'hybrid';
  durationWeeks: number;
  location: string;
  stipend?: string;
  verified: boolean;
};

const internships: Internship[] = [
  {
    id: 'int-001',
    title: 'Frontend Intern',
    company: 'TechNova',
    industry: 'IT',
    skillsRequired: ['React', 'TypeScript', 'CSS'],
    mode: 'remote',
    durationWeeks: 12,
    location: 'Remote',
    stipend: '₹15,000/mo',
    verified: true,
  },
  {
    id: 'int-002',
    title: 'Data Analyst Intern',
    company: 'DataWorks',
    industry: 'Analytics',
    skillsRequired: ['Python', 'SQL', 'Tableau'],
    mode: 'on-site',
    durationWeeks: 8,
    location: 'Pune, MH',
    stipend: '₹12,000/mo',
    verified: true,
  },
  {
    id: 'int-003',
    title: 'Cloud Ops Intern',
    company: 'SkyNet',
    industry: 'Cloud',
    skillsRequired: ['AWS', 'Docker', 'CI/CD'],
    mode: 'hybrid',
    durationWeeks: 10,
    location: 'Bengaluru, KA',
    stipend: '₹18,000/mo',
    verified: true,
  },
  {
    id: 'int-004',
    title: 'UX Design Intern',
    company: 'Designly',
    industry: 'Design',
    skillsRequired: ['Figma', 'UI/UX', 'Prototyping'],
    mode: 'remote',
    durationWeeks: 6,
    location: 'Remote',
    stipend: '₹10,000/mo',
    verified: true,
  },
  {
    id: 'int-005',
    title: 'Marketing Intern',
    company: 'GrowHub',
    industry: 'Marketing',
    skillsRequired: ['SEO', 'Content', 'Excel'],
    mode: 'on-site',
    durationWeeks: 12,
    location: 'Delhi, DL',
    stipend: '₹8,000/mo',
    verified: false, // will be filtered out by client by default
  },
];

export async function GET() {
  return NextResponse.json({ internships });
}