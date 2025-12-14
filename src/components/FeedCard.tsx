import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, Trophy } from 'lucide-react';
import { FeedItem } from '@/types/book';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  const getActivityContent = () => {
    switch (item.type) {
      case 'completed':
        return (
          <span>
            finished reading <strong className="text-foreground">{item.bookTitle}</strong>
            {item.rating && (
              <span className="inline-flex items-center gap-1 ml-2">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-bookhive-amber text-bookhive-amber" />
                ))}
              </span>
            )}
          </span>
        );
      case 'started':
        return (
          <span>
            started reading <strong className="text-foreground">{item.bookTitle}</strong>
          </span>
        );
      case 'review':
        return (
          <span>
            reviewed <strong className="text-foreground">{item.bookTitle}</strong>
          </span>
        );
      case 'achievement':
        return (
          <span className="inline-flex items-center gap-2">
            unlocked <Trophy className="w-4 h-4 text-bookhive-amber" />
            <strong className="text-bookhive-amber">{item.achievementName}</strong>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-4 bg-card rounded-xl border border-border/50 shadow-card hover:shadow-soft transition-shadow duration-300"
    >
      <Avatar className="w-10 h-10 ring-2 ring-border">
        <AvatarImage src={item.userAvatar} alt={item.userName} />
        <AvatarFallback>{item.userName[0]}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-semibold text-foreground">{item.userName}</span>
            <span className="text-muted-foreground ml-1">{getActivityContent()}</span>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
          </span>
        </div>
        
        {item.content && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            "{item.content}"
          </p>
        )}
        
        {item.bookCover && item.type !== 'achievement' && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={item.bookCover}
              alt={item.bookTitle}
              className="w-10 h-14 object-cover rounded shadow-soft"
            />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                <Heart className="w-3.5 h-3.5" />
                <span className="text-xs">Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="text-xs">Reply</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
