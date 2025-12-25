import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReadingGoalCardProps {
  title: string;
  target: number;
  completed: number;
  periodLabel: string;
  variant?: 'default' | 'primary' | 'amber';
  onEdit?: () => void;
}

export function ReadingGoalCard({
  title,
  target,
  completed,
  periodLabel,
  variant = 'default',
  onEdit
}: ReadingGoalCardProps) {
  const percentage = target > 0 ? Math.min((completed / target) * 100, 100) : 0;
  const remaining = Math.max(target - completed, 0);
  const isCompleted = completed >= target;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className={cn(
        "h-full border-border/50 shadow-card hover:shadow-elevated transition-all duration-300",
        isCompleted && "ring-2 ring-bookhive-forest/50"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <div className={cn(
                "p-2 rounded-lg",
                variant === 'default' && "bg-primary/10",
                variant === 'primary' && "bg-bookhive-forest/20",
                variant === 'amber' && "bg-bookhive-amber/20"
              )}>
                <Target className={cn(
                  "h-4 w-4",
                  variant === 'default' && "text-primary",
                  variant === 'primary' && "text-bookhive-forest",
                  variant === 'amber' && "text-bookhive-brown"
                )} />
              </div>
              {title}
            </CardTitle>
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {periodLabel}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">
                {completed} / {target} books
              </span>
            </div>
            <Progress 
              value={percentage} 
              className={cn(
                "h-3",
                isCompleted && "[&>div]:bg-bookhive-forest"
              )}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{percentage.toFixed(0)}% complete</span>
              {!isCompleted && <span>{remaining} to go</span>}
              {isCompleted && (
                <span className="text-bookhive-forest font-medium flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Goal reached!
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
