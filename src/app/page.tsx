import HeroSection from '@/components/pages/HeroSection';
import HowItWorksSection from '@/components/pages/HowItWorksSection';
import ChallengesSection from '@/components/pages/ChallengesSection';
import WhyWeStandOutSection from '@/components/pages/WhyWeStandOutSection';
import KeyFeaturesSection from '@/components/pages/KeyFeaturesSection';
import TestimonialsSection from '@/components/pages/TestimonialsSection';
import FeedbackFormSection from '@/components/pages/FeedbackFormSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F0F4FA]">
      <HeroSection />
      <HowItWorksSection />
      <ChallengesSection />
      <KeyFeaturesSection />
      <WhyWeStandOutSection />
      <TestimonialsSection />
      <FeedbackFormSection />
    </main>
  );
}
