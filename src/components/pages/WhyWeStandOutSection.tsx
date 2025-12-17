import { Shield, Eye, MapPin, Award, Users, Zap } from 'lucide-react';
import Card from '@/components/ui/Card';

const WhyWeStandOutSection = () => {
  const features = [
    {
      icon: Award,
      title: 'NEP 2020 Compliance',
      description: 'Fully aligned with National Education Policy 2020 guidelines for credit-based internship programs.',
      highlights: [
        'Credit transfer mechanism',
        'Skill-based assessment',
        'Industry-academia integration',
        'Flexible learning pathways'
      ],
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'Blockchain-powered transparent system ensuring accountability at every step of the internship journey.',
      highlights: [
        'Real-time progress tracking',
        'Immutable record keeping',
        'Open feedback system',
        'Transparent credit allocation'
      ],
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: MapPin,
      title: 'Rural Reach Initiative',
      description: 'Dedicated programs to ensure students from rural areas have equal access to quality internship opportunities.',
      highlights: [
        'Remote internship options',
        'Local language support',
        'Offline capability',
        'Rural industry partnerships'
      ],
      // Use standard Tailwind colors to ensure visibility
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ];

  const stats = [
    { number: '500+', label: 'Partner Institutions', icon: Users },
    { number: '1000+', label: 'Industry Partners', icon: Shield },
    { number: '50,000+', label: 'Students Benefited', icon: Award },
    { number: '99.9%', label: 'Platform Uptime', icon: Zap },
  ];

  return (
    <section id="why-we-stand-out" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            Why We Stand Out
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is built on the pillars of compliance, transparency, and inclusivity, 
            making us the preferred choice for educational institutions and industry partners.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className={`${feature.bgColor} border-2 border-transparent relative overflow-hidden group`} hover>
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <feature.icon className="w-full h-full text-gray-400" />
              </div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-primary-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${feature.color} rounded-full`}></div>
                      <span className="text-sm text-gray-700 font-medium">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">
              Trusted by Thousands
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform has earned the trust of educational institutions, industry partners, 
              and students across the country through consistent delivery and innovation.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-primary-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default WhyWeStandOutSection;