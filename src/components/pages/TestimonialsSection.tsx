'use client';

import { Star, Quote, ThumbsUp, Award, Users } from 'lucide-react';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Dr. Sunita Verma',
      role: 'Director, Academic Affairs',
      institution: 'IIT Delhi',
      image: '👩‍🏫',
      rating: 5,
      quote: 'Prashiskshan has transformed how we manage internships. The NEP 2020 compliance features and automated credit system have made our processes 80% more efficient.',
      category: 'faculty',
      verified: true
    },
    {
      id: 2,
      name: 'Rahul Gupta',
      role: 'Final Year Student',
      institution: 'NIT Trichy',
      image: '👨‍🎓',
      rating: 5,
      quote: 'Found my dream internship in just 2 weeks! The skill matching was spot-on, and the digital logbook made tracking my progress so easy. Earned 8 credits seamlessly.',
      category: 'student',
      verified: true
    },
    {
      id: 3,
      name: 'Priya Krishnan',
      role: 'Talent Acquisition Head',
      institution: 'Infosys Limited',
      image: '👩‍💼',
      rating: 5,
      quote: 'The quality of candidates we get through Prashiskshan is exceptional. The structured feedback system helps us contribute meaningfully to their academic journey.',
      category: 'industry',
      verified: true
    },
    {
      id: 4,
      name: 'Prof. Amit Sharma',
      role: 'HOD Computer Science',
      institution: 'Jadavpur University',
      image: '👨‍🏫',
      rating: 5,
      quote: 'The analytics dashboard provides incredible insights into student performance. We can now identify skill gaps early and adjust our curriculum accordingly.',
      category: 'faculty',
      verified: true
    },
    {
      id: 5,
      name: 'Sneha Patel',
      role: 'Engineering Student',
      institution: 'BITS Pilani',
      image: '👩‍💻',
      rating: 5,
      quote: 'Being from a rural background, I thought good internships were out of reach. Prashiskshan proved me wrong! Got a remote internship with a top tech company.',
      category: 'student',
      verified: true
    },
    {
      id: 6,
      name: 'Vikash Singh',
      role: 'CTO',
      institution: 'StartupTech Solutions',
      image: '👨‍💼',
      rating: 5,
      quote: 'As a startup, finding quality interns was challenging. Prashiskshan connected us with motivated students who brought fresh perspectives to our projects.',
      category: 'industry',
      verified: true
    }
  ];

  const stats = [
    {
      icon: ThumbsUp,
      value: '4.9/5',
      label: 'Average Rating',
      color: 'text-green-600'
    },
    {
      icon: Users,
      value: '50,000+',
      label: 'Active Users',
      color: 'text-blue-600'
    },
    {
      icon: Award,
      value: '98%',
      label: 'Success Rate',
      color: 'text-saffron-600'
    },
    {
      icon: Star,
      value: '25,000+',
      label: 'Reviews',
      color: 'text-yellow-600'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'student': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'faculty': return 'bg-green-50 text-green-700 border-green-200';
      case 'industry': return 'bg-saffron-50 text-saffron-700 border-saffron-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-900 mb-4">
            What Our Community Says
          </h2>
          <p className="text-xl text-black max-w-3xl mx-auto mb-8">
            Trusted by students, faculty, and industry partners across India. 
            Here&apos;s what they have to say about their experience.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <div className="text-sm text-black">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="relative" hover>
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-primary-200" />
              
              {/* Content */}
              <div className="relative">
                {/* Profile */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-3xl">{testimonial.image}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-primary-900">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-black">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.institution}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-black ml-2">({testimonial.rating}/5)</span>
                </div>

                {/* Quote */}
                <p className="text-black leading-relaxed mb-4 italic">
                  &quot;{testimonial.quote}&quot;
                </p>

                {/* Category Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(testimonial.category)}`}>
                  <span className="capitalize">{testimonial.category}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 rounded-2xl p-8 md:p-12 text-center text-black">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Join Thousands of Satisfied Users
          </h3>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Experience the future of internship management. Start your journey with 
            Prashiskshan today and be part of India&apos;s largest academia-industry network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register/student" className="bg-saffron-500 hover:bg-saffron-600 text-black px-8 py-3 rounded-lg font-semibold transition-colors">
              Get Started Today
            </Link>
            <Link href="/features" className="border border-white text-black hover:bg-white hover:text-primary-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Watch Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-primary-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-primary-200 text-sm">500+</div>
                <div className="text-primary-200 text-sm">Partner Institutions</div>
              </div>
              <div>
                <div className="text-primary-200 text-sm">1000+</div>
                <div className="text-primary-200 text-sm">Industry Partners</div>
              </div>
              <div>
                <div className="text-primary-200 text-sm">50,000+</div>
                <div className="text-primary-200 text-sm">Successful Internships</div>
              </div>
            </div>
          </div>
        </div>

        {/* Review Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-50 text-green-800 px-6 py-3 rounded-full">
            <Star className="h-5 w-5 text-green-600 fill-current" />
            <span className="font-semibold">Rated 4.9/5</span>
            <span className="text-green-600">•</span>
            <span>Based on 25,000+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;