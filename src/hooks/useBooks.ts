import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface BookDB {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_url: string | null;
  genre: string | null;
  series: string | null;
  series_number: number | null;
  status: string;
  rating: number | null;
  spice_rating: number | null;
  is_favorite: boolean;
  is_wishlisted: boolean;
  notes: string | null;
  pages_total: number | null;
  pages_read: number | null;
  date_added: string;
  date_started: string | null;
  date_completed: string | null;
  created_at: string;
  updated_at: string;
}

export type BookInsert = Omit<BookDB, 'id' | 'created_at' | 'updated_at' | 'date_added'>;
export type BookUpdate = Partial<Omit<BookDB, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;

export function useBooks() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ['books', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('date_added', { ascending: false });
      
      if (error) throw error;
      return data as BookDB[];
    },
    enabled: !!user
  });

  const addBookMutation = useMutation({
    mutationFn: async (book: Omit<BookInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('books')
        .insert({ ...book, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({ title: 'Book added!', description: 'Your book has been added to the library.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: BookUpdate }) => {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast({ title: 'Book removed', description: 'The book has been removed from your library.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  return {
    books: booksQuery.data ?? [],
    isLoading: booksQuery.isLoading,
    error: booksQuery.error,
    addBook: addBookMutation.mutate,
    updateBook: updateBookMutation.mutate,
    deleteBook: deleteBookMutation.mutate,
    isAdding: addBookMutation.isPending,
    isUpdating: updateBookMutation.isPending,
    isDeleting: deleteBookMutation.isPending
  };
}
