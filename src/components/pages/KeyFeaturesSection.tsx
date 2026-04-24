import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { GraduationCap, BarChart3, Building2 } from 'lucide-react';

const KeyFeaturesSection = () => {
  const highlights = [
    {
      icon: GraduationCap,
      role: 'student',
      title: 'For Students',
      points: [
        'Active internships, live progress, and AI-powered matching.',
        'Study resources and instant chat support.',
      ],
      tint: 'bg-gradient-to-br from-blue-50 to-blue-100',
      border: 'border-blue-100',
      accentBg: 'bg-blue-600',
    },
    {
      icon: BarChart3,
      role: 'faculty',
      title: 'For Faculty',
      points: [
        'Student overview, analytics dashboard, and report generation.',
        'Logbook review and performance tracking.',
      ],
      tint: 'bg-gradient-to-br from-green-50 to-green-100',
      border: 'border-green-100',
      accentBg: 'bg-green-600',
    },
    {
      icon: Building2,
      role: 'industry',
      title: 'For Industry',
      points: [
        'Internship listings, communication hub, and application management.',
        'Analytics tools to assess engagement and performance.',
      ],
      tint: 'bg-gradient-to-br from-stone-50 to-stone-100',
      border: 'border-stone-200',
      accentBg: 'bg-stone-600',
    },
  ];

  return (
    <section id="key-features" className="relative py-20 bg-[#F0F4FA]">
      {/* Optional faint radial background */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_rgba(0,86,163,0.06)_0%,_transparent_60%)]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900">Key Features</h2>
          <p className="text-gray-700 mt-3">Empowering Collaboration Across Academia and Industry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {highlights.map((h, idx) => (
            <Card key={idx} className={`h-full ${h.tint} rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-transparent transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)]`}>
              <div className="p-6 flex flex-col h-full">
                <div className={`w-10 h-10 ${h.accentBg} rounded-lg flex items-center justify-center mb-3`}>
                  <h.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary-900 mb-2">{h.title}</h3>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-gray-700">
                  {h.points.map((p) => (
                    <li key={p} className="leading-relaxed">{p}</li>
                  ))}
                </ul>
                <div className="mt-auto" />
                <div className="mt-4 flex items-center gap-2">
                  <Link href={`/login/${h.role}`} aria-label={`Login to ${h.title} portal`} className="flex-1">
                    <Button size="sm" variant="primary" fullWidth className="bg-[#0056A3] hover:bg-[#003D73] text-white">
                      Login
                    </Button>
                  </Link>
                  <Link href={`/register/${h.role}`} aria-label={`Sign up for ${h.title} portal`} className="flex-1">
                    <Button size="sm" variant="outline" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;