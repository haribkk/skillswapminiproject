
import React from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturedUsersSection from '../components/home/FeaturedUsersSection';
import SkillCategoriesSection from '../components/home/SkillCategoriesSection';
import CommunityStatsSection from '../components/home/CommunityStatsSection';
import CtaSection from '../components/home/CtaSection';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <FeaturedUsersSection />
      <SkillCategoriesSection />
      <CommunityStatsSection />
      <CtaSection />
    </div>
  );
};

export default Home;
