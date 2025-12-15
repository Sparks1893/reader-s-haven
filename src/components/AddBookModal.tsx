import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookOpen, Loader2, Check, Camera, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { BarcodeScanner } from '@/components/BarcodeScanner';
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

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: BookResult) => void;
}

export function AddBookModal({ isOpen, onClose, onAddBook }: AddBookModalProps) {
  const [isbn, setIsbn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bookResult, setBookResult] = useState<BookResult | null>(null);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState<'manual' | 'camera'>('manual');
  const { toast } = useToast();

  const searchByISBN = async (searchIsbn: string) => {
    const cleanIsbn = searchIsbn.replace(/[-\s]/g, '');
    
    if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
      setError('Please enter a valid 10 or 13 digit ISBN');
      return;
    }

    setIsLoading(true);
    setError('');
    setBookResult(null);

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`
      );
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        setError('No book found with this ISBN. Try another ISBN or add manually.');
        setIsLoading(false);
        return;
      }

      const book = data.items[0].volumeInfo;
      const imageLinks = book.imageLinks || {};
      
      setBookResult({
        id: data.items[0].id,
        title: book.title || 'Unknown Title',
        authors: book.authors || ['Unknown Author'],
        coverUrl: imageLinks.thumbnail?.replace('http:', 'https:') || 
                  imageLinks.smallThumbnail?.replace('http:', 'https:') ||
                  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=450&fit=crop',
        description: book.description || '',
        pageCount: book.pageCount || 0,
        categories: book.categories || [],
        publishedDate: book.publishedDate || '',
        isbn: cleanIsbn,
      });
    } catch (err) {
      setError('Failed to fetch book data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isbn.trim()) {
      searchByISBN(isbn);
    }
  };

  const handleAddToLibrary = () => {
    if (bookResult) {
      onAddBook(bookResult);
      toast({
        title: "Book added!",
        description: `"${bookResult.title}" has been added to your library.`,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setIsbn('');
    setBookResult(null);
    setError('');
    setInputMode('manual');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-elevated z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-bookhive-forest/10">
                  <BookOpen className="w-5 h-5 text-bookhive-forest" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Add Book by ISBN
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Input Mode Toggle */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={inputMode === 'manual' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('manual')}
                  className="gap-2"
                >
                  <Keyboard className="w-4 h-4" />
                  Manual Entry
                </Button>
                <Button
                  variant={inputMode === 'camera' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('camera')}
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Scan Barcode
                </Button>
              </div>

              {inputMode === 'manual' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      ISBN Number
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Enter ISBN (e.g., 978-0-316-76948-0)"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        className="pr-12"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        disabled={isLoading || !isbn.trim()}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Find the ISBN on the back cover or copyright page of the book
                    </p>
                  </div>
                </form>
              ) : (
                <BarcodeScanner
                  onScan={(scannedIsbn) => {
                    setIsbn(scannedIsbn);
                    searchByISBN(scannedIsbn);
                    setInputMode('manual');
                  }}
                  onError={(err) => setError(err)}
                />
              )}

              {/* Error Message */}
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive mt-4"
                >
                  {error}
                </motion.p>
              )}

              {/* Book Result */}
              {bookResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-muted/50 rounded-xl border border-border"
                >
                  <div className="flex gap-4">
                    <img
                      src={bookResult.coverUrl}
                      alt={bookResult.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-soft"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground line-clamp-2">
                        {bookResult.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {bookResult.authors.join(', ')}
                      </p>
                      {bookResult.publishedDate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Published: {bookResult.publishedDate}
                        </p>
                      )}
                      {bookResult.pageCount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {bookResult.pageCount} pages
                        </p>
                      )}
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {bookResult.categories.slice(0, 2).map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {bookResult.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                      {bookResult.description}
                    </p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="amber"
                onClick={handleAddToLibrary}
                disabled={!bookResult}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                Add to Library
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
