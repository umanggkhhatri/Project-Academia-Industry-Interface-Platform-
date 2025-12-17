import { UserPlus, Search, FileText, Award, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from '@/components/ui/Card';

const HowItWorksSection = () => {
  const steps = [
    {
      id: 1,
      icon: UserPlus,
      title: 'Register & Profile Setup',
      description: 'Students, faculty, and industry partners create profiles with their specific requirements and capabilities.',
      color: 'bg-blue-500',
    },
    {
      id: 2,
      icon: Search,
      title: 'Browse & Match',
      description: 'Smart matching system connects students with relevant internship opportunities based on skills and interests.',
      color: 'bg-green-500',
    },
    {
      id: 3,
      icon: FileText,
      title: 'Apply & Track',
      description: 'Students apply for internships and track their application status through the transparent system.',
      color: 'bg-purple-500',
    },
    {
      id: 4,
      icon: Award,
      title: 'Complete & Log',
      description: 'During internships, students maintain digital logbooks with faculty supervision and industry feedback.',
      // Use explicit hex to ensure visible colored circle
      color: 'bg-[#FF9933]',
    },
    {
      id: 5,
      icon: CheckCircle,
      title: 'Earn Credits',
      description: 'Successful completion results in verified academic credits as per NEP 2020 guidelines.',
      // Use explicit hex to ensure visible colored circle
      color: 'bg-[#4c51f7]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#F0F4FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-[#333333] max-w-3xl mx-auto">
            Our streamlined process ensures seamless collaboration between academia and industry, 
            making internships more accessible and valuable for all stakeholders.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  <Card className="text-center h-full hover-lift animate-slide-up card-readable bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.08)] border-0" hover>
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-sm font-bold text-[#333333]">{step.id}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#333333] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </Card>
                  
                  {/* Arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="h-6 w-6 text-primary-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                <Card className="flex items-start space-x-4 hover-lift animate-slide-up card-readable bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.08)] border-0" hover>
                  <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#333333]">{step.id}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-[#1A1A1A]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#333333] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Card>
                
                {/* Vertical line for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-0.5 h-6 bg-primary-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg p-8 shadow-[0_2px_6px_rgba(0,0,0,0.08)] border-0 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-[#333333] mb-6">
              Join thousands of students, faculty, and industry partners who are already 
              benefiting from our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register/student" className="px-6 py-3 bg-[#0056A3] text-white rounded-lg hover:bg-[#003D73] transition-colors font-medium">
                Register as Student
              </Link>
              <Link href="/register/industry" className="px-6 py-3 bg-[#0056A3] text-white rounded-lg hover:bg-[#003D73] transition-colors font-medium">
                Partner with Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;