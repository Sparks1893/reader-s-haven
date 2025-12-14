import { motion } from 'framer-motion';
import { Bookmark, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockBooks } from '@/data/mockData';

export function SeriesSection() {
  // Group books by series
  const seriesBooks = mockBooks.filter(b => b.series);
  const seriesMap = seriesBooks.reduce((acc, book) => {
    if (!book.series) return acc;
    const seriesName = book.series.name;
    if (!acc[seriesName]) {
      acc[seriesName] = [];
    }
    acc[seriesName].push(book);
    return acc;
  }, {} as Record<string, typeof mockBooks>);

  // Mock series data with total book counts
  const series = [
    {
      name: 'A Court of Thorns and Roses',
      owned: 1,
      total: 5,
      books: seriesMap['A Court of Thorns and Roses'] || [],
    },
    {
      name: 'The Empyrean',
      owned: 1,
      total: 2,
      books: seriesMap['The Empyrean'] || [],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-bookhive-forest" />
          Series Tracker
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your progress through book series
        </p>
      </div>

      {/* Series List */}
      <div className="space-y-6">
        {series.map((s, index) => {
          const progress = (s.owned / s.total) * 100;
          const isComplete = s.owned === s.total;

          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-xl border border-border/50 p-6 shadow-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    {s.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {s.owned} of {s.total} books owned
                  </p>
                </div>
                {isComplete ? (
                  <Badge variant="completed" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="paused" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {s.total - s.owned} Missing
                  </Badge>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${isComplete ? 'bg-bookhive-amber' : 'bg-bookhive-forest'}`}
                  />
                </div>
              </div>

              {/* Books in Series */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {s.books.map((book) => (
                  <div key={book.id} className="flex-shrink-0">
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-lg shadow-soft"
                    />
                    <p className="text-xs text-center mt-1 text-muted-foreground">
                      #{book.series?.number}
                    </p>
                  </div>
                ))}
                {/* Missing Books Placeholder */}
                {Array.from({ length: s.total - s.owned }).map((_, i) => (
                  <div key={`missing-${i}`} className="flex-shrink-0">
                    <div className="w-16 h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                      <span className="text-2xl text-muted-foreground">?</span>
                    </div>
                    <p className="text-xs text-center mt-1 text-muted-foreground">
                      Missing
                    </p>
                  </div>
                ))}
              </div>

              {/* Action */}
              {!isComplete && (
                <Button variant="soft" size="sm" className="mt-4 gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Find Missing Books
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {series.length === 0 && (
        <div className="text-center py-16">
          <Bookmark className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No series tracked yet
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Add books that are part of a series to start tracking your collection progress.
          </p>
        </div>
      )}
    </div>
  );
}
