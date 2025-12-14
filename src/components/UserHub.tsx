import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { OverviewSection } from '@/components/sections/OverviewSection';
import { LibrarySection } from '@/components/sections/LibrarySection';
import { WishlistSection } from '@/components/sections/WishlistSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { CommunitySection } from '@/components/sections/CommunitySection';
import { RecommendationsSection } from '@/components/sections/RecommendationsSection';
import { SeriesSection } from '@/components/sections/SeriesSection';
import { LibraryProvider } from '@/contexts/LibraryContext';

export function UserHub() {
  const [activeSection, setActiveSection] = useState('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection onSectionChange={setActiveSection} />;
      case 'library':
        return <LibrarySection />;
      case 'wishlist':
        return <WishlistSection />;
      case 'series':
        return <SeriesSection />;
      case 'achievements':
        return <AchievementsSection />;
      case 'community':
        return <CommunitySection />;
      case 'recommendations':
        return <RecommendationsSection />;
      default:
        return <OverviewSection onSectionChange={setActiveSection} />;
    }
  };

  return (
    <LibraryProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 overflow-x-hidden">
          <div className="container max-w-7xl py-8 px-4 lg:px-8 pt-16 lg:pt-8">
            {renderSection()}
          </div>
        </main>
      </div>
    </LibraryProvider>
  );
}
