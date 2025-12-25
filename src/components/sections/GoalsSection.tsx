import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLibraryContext } from '@/contexts/LibraryContext';
import { useReadingGoals } from '@/hooks/useReadingGoals';
import { ReadingGoalCard } from '@/components/ReadingGoalCard';
import { SetGoalDialog } from '@/components/SetGoalDialog';
import { parseISO, isWithinInterval, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export function GoalsSection() {
  const { books } = useLibraryContext();
  const { 
    goals, 
    setGoal, 
    removeGoal, 
    currentYearlyGoal, 
    currentMonthlyGoal 
  } = useReadingGoals();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Calculate completed books for the current year
  const booksCompletedThisYear = useMemo(() => {
    return books.filter(book => {
      if (!book.dateCompleted || book.status !== 'completed') return false;
      const completedDate = parseISO(book.dateCompleted);
      return isWithinInterval(completedDate, {
        start: startOfYear(new Date()),
        end: endOfYear(new Date())
      });
    }).length;
  }, [books]);

  // Calculate completed books for the current month
  const booksCompletedThisMonth = useMemo(() => {
    return books.filter(book => {
      if (!book.dateCompleted || book.status !== 'completed') return false;
      const completedDate = parseISO(book.dateCompleted);
      return isWithinInterval(completedDate, {
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date())
      });
    }).length;
  }, [books]);

  // Get monthly progress for goal display
  const monthlyProgress = useMemo(() => {
    const monthsData: Array<{ month: number; completed: number; goal?: number }> = [];
    
    for (let month = 1; month <= 12; month++) {
      const monthStart = new Date(currentYear, month - 1, 1);
      const monthEnd = endOfMonth(monthStart);
      
      const completed = books.filter(book => {
        if (!book.dateCompleted || book.status !== 'completed') return false;
        const completedDate = parseISO(book.dateCompleted);
        return isWithinInterval(completedDate, { start: monthStart, end: monthEnd });
      }).length;

      const monthGoal = goals.find(
        g => g.goalType === 'monthly' && g.year === currentYear && g.month === month
      );

      monthsData.push({
        month,
        completed,
        goal: monthGoal?.targetBooks
      });
    }
    
    return monthsData;
  }, [books, goals, currentYear]);

  const hasAnyGoal = currentYearlyGoal || currentMonthlyGoal;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Reading Goals
          </h1>
          <p className="text-muted-foreground">
            Set and track your reading targets to stay motivated.
          </p>
        </div>
        <SetGoalDialog 
          onSetGoal={setGoal}
          currentYearlyGoal={currentYearlyGoal?.targetBooks}
          currentMonthlyGoal={currentMonthlyGoal?.targetBooks}
          trigger={
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Set Goal
            </Button>
          }
        />
      </motion.div>

      {/* Current Goals */}
      {hasAnyGoal ? (
        <div className="grid md:grid-cols-2 gap-6">
          {currentYearlyGoal && (
            <ReadingGoalCard
              title="Yearly Goal"
              target={currentYearlyGoal.targetBooks}
              completed={booksCompletedThisYear}
              periodLabel={`${currentYear}`}
              variant="primary"
              onEdit={() => {
                // Opens the dialog with current values
              }}
            />
          )}
          {currentMonthlyGoal && (
            <ReadingGoalCard
              title="Monthly Goal"
              target={currentMonthlyGoal.targetBooks}
              completed={booksCompletedThisMonth}
              periodLabel={new Date(currentYear, (currentMonthlyGoal.month || 1) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              variant="amber"
            />
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-dashed border-2 border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="p-4 rounded-full bg-muted mb-4">
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No Goals Set</h3>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Set a reading goal to track your progress and stay motivated throughout the year.
              </p>
              <SetGoalDialog 
                onSetGoal={setGoal}
                trigger={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Set Your First Goal
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All Goals List */}
      {goals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg">All Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goals.map(goal => {
                  const isYearly = goal.goalType === 'yearly';
                  const periodLabel = isYearly 
                    ? `${goal.year}`
                    : new Date(goal.year, (goal.month || 1) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  
                  let completed = 0;
                  if (isYearly && goal.year === currentYear) {
                    completed = booksCompletedThisYear;
                  } else if (!isYearly && goal.year === currentYear && goal.month === currentMonth) {
                    completed = booksCompletedThisMonth;
                  } else if (!isYearly) {
                    const monthData = monthlyProgress.find(m => m.month === goal.month);
                    completed = monthData?.completed || 0;
                  }

                  const percentage = goal.targetBooks > 0 
                    ? Math.min((completed / goal.targetBooks) * 100, 100) 
                    : 0;

                  return (
                    <div 
                      key={goal.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isYearly ? 'bg-bookhive-forest/20' : 'bg-bookhive-amber/20'}`}>
                          <Target className={`h-4 w-4 ${isYearly ? 'text-bookhive-forest' : 'text-bookhive-brown'}`} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {isYearly ? 'Yearly' : 'Monthly'} Goal - {periodLabel}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {completed} / {goal.targetBooks} books ({percentage.toFixed(0)}%)
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeGoal(goal.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="font-display text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-foreground">{booksCompletedThisYear}</p>
                <p className="text-sm text-muted-foreground">Books this year</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-foreground">{booksCompletedThisMonth}</p>
                <p className="text-sm text-muted-foreground">Books this month</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-foreground">
                  {currentYearlyGoal 
                    ? Math.max(currentYearlyGoal.targetBooks - booksCompletedThisYear, 0)
                    : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Remaining (year)</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-foreground">
                  {currentMonthlyGoal 
                    ? Math.max(currentMonthlyGoal.targetBooks - booksCompletedThisMonth, 0)
                    : '-'}
                </p>
                <p className="text-sm text-muted-foreground">Remaining (month)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
