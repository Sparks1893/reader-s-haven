import { useState, useCallback } from 'react';
import { Book } from '@/types/book';
import { mockBooks, mockWishlist } from '@/data/mockData';

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

export function useLibrary() {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [wishlist, setWishlist] = useState<Book[]>(mockWishlist);

  const addBook = useCallback((bookResult: BookResult) => {
    const newBook: Book = {
      id: bookResult.id,
      title: bookResult.title,
      author: bookResult.authors.join(', '),
      coverUrl: bookResult.coverUrl,
      genre: bookResult.categories.slice(0, 2),
      status: 'to-read',
      dateAdded: new Date().toISOString().split('T')[0],
      isFavorite: false,
      isWishlisted: false,
      notes: bookResult.description,
    };

    setBooks((prev) => {
      // Check if book already exists
      if (prev.some((b) => b.id === newBook.id)) {
        return prev;
      }
      return [newBook, ...prev];
    });
  }, []);

  const removeBook = useCallback((bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
  }, []);

  const updateBookStatus = useCallback((bookId: string, status: Book['status']) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              status,
              dateCompleted: status === 'completed' ? new Date().toISOString().split('T')[0] : b.dateCompleted,
            }
          : b
      )
    );
  }, []);

  const toggleFavorite = useCallback((bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isFavorite: !b.isFavorite } : b))
    );
  }, []);

  const addToWishlist = useCallback((bookResult: BookResult) => {
    const newBook: Book = {
      id: bookResult.id,
      title: bookResult.title,
      author: bookResult.authors.join(', '),
      coverUrl: bookResult.coverUrl,
      genre: bookResult.categories.slice(0, 2),
      status: 'to-read',
      dateAdded: new Date().toISOString().split('T')[0],
      isFavorite: false,
      isWishlisted: true,
    };

    setWishlist((prev) => {
      if (prev.some((b) => b.id === newBook.id)) {
        return prev;
      }
      return [newBook, ...prev];
    });
  }, []);

  const removeFromWishlist = useCallback((bookId: string) => {
    setWishlist((prev) => prev.filter((b) => b.id !== bookId));
  }, []);

  return {
    books,
    wishlist,
    addBook,
    removeBook,
    updateBookStatus,
    toggleFavorite,
    addToWishlist,
    removeFromWishlist,
  };
}
