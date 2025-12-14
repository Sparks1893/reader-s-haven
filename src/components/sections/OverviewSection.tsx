import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  BookMarked,
  Star,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { BookCard } from '@/components/BookCard';
import { AchievementBadge } from '@/components/AchievementBadge';
import { FeedCard } from '@/components/FeedCard';
import { mockBooks, mockAchievements, mockUserStats, mockFeedItems } from '@/data/mockData';

interface OverviewSectionProps {
  onSectionChange: (section: string) => void;
}

export function OverviewSection({ onSectionChange }: OverviewSectionProps) {
  const currentlyReading = mockBooks.filter(b => b.status === 'reading');
  const recentlyCompleted = mockBooks.filter(b => b.status === 'completed').slice(0, 3);
  const unlockedAchievements = mockAchievements.filter(a => a.isUnlocked);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-bookhive-forest to-bookhive-forest-light p-8 text-primary-foreground"
      >
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary-foreground/5" />
        
        <div className="relative">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Welcome back, Jane! 📚
          </h1>
          <p className="text-primary-foreground/80 max-w-md">
            You're on a {mockUserStats.currentStreak}-day reading streak! Keep it up and unlock new achievements.
          </p>
          <Button variant="amber" className="mt-4">
            Continue Reading
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Books"
          value={mockUserStats.totalBooks}
          icon={BookOpen}
          description="In your library"
        />
        <StatsCard
          title="Completed"
          value={mockUserStats.booksCompleted}
          icon={CheckCircle2}
          variant="primary"
        />
        <StatsCard
          title="Current Streak"
          value={`${mockUserStats.currentStreak} days`}
          icon={Flame}
          variant="amber"
        />
        <StatsCard
          title="Avg Rating"
          value={mockUserStats.averageRating}
          icon={Star}
          description="of your reads"
        />
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Currently Reading
            </h2>
            <Button 
              variant="ghost" 
              className="gap-1 text-muted-foreground"
              onClick={() => onSectionChange('library')}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Achievements */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Recent Achievements
            </h2>
            <Button 
              variant="ghost" 
              className="gap-1 text-muted-foreground"
              onClick={() => onSectionChange('achievements')}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
            <div className="flex flex-wrap gap-6 justify-center">
              {unlockedAchievements.slice(0, 4).map((achievement) => (
                <AchievementBadge key={achievement.id} achievement={achievement} size="sm" />
              ))}
            </div>
          </div>
        </section>

        {/* Community Feed */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold text-foreground">
              Community Activity
            </h2>
            <Button 
              variant="ghost" 
              className="gap-1 text-muted-foreground"
              onClick={() => onSectionChange('community')}
            >
              View all <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {mockFeedItems.slice(0, 3).map((item) => (
              <FeedCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
