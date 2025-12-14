import { motion } from 'framer-motion';
import { Users, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedCard } from '@/components/FeedCard';
import { mockFeedItems } from '@/data/mockData';

export function CommunitySection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-1">
            See what other readers are up to
          </p>
        </div>
        <Button variant="amber" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          Share Update
        </Button>
      </div>

      {/* Feed */}
      <div className="max-w-2xl space-y-4">
        {mockFeedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <FeedCard item={item} />
          </motion.div>
        ))}
      </div>

      {/* Book Clubs Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-bookhive-forest to-bookhive-forest-light rounded-2xl p-8 text-primary-foreground max-w-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary-foreground/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold mb-2">
              Join a Book Club
            </h3>
            <p className="text-primary-foreground/80 mb-4">
              Connect with like-minded readers, participate in discussions, and discover new books together.
            </p>
            <Button variant="amber">
              Explore Book Clubs
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
