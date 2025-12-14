import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { Achievement } from '@/types/book';
import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-2"
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-300",
          sizeClasses[size],
          achievement.isUnlocked
            ? "bg-gradient-to-br from-bookhive-amber to-bookhive-gold shadow-elevated ring-2 ring-bookhive-gold/30"
            : "bg-muted text-muted-foreground"
        )}
      >
        {achievement.isUnlocked ? (
          <span>{achievement.icon}</span>
        ) : (
          <Lock className="w-5 h-5 opacity-50" />
        )}
        
        {/* Glow effect for unlocked */}
        {achievement.isUnlocked && (
          <div className="absolute inset-0 rounded-full bg-bookhive-amber/20 blur-md -z-10" />
        )}
      </div>
      
      <div className="text-center">
        <p className={cn(
          "font-medium text-sm",
          achievement.isUnlocked ? "text-foreground" : "text-muted-foreground"
        )}>
          {achievement.name}
        </p>
        {size !== 'sm' && (
          <p className="text-xs text-muted-foreground mt-0.5 max-w-24">
            {achievement.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
