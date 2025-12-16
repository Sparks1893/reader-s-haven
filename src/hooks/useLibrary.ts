import { useCallback, useMemo } from 'react';
import { Book } from '@/types/book';
import { useBooks, BookDB } from './useBooks';

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

// Convert database book to frontend Book type
function dbToBook(dbBook: BookDB): Book {
  return {
    id: dbBook.id,
    title: dbBook.title,
    author: dbBook.author,
    coverUrl: dbBook.cover_url || '/placeholder.svg',
    genre: dbBook.genre ? [dbBook.genre] : [],
    series: dbBook.series ? { name: dbBook.series, number: dbBook.series_number || 1 } : undefined,
    status: dbBook.status === 'want-to-read' ? 'to-read' : dbBook.status as Book['status'],
    rating: dbBook.rating ?? undefined,
    spiceRating: dbBook.spice_rating ?? undefined,
    dateAdded: dbBook.date_added.split('T')[0],
    dateCompleted: dbBook.date_completed?.split('T')[0],
    notes: dbBook.notes ?? undefined,
    isFavorite: dbBook.is_favorite,
    isWishlisted: dbBook.is_wishlisted,
  };
}

export function useLibrary() {
  const { 
    books: dbBooks, 
    addBook: addBookDB, 
    updateBook: updateBookDB, 
    deleteBook: deleteBookDB,
    isLoading 
  } = useBooks();

  // Convert DB books to frontend format
  const books = useMemo(() => 
    dbBooks.filter(b => !b.is_wishlisted).map(dbToBook),
    [dbBooks]
  );

  const wishlist = useMemo(() => 
    dbBooks.filter(b => b.is_wishlisted).map(dbToBook),
    [dbBooks]
  );

  const addBook = useCallback((bookResult: BookResult) => {
    addBookDB({
      title: bookResult.title,
      author: bookResult.authors.join(', '),
      cover_url: bookResult.coverUrl || null,
      genre: bookResult.categories[0] || null,
      series: null,
      series_number: null,
      status: 'want-to-read',
      rating: null,
      spice_rating: null,
      is_favorite: false,
      is_wishlisted: false,
      notes: bookResult.description || null,
      pages_total: bookResult.pageCount || null,
      pages_read: 0,
      date_started: null,
      date_completed: null,
    });
  }, [addBookDB]);

  const removeBook = useCallback((bookId: string) => {
    deleteBookDB(bookId);
  }, [deleteBookDB]);

  const updateBookStatus = useCallback((bookId: string, status: Book['status']) => {
    const dbStatus = status === 'to-read' ? 'want-to-read' : status;
    updateBookDB({
      id: bookId,
      updates: {
        status: dbStatus as BookDB['status'],
        date_completed: status === 'completed' ? new Date().toISOString() : null,
        date_started: status === 'reading' ? new Date().toISOString() : undefined,
      }
    });
  }, [updateBookDB]);

  const toggleFavorite = useCallback((bookId: string) => {
    const book = dbBooks.find(b => b.id === bookId);
    if (book) {
      updateBookDB({
        id: bookId,
        updates: { is_favorite: !book.is_favorite }
      });
    }
  }, [dbBooks, updateBookDB]);

  const addToWishlist = useCallback((bookResult: BookResult) => {
    addBookDB({
      title: bookResult.title,
      author: bookResult.authors.join(', '),
      cover_url: bookResult.coverUrl || null,
      genre: bookResult.categories[0] || null,
      series: null,
      series_number: null,
      status: 'want-to-read',
      rating: null,
      spice_rating: null,
      is_favorite: false,
      is_wishlisted: true,
      notes: bookResult.description || null,
      pages_total: bookResult.pageCount || null,
      pages_read: 0,
      date_started: null,
      date_completed: null,
    });
  }, [addBookDB]);

  const removeFromWishlist = useCallback((bookId: string) => {
    deleteBookDB(bookId);
  }, [deleteBookDB]);

  const updateBookRating = useCallback((bookId: string, rating: number) => {
    updateBookDB({
      id: bookId,
      updates: { rating }
    });
  }, [updateBookDB]);

  return {
    books,
    wishlist,
    isLoading,
    addBook,
    removeBook,
    updateBookStatus,
    toggleFavorite,
    addToWishlist,
    removeFromWishlist,
    updateBookRating,
  };
}
