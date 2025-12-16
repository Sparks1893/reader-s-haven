-- Create books table for user libraries
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  genre TEXT,
  series TEXT,
  series_number INTEGER,
  status TEXT NOT NULL DEFAULT 'want-to-read' CHECK (status IN ('reading', 'completed', 'want-to-read', 'dnf')),
  rating INTEGER CHECK (rating >= 0 AND rating <= 5),
  spice_rating INTEGER CHECK (spice_rating >= 0 AND spice_rating <= 5),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  is_wishlisted BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  pages_total INTEGER,
  pages_read INTEGER DEFAULT 0,
  date_added TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_started TIMESTAMP WITH TIME ZONE,
  date_completed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own books" 
ON public.books 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own books" 
ON public.books 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books" 
ON public.books 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books" 
ON public.books 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_books_updated_at
BEFORE UPDATE ON public.books
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_books_user_id ON public.books(user_id);
CREATE INDEX idx_books_status ON public.books(status);
CREATE INDEX idx_books_genre ON public.books(genre);