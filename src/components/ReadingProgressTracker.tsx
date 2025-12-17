import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ReadingProgressTrackerProps {
  bookId: string;
  bookTitle: string;
  pagesRead: number;
  pagesTotal: number;
  onUpdateProgress: (bookId: string, pagesRead: number) => void;
}

export function ReadingProgressTracker({
  bookId,
  bookTitle,
  pagesRead,
  pagesTotal,
  onUpdateProgress,
}: ReadingProgressTrackerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPages, setCurrentPages] = useState(pagesRead);
  const { toast } = useToast();

  const percentage = pagesTotal > 0 ? Math.round((pagesRead / pagesTotal) * 100) : 0;

  const handleSave = () => {
    const validPages = Math.max(0, Math.min(currentPages, pagesTotal || currentPages));
    onUpdateProgress(bookId, validPages);
    setIsOpen(false);
    toast({
      title: 'Progress updated!',
      description: `${validPages} of ${pagesTotal || '?'} pages read (${pagesTotal > 0 ? Math.round((validPages / pagesTotal) * 100) : 0}%)`,
    });
  };

  const adjustPages = (amount: number) => {
    setCurrentPages(prev => Math.max(0, Math.min(prev + amount, pagesTotal || Infinity)));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-full group">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <BookOpen className="w-3 h-3" />
            <span>{pagesRead} / {pagesTotal || '?'} pages</span>
            <span className="ml-auto font-medium text-foreground">{percentage}%</span>
          </div>
          <Progress 
            value={percentage} 
            className="h-1.5 bg-muted group-hover:bg-muted/80 transition-colors"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Update Reading Progress</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-sm text-muted-foreground line-clamp-1">{bookTitle}</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {pagesTotal > 0 ? Math.round((currentPages / pagesTotal) * 100) : 0}%
              </span>
            </div>
            <Progress 
              value={pagesTotal > 0 ? (currentPages / pagesTotal) * 100 : 0} 
              className="h-3"
            />
          </div>

          {/* Page Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Pages Read</label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustPages(-10)}
                disabled={currentPages <= 0}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                type="number"
                value={currentPages}
                onChange={(e) => setCurrentPages(Math.max(0, parseInt(e.target.value) || 0))}
                className="text-center text-lg font-medium"
                min={0}
                max={pagesTotal || undefined}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustPages(10)}
                disabled={pagesTotal > 0 && currentPages >= pagesTotal}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              of {pagesTotal || '?'} total pages
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentPages(Math.round((pagesTotal || 0) * 0.25))}
              disabled={!pagesTotal}
            >
              25%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentPages(Math.round((pagesTotal || 0) * 0.5))}
              disabled={!pagesTotal}
            >
              50%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentPages(Math.round((pagesTotal || 0) * 0.75))}
              disabled={!pagesTotal}
            >
              75%
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setCurrentPages(pagesTotal || 0)}
              disabled={!pagesTotal}
            >
              100%
            </Button>
          </div>

          <Button onClick={handleSave} className="w-full" variant="amber">
            Save Progress
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}