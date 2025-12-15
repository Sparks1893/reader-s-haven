import { useCallback } from "react";

declare global {
  interface Window {
    readersHavenData?: {
      ajax_url: string;
      rest_url: string;
      nonce: string;
      current_user_id: number;
      is_user_logged_in: boolean;
    };
  }
}

export function useWordPressAPI() {
  const wpData = (window as any).readersHavenData;

  if (!wpData) {
    throw new Error(
      "WordPress data not found. Make sure the plugin is properly enqueued."
    );
  }

  const fetchBooks = useCallback(async () => {
    try {
      const response = await fetch(`${wpData.rest_url}/books`, {
        headers: {
          "X-WP-Nonce": wpData.nonce,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }, [wpData]);

  const createBook = useCallback(
    async (bookData: any) => {
      try {
        const response = await fetch(`${wpData.rest_url}/books`, {
          method: "POST",
          headers: {
            "X-WP-Nonce": wpData.nonce,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        });

        if (!response.ok) {
          throw new Error("Failed to create book");
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating book:", error);
        throw error;
      }
    },
    [wpData]
  );

  const updateBook = useCallback(
    async (bookId: number, bookData: any) => {
      try {
        const response = await fetch(`${wpData.rest_url}/books/${bookId}`, {
          method: "PUT",
          headers: {
            "X-WP-Nonce": wpData.nonce,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookData),
        });

        if (!response.ok) {
          throw new Error("Failed to update book");
        }

        return await response.json();
      } catch (error) {
        console.error("Error updating book:", error);
        throw error;
      }
    },
    [wpData]
  );

  const deleteBook = useCallback(
    async (bookId: number) => {
      try {
        const response = await fetch(`${wpData.rest_url}/books/${bookId}`, {
          method: "DELETE",
          headers: {
            "X-WP-Nonce": wpData.nonce,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete book");
        }

        return await response.json();
      } catch (error) {
        console.error("Error deleting book:", error);
        throw error;
      }
    },
    [wpData]
  );

  return {
    wpData,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
  };
}
