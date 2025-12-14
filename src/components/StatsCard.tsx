import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'amber';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  variant = 'default' 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:shadow-elevated",
        variant === 'default' && "bg-card border border-border/50 shadow-card",
        variant === 'primary' && "bg-bookhive-forest text-primary-foreground",
        variant === 'amber' && "bg-bookhive-amber text-bookhive-brown"
      )}
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10",
        variant === 'default' && "bg-primary",
        variant === 'primary' && "bg-primary-foreground",
        variant === 'amber' && "bg-bookhive-brown"
      )} />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn(
              "text-sm font-medium",
              variant === 'default' && "text-muted-foreground",
              variant === 'primary' && "text-primary-foreground/80",
              variant === 'amber' && "text-bookhive-brown/80"
            )}>
              {title}
            </p>
            <p className="mt-2 font-display text-3xl font-bold tracking-tight">
              {value}
            </p>
            {description && (
              <p className={cn(
                "mt-1 text-sm",
                variant === 'default' && "text-muted-foreground",
                variant === 'primary' && "text-primary-foreground/70",
                variant === 'amber' && "text-bookhive-brown/70"
              )}>
                {description}
              </p>
            )}
          </div>
          <div className={cn(
            "rounded-lg p-2.5",
            variant === 'default' && "bg-muted",
            variant === 'primary' && "bg-primary-foreground/20",
            variant === 'amber' && "bg-bookhive-brown/20"
          )}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
