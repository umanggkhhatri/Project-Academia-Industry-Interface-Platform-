'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, GraduationCap, Users, Building2 } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (sectionId: string, closeMobile = false) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    if (closeMobile) setIsMenuOpen(false);
  };

  const navLinkClass = 'nav-link text-white/90 hover:text-white font-medium transition-colors cursor-pointer bg-transparent border-none';
  const mobileNavLinkClass = 'block w-full text-left px-3 py-2 nav-link text-white/90 hover:text-white font-medium cursor-pointer bg-transparent border-none';

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 glass-dark rounded-b-xl px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-900 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white drop-shadow">Prashiskshan</h1>
                <p className="text-xs text-white drop-shadow">Academia-Industry Interface</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <button onClick={() => scrollToSection('how-it-works')} className={navLinkClass}>
              About
            </button>
            <button onClick={() => scrollToSection('challenges')} className={navLinkClass}>
              Challenges
            </button>
            <button onClick={() => scrollToSection('key-features')} className={navLinkClass}>
              Features
            </button>
            <button onClick={() => scrollToSection('why-we-stand-out')} className={navLinkClass}>
              Why
            </button>
            <button onClick={() => scrollToSection('testimonials')} className={navLinkClass}>
              Testimonials
            </button>
          </nav>

          {/* Login Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/login/student"
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600/15 text-blue-300 rounded-lg hover:bg-blue-600/25 transition-colors border border-white/20"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">Student</span>
            </Link>
            <Link
              href="/login/faculty"
              className="flex items-center space-x-1 px-3 py-2 bg-green-600/15 text-green-300 rounded-lg hover:bg-green-600/25 transition-colors border border-white/20"
            >
              <Users className="h-4 w-4" />
              <span className="text-sm font-medium">Faculty</span>
            </Link>
            <Link
              href="/login/industry"
              className="flex items-center space-x-1 px-3 py-2 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors border border-white/20"
            >
              <Building2 className="h-4 w-4 text-white" />
              <span className="text-sm font-medium">Industry</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white/90 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-dark rounded-lg mt-2">
              <Link
                href="/"
                className={mobileNavLinkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <button
                className={mobileNavLinkClass}
                onClick={() => scrollToSection('how-it-works', true)}
              >
                About
              </button>
              <button
                className={mobileNavLinkClass}
                onClick={() => scrollToSection('challenges', true)}
              >
                Challenges
              </button>
              <button
                className={mobileNavLinkClass}
                onClick={() => scrollToSection('features', true)}
              >
                Features
              </button>
              <button
                className={mobileNavLinkClass}
                onClick={() => scrollToSection('why-we-stand-out', true)}
              >
                Why
              </button>
              <button
                className={mobileNavLinkClass}
                onClick={() => scrollToSection('testimonials', true)}
              >
                Testimonials
              </button>

              {/* Mobile Login Buttons */}
              <div className="pt-4 space-y-2">
                <Link
                  href="/login/student"
                  className="flex items-center space-x-2 w-full px-3 py-2 bg-blue-600/15 text-blue-300 rounded-lg hover:bg-blue-600/25 transition-colors border border-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <GraduationCap className="h-4 w-4" />
                  <span className="font-medium">Student Login</span>
                </Link>
                <Link
                  href="/login/faculty"
                  className="flex items-center space-x-2 w-full px-3 py-2 bg-green-600/15 text-green-300 rounded-lg hover:bg-green-600/25 transition-colors border border-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Faculty Login</span>
                </Link>
                <Link
                  href="/login/industry"
                  className="flex items-center space-x-2 w-full px-3 py-2 bg-white/15 text-white rounded-lg hover:bg-white/25 transition-colors border border-white/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Building2 className="h-4 w-4 text-white" />
                  <span className="font-medium">Industry Login</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
