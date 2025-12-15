import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, BookOpen, Loader2, Check, Camera, Keyboard, Layers, Trash2, Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  const [inputMode, setInputMode] = useState<'manual' | 'camera' | 'bulk' | 'import'>('manual');
  const [bulkBooks, setBulkBooks] = useState<BookResult[]>([]);
  const [bulkLoading, setBulkLoading] = useState<string[]>([]);
  const [bulkIsbns, setBulkIsbns] = useState('');
  const [failedIsbns, setFailedIsbns] = useState<string[]>([]);
  const [importProgress, setImportProgress] = useState<{ current: number; total: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchBookByISBN = async (searchIsbn: string): Promise<BookResult | null> => {
    const cleanIsbn = searchIsbn.replace(/[-\s]/g, '');
    
    if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
      return null;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`
      );
      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        return null;
      }

      const book = data.items[0].volumeInfo;
      const imageLinks = book.imageLinks || {};
      
      return {
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
      };
    } catch (err) {
      return null;
    }
  };

  const searchByISBN = async (searchIsbn: string) => {
    const cleanIsbn = searchIsbn.replace(/[-\s]/g, '');
    
    if (!/^(\d{10}|\d{13})$/.test(cleanIsbn)) {
      setError('Please enter a valid 10 or 13 digit ISBN');
      return;
    }

    setIsLoading(true);
    setError('');
    setBookResult(null);

    const book = await fetchBookByISBN(cleanIsbn);
    
    if (book) {
      setBookResult(book);
    } else {
      setError('No book found with this ISBN. Try another ISBN or add manually.');
    }
    
    setIsLoading(false);
  };

  const handleBulkScan = async (scannedIsbn: string) => {
    if (bulkBooks.some(b => b.isbn === scannedIsbn)) {
      return;
    }

    setBulkLoading(prev => [...prev, scannedIsbn]);
    
    const book = await fetchBookByISBN(scannedIsbn);
    
    setBulkLoading(prev => prev.filter(isbn => isbn !== scannedIsbn));
    
    if (book) {
      setBulkBooks(prev => [...prev, book]);
    }
  };

  const parseISBNs = (text: string): string[] => {
    // Split by newlines, commas, semicolons, or whitespace
    const parts = text.split(/[\n,;\s]+/);
    
    // Clean and validate each ISBN
    const isbns: string[] = [];
    for (const part of parts) {
      const cleaned = part.replace(/[-\s]/g, '').trim();
      if (/^(\d{10}|\d{13})$/.test(cleaned)) {
        if (!isbns.includes(cleaned)) {
          isbns.push(cleaned);
        }
      }
    }
    
    return isbns;
  };

  const handleBulkImport = async () => {
    const isbns = parseISBNs(bulkIsbns);
    
    if (isbns.length === 0) {
      setError('No valid ISBNs found. Enter 10 or 13 digit ISBNs separated by commas, spaces, or new lines.');
      return;
    }

    // Filter out already added ISBNs
    const newIsbns = isbns.filter(isbn => !bulkBooks.some(b => b.isbn === isbn));
    
    if (newIsbns.length === 0) {
      setError('All ISBNs have already been added.');
      return;
    }

    setError('');
    setFailedIsbns([]);
    setImportProgress({ current: 0, total: newIsbns.length });
    setBulkLoading(newIsbns);

    const failed: string[] = [];
    
    // Process ISBNs in batches of 3 to avoid rate limiting
    for (let i = 0; i < newIsbns.length; i += 3) {
      const batch = newIsbns.slice(i, i + 3);
      const results = await Promise.all(batch.map(fetchBookByISBN));
      
      results.forEach((book, index) => {
        const currentIsbn = batch[index];
        setBulkLoading(prev => prev.filter(isbn => isbn !== currentIsbn));
        
        if (book) {
          setBulkBooks(prev => [...prev, book]);
        } else {
          failed.push(currentIsbn);
        }
      });
      
      setImportProgress({ current: Math.min(i + 3, newIsbns.length), total: newIsbns.length });
      
      // Small delay between batches
      if (i + 3 < newIsbns.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }

    setImportProgress(null);
    setBulkIsbns('');
    
    if (failed.length > 0) {
      setFailedIsbns(failed);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    
    // Try to extract ISBNs from CSV
    // Look for columns that might contain ISBNs
    const lines = text.split('\n');
    const isbns: string[] = [];
    
    for (const line of lines) {
      // Split by common CSV delimiters
      const cells = line.split(/[,;\t]/);
      
      for (const cell of cells) {
        const cleaned = cell.replace(/["'\s-]/g, '').trim();
        if (/^(\d{10}|\d{13})$/.test(cleaned)) {
          if (!isbns.includes(cleaned)) {
            isbns.push(cleaned);
          }
        }
      }
    }
    
    if (isbns.length > 0) {
      setBulkIsbns(isbns.join('\n'));
      toast({
        title: `${isbns.length} ISBNs found`,
        description: 'Click "Import ISBNs" to fetch book data.',
      });
    } else {
      setError('No valid ISBNs found in the file.');
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFromBulk = (isbn: string) => {
    setBulkBooks(prev => prev.filter(b => b.isbn !== isbn));
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

  const handleAddAllToLibrary = () => {
    bulkBooks.forEach(book => onAddBook(book));
    toast({
      title: `${bulkBooks.length} books added!`,
      description: "All books have been added to your library.",
    });
    handleClose();
  };

  const handleClose = () => {
    setIsbn('');
    setBookResult(null);
    setError('');
    setInputMode('manual');
    setBulkBooks([]);
    setBulkLoading([]);
    setBulkIsbns('');
    setFailedIsbns([]);
    setImportProgress(null);
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-2xl shadow-elevated z-50 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-bookhive-forest/10">
                  <BookOpen className="w-5 h-5 text-bookhive-forest" />
                </div>
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Add Books
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Input Mode Toggle */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <Button
                  variant={inputMode === 'manual' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('manual')}
                  className="gap-2"
                >
                  <Keyboard className="w-4 h-4" />
                  Manual
                </Button>
                <Button
                  variant={inputMode === 'camera' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('camera')}
                  className="gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Scan
                </Button>
                <Button
                  variant={inputMode === 'bulk' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('bulk')}
                  className="gap-2"
                >
                  <Layers className="w-4 h-4" />
                  Bulk Scan
                </Button>
                <Button
                  variant={inputMode === 'import' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setInputMode('import')}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Import
                </Button>
              </div>

              {inputMode === 'manual' && (
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
              )}

              {inputMode === 'camera' && (
                <BarcodeScanner
                  onScan={(scannedIsbn) => {
                    setIsbn(scannedIsbn);
                    searchByISBN(scannedIsbn);
                    setInputMode('manual');
                  }}
                  onError={(err) => setError(err)}
                />
              )}

              {inputMode === 'bulk' && (
                <div className="space-y-4">
                  <BarcodeScanner
                    onScan={handleBulkScan}
                    onError={(err) => setError(err)}
                    bulkMode
                    scannedCount={bulkBooks.length}
                  />
                  
                  {bulkLoading.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Fetching {bulkLoading.length} book{bulkLoading.length > 1 ? 's' : ''}...
                    </div>
                  )}
                  
                  {bulkBooks.length > 0 && (
                    <BulkBooksList 
                      books={bulkBooks} 
                      onRemove={removeFromBulk} 
                      onClear={() => setBulkBooks([])} 
                    />
                  )}
                </div>
              )}

              {inputMode === 'import' && (
                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2 h-20 border-dashed"
                    >
                      <Upload className="w-5 h-5" />
                      <div className="text-left">
                        <p className="font-medium">Upload CSV or TXT file</p>
                        <p className="text-xs text-muted-foreground">
                          File should contain ISBNs
                        </p>
                      </div>
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-2 text-xs text-muted-foreground">or paste ISBNs</span>
                    </div>
                  </div>

                  {/* Text Input */}
                  <div>
                    <Textarea
                      placeholder="Paste ISBNs here (one per line, or separated by commas)&#10;&#10;Example:&#10;978-0-316-76948-8&#10;9780743273565&#10;0-14-028329-X"
                      value={bulkIsbns}
                      onChange={(e) => setBulkIsbns(e.target.value)}
                      className="min-h-[120px] font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports ISBN-10 and ISBN-13 formats, with or without dashes
                    </p>
                  </div>

                  {/* Import Button */}
                  <Button
                    variant="amber"
                    onClick={handleBulkImport}
                    disabled={!bulkIsbns.trim() || bulkLoading.length > 0}
                    className="w-full gap-2"
                  >
                    {bulkLoading.length > 0 ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {importProgress 
                          ? `Importing ${importProgress.current}/${importProgress.total}...`
                          : 'Importing...'
                        }
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Import ISBNs
                      </>
                    )}
                  </Button>

                  {/* Progress bar */}
                  {importProgress && (
                    <div className="space-y-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-bookhive-amber"
                          initial={{ width: 0 }}
                          animate={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {importProgress.current} of {importProgress.total} processed
                      </p>
                    </div>
                  )}

                  {/* Failed ISBNs */}
                  {failedIsbns.length > 0 && (
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <div className="flex items-center gap-2 text-sm text-destructive mb-2">
                        <AlertCircle className="w-4 h-4" />
                        {failedIsbns.length} ISBN{failedIsbns.length > 1 ? 's' : ''} not found
                      </div>
                      <p className="text-xs text-muted-foreground font-mono">
                        {failedIsbns.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Imported books list */}
                  {bulkBooks.length > 0 && (
                    <BulkBooksList 
                      books={bulkBooks} 
                      onRemove={removeFromBulk} 
                      onClear={() => setBulkBooks([])} 
                    />
                  )}
                </div>
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

              {/* Single Book Result (for manual/single camera mode) */}
              {bookResult && (inputMode === 'manual' || inputMode === 'camera') && (
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
            <div className="flex justify-end gap-3 p-6 border-t border-border bg-muted/30 shrink-0">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              {(inputMode === 'bulk' || inputMode === 'import') ? (
                <Button
                  variant="amber"
                  onClick={handleAddAllToLibrary}
                  disabled={bulkBooks.length === 0}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Add {bulkBooks.length} Book{bulkBooks.length !== 1 ? 's' : ''}
                </Button>
              ) : (
                <Button
                  variant="amber"
                  onClick={handleAddToLibrary}
                  disabled={!bookResult}
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Add to Library
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Extracted component for the bulk books list
function BulkBooksList({ 
  books, 
  onRemove, 
  onClear 
}: { 
  books: BookResult[]; 
  onRemove: (isbn: string) => void; 
  onClear: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">
          Books to Add ({books.length})
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-xs text-muted-foreground"
        >
          Clear all
        </Button>
      </div>
      <ScrollArea className="max-h-[200px]">
        <div className="space-y-2">
          {books.map((book) => (
            <motion.div
              key={book.isbn}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg"
            >
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-10 h-14 object-cover rounded shadow-soft"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {book.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {book.authors.join(', ')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(book.isbn)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
