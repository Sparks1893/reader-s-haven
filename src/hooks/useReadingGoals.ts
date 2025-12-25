import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface ReadingGoal {
  id: string;
  goalType: 'monthly' | 'yearly';
  targetBooks: number;
  year: number;
  month?: number; // 1-12 for monthly, undefined for yearly
}

const STORAGE_KEY = 'bookshive_reading_goals';

export function useReadingGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<ReadingGoal[]>([]);

  // Load goals from localStorage on mount
  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
    if (stored) {
      try {
        setGoals(JSON.parse(stored));
      } catch {
        setGoals([]);
      }
    }
  }, [user]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (!user) return;
    localStorage.setItem(`${STORAGE_KEY}_${user.id}`, JSON.stringify(goals));
  }, [goals, user]);

  const setGoal = useCallback((goal: Omit<ReadingGoal, 'id'>) => {
    setGoals(prev => {
      // Check if goal already exists for this type/period
      const existingIndex = prev.findIndex(g => 
        g.goalType === goal.goalType && 
        g.year === goal.year && 
        g.month === goal.month
      );

      const newGoal: ReadingGoal = {
        ...goal,
        id: existingIndex >= 0 ? prev[existingIndex].id : crypto.randomUUID()
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newGoal;
        return updated;
      }
      return [...prev, newGoal];
    });
  }, []);

  const removeGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const getYearlyGoal = useCallback((year: number) => {
    return goals.find(g => g.goalType === 'yearly' && g.year === year);
  }, [goals]);

  const getMonthlyGoal = useCallback((year: number, month: number) => {
    return goals.find(g => g.goalType === 'monthly' && g.year === year && g.month === month);
  }, [goals]);

  const currentYearlyGoal = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return getYearlyGoal(currentYear);
  }, [getYearlyGoal]);

  const currentMonthlyGoal = useMemo(() => {
    const now = new Date();
    return getMonthlyGoal(now.getFullYear(), now.getMonth() + 1);
  }, [getMonthlyGoal]);

  return {
    goals,
    setGoal,
    removeGoal,
    getYearlyGoal,
    getMonthlyGoal,
    currentYearlyGoal,
    currentMonthlyGoal,
  };
}
