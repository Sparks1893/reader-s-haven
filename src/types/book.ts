export type ReadingStatus = 'to-read' | 'reading' | 'paused' | 'completed' | 'dnf';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string[];
  series?: {
    name: string;
    number: number;
  };
  status: ReadingStatus;
  rating?: number;
  spiceRating?: number;
  dateAdded: string;
  dateCompleted?: string;
  notes?: string;
  isFavorite: boolean;
  isWishlisted: boolean;
  pagesRead: number;
  pagesTotal: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface UserStats {
  totalBooks: number;
  booksCompleted: number;
  currentStreak: number;
  genresExplored: number;
  pagesRead: number;
  averageRating: number;
}

export interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'completed' | 'started' | 'review' | 'achievement';
  bookId?: string;
  bookTitle?: string;
  bookCover?: string;
  content?: string;
  rating?: number;
  achievementId?: string;
  achievementName?: string;
  timestamp: string;
}
