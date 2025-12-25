import { useState } from 'react';
import { Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SetGoalDialogProps {
  onSetGoal: (goal: {
    goalType: 'monthly' | 'yearly';
    targetBooks: number;
    year: number;
    month?: number;
  }) => void;
  currentYearlyGoal?: number;
  currentMonthlyGoal?: number;
  trigger?: React.ReactNode;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function SetGoalDialog({ 
  onSetGoal, 
  currentYearlyGoal, 
  currentMonthlyGoal,
  trigger 
}: SetGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [goalType, setGoalType] = useState<'monthly' | 'yearly'>('yearly');
  const [targetBooks, setTargetBooks] = useState(currentYearlyGoal?.toString() || '12');
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const handleSubmit = () => {
    const target = parseInt(targetBooks);
    if (isNaN(target) || target < 1) {
      toast({
        title: 'Invalid target',
        description: 'Please enter a valid number of books (at least 1).',
        variant: 'destructive'
      });
      return;
    }

    onSetGoal({
      goalType,
      targetBooks: target,
      year: currentYear,
      month: goalType === 'monthly' ? parseInt(selectedMonth) : undefined
    });

    toast({
      title: 'Goal set!',
      description: `Your ${goalType} reading goal has been set to ${target} books.`
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            Set Reading Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Set Reading Goal
          </DialogTitle>
          <DialogDescription>
            Set a target number of books you want to read. Track your progress and stay motivated!
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={goalType} onValueChange={(v) => setGoalType(v as 'monthly' | 'yearly')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="yearly">Yearly Goal</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Goal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="yearly" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="yearly-target">Books to read in {currentYear}</Label>
              <Input
                id="yearly-target"
                type="number"
                min="1"
                max="1000"
                value={targetBooks}
                onChange={(e) => setTargetBooks(e.target.value)}
                placeholder="e.g., 24"
              />
              <p className="text-xs text-muted-foreground">
                That's about {Math.ceil(parseInt(targetBooks) / 12) || 1} book(s) per month
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="month-select">Month</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month, index) => (
                    <SelectItem 
                      key={month} 
                      value={(index + 1).toString()}
                      disabled={index + 1 < currentMonth}
                    >
                      {month} {currentYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly-target">Books to read</Label>
              <Input
                id="monthly-target"
                type="number"
                min="1"
                max="100"
                value={targetBooks}
                onChange={(e) => setTargetBooks(e.target.value)}
                placeholder="e.g., 3"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Set Goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
