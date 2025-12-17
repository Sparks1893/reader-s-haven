import { createContext, useContext, ReactNode } from 'react';
import { useLibrary } from '@/hooks/useLibrary';
import { Book } from '@/types/book';

interface BookResult {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string;
  description: string;
  pageCount: number;
  categories: string[];
  publishedDate: string;
  isbn: string;
}

interface LibraryContextType {
  books: Book[];
  wishlist: Book[];
  isLoading: boolean;
  addBook: (book: BookResult) => void;
  removeBook: (bookId: string) => void;
  updateBookStatus: (bookId: string, status: Book['status']) => void;
  toggleFavorite: (bookId: string) => void;
  addToWishlist: (book: BookResult) => void;
  removeFromWishlist: (bookId: string) => void;
  updateBookRating: (bookId: string, rating: number) => void;
  updateReadingProgress: (bookId: string, pagesRead: number) => void;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const library = useLibrary();

  return (
    <LibraryContext.Provider value={library}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibraryContext() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibraryContext must be used within a LibraryProvider');
  }
  return context;
}
