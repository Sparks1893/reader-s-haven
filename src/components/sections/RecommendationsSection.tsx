import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '@/components/BookCard';
import { mockBooks } from '@/data/mockData';

export function RecommendationsSection() {
  // Simulate recommendations by showing books not in reading/completed status
  const recommendations = mockBooks.filter(b => b.status === 'to-read' || b.status === 'paused');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-bookhive-amber" />
            For You
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized recommendations based on your reading history
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Recommendation Categories */}
      <section>
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">
          Because you loved Fantasy & Romance
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recommendations.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Empty State */}
      {recommendations.length === 0 && (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            No recommendations yet
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Add more books to your library and rate them to get personalized recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
