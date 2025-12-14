import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { AchievementBadge } from '@/components/AchievementBadge';
import { mockAchievements } from '@/data/mockData';

export function AchievementsSection() {
  const unlockedCount = mockAchievements.filter(a => a.isUnlocked).length;
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground mt-1">
          {unlockedCount} of {mockAchievements.length} achievements unlocked
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-xl border border-border/50 p-6 shadow-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-bookhive-amber/20">
            <Trophy className="w-6 h-6 text-bookhive-amber" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-foreground">Your Progress</span>
              <span className="text-muted-foreground">
                {Math.round((unlockedCount / mockAchievements.length) * 100)}%
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / mockAchievements.length) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-bookhive-amber to-bookhive-gold rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Unlocked
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mockAchievements
            .filter(a => a.isUnlocked)
            .map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <AchievementBadge achievement={achievement} size="lg" />
              </motion.div>
            ))}
        </div>
      </section>

      {/* Locked Achievements */}
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-muted-foreground" />
          Locked
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {mockAchievements
            .filter(a => !a.isUnlocked)
            .map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <AchievementBadge achievement={achievement} size="lg" />
              </motion.div>
            ))}
        </div>
      </section>
    </div>
  );
}
