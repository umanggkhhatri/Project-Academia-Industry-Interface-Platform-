import Link from 'next/link';
import { Mail, Phone, MapPin, GraduationCap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-saffron-500 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Prashiskshan</h3>
                <p className="text-sm text-white/80">Academia-Industry Interface</p>
              </div>
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Bridging the gap between academia and industry through innovative internship programs, 
              skill development, and transparent credit systems aligned with NEP 2020.
            </p>
            <div className="flex space-x-4">
              {/* Government Logos Placeholder */}
              <div className="w-16 h-12 bg-white rounded flex items-center justify-center">
                <span className="text-xs text-primary-900 font-bold">GOI</span>
              </div>
              <div className="w-16 h-12 bg-white rounded flex items-center justify-center">
                <span className="text-xs text-primary-900 font-bold">NEP</span>
              </div>
              <div className="w-16 h-12 bg-white rounded flex items-center justify-center">
                <span className="text-xs text-primary-900 font-bold">AICTE</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/90 hover:text-saffron-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-white/90 hover:text-saffron-400 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-white/90 hover:text-saffron-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-white/90 hover:text-saffron-400 transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/90 hover:text-saffron-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/90 hover:text-saffron-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-saffron-500" />
                <span className="text-white/90">support@prashiskshan.gov.in</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-saffron-500" />
                <span className="text-white/90">+91 11 2345 6789</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-saffron-500 mt-1" />
                <span className="text-white/90">
                  Ministry of Education<br />
                  Shastri Bhawan, New Delhi<br />
                  110001, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 text-sm">
              © 2024 Prashiskshan - Academia-Industry Interface. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/accessibility" className="text-white/90 hover:text-saffron-400 text-sm transition-colors">
                Accessibility
              </Link>
              <Link href="/sitemap" className="text-white/90 hover:text-saffron-400 text-sm transition-colors">
                Sitemap
              </Link>
              <Link href="/feedback" className="text-white/90 hover:text-saffron-400 text-sm transition-colors">
                Feedback
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;