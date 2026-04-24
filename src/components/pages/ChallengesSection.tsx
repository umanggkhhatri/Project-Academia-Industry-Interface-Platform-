import { AlertTriangle, Users, MapPin, FileX, Clock, TrendingDown } from 'lucide-react';
import Card from '@/components/ui/Card';

const ChallengesSection = () => {
  const challenges = [
    {
      icon: Users,
      title: 'Skills Gap',
      description: 'Mismatch between academic curriculum and industry requirements leads to unemployable graduates.',
      impact: '60% of graduates lack industry-ready skills',
    },
    {
      icon: MapPin,
      title: 'Limited Rural Access',
      description: 'Students in rural areas have minimal exposure to quality internship opportunities.',
      impact: '70% of rural students miss internship opportunities',
    },
    {
      icon: FileX,
      title: 'Lack of Transparency',
      description: 'No standardized system for tracking internship progress and credit allocation.',
      impact: '40% of internships go unrecognized academically',
    },
    {
      icon: Clock,
      title: 'Time-Consuming Processes',
      description: 'Manual paperwork and approval processes delay internship placements and credit allocation.',
      impact: 'Average 3-month delay in credit processing',
    },
    {
      icon: TrendingDown,
      title: 'Low Industry Participation',
      description: 'Industries hesitate to participate due to complex coordination with educational institutions.',
      impact: 'Only 25% of companies actively offer internships',
    },
    {
      icon: AlertTriangle,
      title: 'Non-Compliance with NEP 2020',
      description: 'Existing systems fail to align with National Education Policy 2020 credit framework.',
      impact: 'Most institutions struggle with NEP implementation',
    },
  ];

  return (
    <section id="challenges" className="py-20 bg-[#F0F4FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Challenges We Address
          </h2>
          <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
            The current academia–industry interface faces challenges that hinder skill development and career preparation.
            Our platform addresses these critical issues with transparency and efficiency.
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {challenges.map((challenge, index) => (
            <Card
              key={index}
              className="h-full relative overflow-hidden group rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-transparent bg-gradient-to-br from-[#f9fafb] to-[#fefefe] transition-transform duration-200 hover:scale-[1.03] hover:shadow-[0_8px_22px_rgba(0,0,0,0.12)]"
              hover
            >
              {/* Subtle corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-50 to-transparent rounded-full translate-x-8 -translate-y-8 opacity-70 group-hover:opacity-90 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary-900 flex items-center justify-center mb-3">
                  <challenge.icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-primary-900 mb-2">
                  {challenge.title}
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Impact Badge */}
                <div className="mt-auto">
                  <div className="rounded-lg border border-gray-200 bg-white/70 px-3 py-2">
                    <div className="inline-flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-[#0F3D67]" />
                      <span className="text-sm font-medium text-[#0F3D67]">{challenge.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Solution Preview */}
        
      </div>
    </section>
  );
};

export default ChallengesSection;