import { motion } from 'framer-motion';
import { Heart, Star, Flame, MoreHorizontal } from 'lucide-react';
import { Book, ReadingStatus } from '@/types/book';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ReadingProgressTracker } from '@/components/ReadingProgressTracker';
import { useLibraryContext } from '@/contexts/LibraryContext';
import { cn } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  view?: 'grid' | 'list';
}

const statusConfig: Record<ReadingStatus, { label: string; variant: 'reading' | 'completed' | 'toRead' | 'paused' | 'dnf' }> = {
  'reading': { label: 'Reading', variant: 'reading' },
  'completed': { label: 'Completed', variant: 'completed' },
  'to-read': { label: 'To Read', variant: 'toRead' },
  'paused': { label: 'Paused', variant: 'paused' },
  'dnf': { label: 'DNF', variant: 'dnf' },
};

export function BookCard({ book, view = 'grid' }: BookCardProps) {
  const { updateReadingProgress } = useLibraryContext();
  const statusInfo = statusConfig[book.status];
  const progressPercentage = book.pagesTotal > 0 ? Math.round((book.pagesRead / book.pagesTotal) * 100) : 0;

  if (view === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50"
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-16 h-24 object-cover rounded-md shadow-soft"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-foreground truncate">
            {book.title}
          </h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          {book.series && (
            <p className="text-xs text-muted-foreground mt-1">
              {book.series.name} #{book.series.number}
            </p>
          )}
          {/* Progress Bar for Reading books */}
          {(book.status === 'reading' || book.status === 'paused') && book.pagesTotal > 0 && (
            <div className="mt-2 max-w-xs">
              <ReadingProgressTracker
                bookId={book.id}
                bookTitle={book.title}
                pagesRead={book.pagesRead}
                pagesTotal={book.pagesTotal}
                onUpdateProgress={updateReadingProgress}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          {book.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-bookhive-amber text-bookhive-amber" />
              <span className="text-sm font-medium">{book.rating}</span>
            </div>
          )}
          {book.spiceRating && book.spiceRating > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-bookhive-spice" />
              <span className="text-sm text-bookhive-spice">{book.spiceRating}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50"
    >
      {/* Cover Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Favorite Button */}
        <button className={cn(
          "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200",
          book.isFavorite 
            ? "bg-bookhive-spice/90 text-primary-foreground" 
            : "bg-background/70 text-muted-foreground hover:bg-background/90"
        )}>
          <Heart className={cn("w-4 h-4", book.isFavorite && "fill-current")} />
        </button>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>

        {/* Progress indicator on cover for reading books */}
        {(book.status === 'reading' || book.status === 'paused') && book.pagesTotal > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-3 py-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{book.pagesRead}/{book.pagesTotal}</span>
              <span className="font-medium text-foreground">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button variant="amber" className="w-full" size="sm">
            View Details
          </Button>
        </div>
      </div>

      {/* Book Info */}
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        
        {book.series && (
          <p className="text-xs text-muted-foreground mb-3">
            {book.series.name} #{book.series.number}
          </p>
        )}

        {/* Progress Tracker for reading/paused books */}
        {(book.status === 'reading' || book.status === 'paused') && book.pagesTotal > 0 && (
          <div className="mb-3">
            <ReadingProgressTracker
              bookId={book.id}
              bookTitle={book.title}
              pagesRead={book.pagesRead}
              pagesTotal={book.pagesTotal}
              onUpdateProgress={updateReadingProgress}
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            {book.genre.slice(0, 2).map((g) => (
              <span key={g} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                {g}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            {book.rating && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 fill-bookhive-amber text-bookhive-amber" />
                <span className="text-sm font-medium">{book.rating}</span>
              </div>
            )}
            {book.spiceRating && book.spiceRating > 0 && (
              <div className="flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 text-bookhive-spice" />
                <span className="text-xs text-bookhive-spice">{book.spiceRating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
