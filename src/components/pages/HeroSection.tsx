"use client";

import Link from 'next/link';
// using plain img for robust fallback between svg and png
import { ArrowRight, GraduationCap, Users, Building2 } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import Button from '@/components/ui/Button';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, when: 'beforeChildren' } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const HeroSection = () => {
  return (
    <section id="home" className="relative overflow-hidden py-20">
      {/* Full-bleed hero background image with fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-section.png"
        alt="Student giving thumbs up"
        className="absolute inset-0 w-full h-full object-cover object-right z-0"
        onError={(e) => {
          const t = e.currentTarget as HTMLImageElement;
          t.src = '/window.svg';
        }}
      />
      {/* Readability overlay on the left side (half width) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/85 to-transparent dark:from-[#0B1E36]/85 dark:to-transparent z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-[#0F3D67] to-[#0056A3] dark:from-[#0B2F50] dark:to-[#003D73] bg-clip-text text-transparent animate-fade-in">
                Prashikshan
                <br />
                Academia–Industry Interface
              </h1>
              <p className="italic text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-slide-up">
                Connecting Classrooms with Companies. Empowering Students through NEP 2020-aligned internships.
              </p>
              <p className="text-xl md:text-2xl text-[#333333] dark:text-gray-200 leading-relaxed animate-slide-up">
                Bridging the gap between academic learning and industry requirements through innovative internship programs aligned with NEP 2020.
              </p>
            </div>

            {/* Removed platform highlights to keep hero image unobstructed */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register/student" className="pulse-hover">
                <Button variant="primary" size="lg" className="group bg-gradient-to-r from-[#0F3D67] to-[#0056A3] hover:from-[#0B2F50] hover:to-[#003D73] text-white shadow-lg hover:shadow-[0_10px_24px_rgba(0,86,163,0.35)]">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/features" className="pulse-hover">
                <Button variant="outline" size="lg" className="border-[#0F3D67] text-[#0F3D67] hover:bg-[#0F3D67] hover:text-white">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Quick Access */}
            <div className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Quick Access:</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login/student"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm font-medium">Student Portal</span>
                </Link>
                <Link
                  href="/login/faculty"
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Faculty Portal</span>
                </Link>
                <Link
                  href="/login/industry"
                  className="flex items-center space-x-2 px-4 py-2 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Industry Portal</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right column intentionally empty; background image covers entire section */}
          <motion.div variants={itemVariants} className="relative"></motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;