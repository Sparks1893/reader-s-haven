import { useState, useEffect } from "react";
import { LibrarySection } from "@/components/sections/LibrarySection";
import { OverviewSection } from "@/components/sections/OverviewSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { RecommendationsSection } from "@/components/sections/RecommendationsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Trophy, Lightbulb, Bookmark } from "lucide-react";

export default function WordPress() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch books from WordPress REST API
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${(window as any).readersHavenData?.rest_url}/books`,
          {
            headers: {
              "X-WP-Nonce": (window as any).readersHavenData?.nonce,
            },
          }
        );
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">Loading Reader's Haven...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-playfair font-bold text-white mb-2">
            Reader's Haven
          </h1>
          <p className="text-slate-400">
            Track your reading journey and discover your next favorite book
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="library" className="flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewSection books={books} />
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <LibrarySection books={books} setBooks={setBooks} />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <AchievementsSection books={books} />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <RecommendationsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
