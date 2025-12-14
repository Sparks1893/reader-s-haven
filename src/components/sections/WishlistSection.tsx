import { motion } from 'framer-motion';
import { Heart, ExternalLink, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockWishlist } from '@/data/mockData';

export function WishlistSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Wishlist</h1>
        <p className="text-muted-foreground mt-1">
          {mockWishlist.length} books you want to read
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockWishlist.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl border border-border/50 shadow-card overflow-hidden hover:shadow-elevated transition-shadow duration-300"
          >
            <div className="flex gap-4 p-4">
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-24 h-36 object-cover rounded-lg shadow-soft"
              />
              <div className="flex-1 flex flex-col">
                <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
                {book.series && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {book.series.name} #{book.series.number}
                  </p>
                )}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {book.genre.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <div className="flex-1" />
                <div className="flex gap-2 mt-4">
                  <Button variant="amber" size="sm" className="gap-1.5 flex-1">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Buy
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-bookhive-spice">
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {mockWishlist.length === 0 && (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Start adding books you want to read and we'll help you track them.
          </p>
        </div>
      )}
    </div>
  );
}
