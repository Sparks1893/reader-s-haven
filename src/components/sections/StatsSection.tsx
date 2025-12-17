import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { BookOpen, TrendingUp, Calendar, Target, Flame, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLibraryContext } from '@/contexts/LibraryContext';
import { format, parseISO, startOfMonth, subMonths, isWithinInterval, differenceInDays } from 'date-fns';

const GENRE_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--bookhive-amber))',
  'hsl(var(--bookhive-forest))',
  'hsl(var(--bookhive-cream-dark))',
  'hsl(var(--muted-foreground))',
];

export function StatsSection() {
  const { books } = useLibraryContext();

  // Calculate monthly reading stats for the past 12 months
  const monthlyStats = useMemo(() => {
    const now = new Date();
    const months = [];
    
    for (let i = 11; i >= 0; i--) {
      const monthStart = startOfMonth(subMonths(now, i));
      const monthEnd = startOfMonth(subMonths(now, i - 1));
      
      const booksCompleted = books.filter(book => {
        if (!book.dateCompleted) return false;
        const completedDate = parseISO(book.dateCompleted);
        return isWithinInterval(completedDate, { start: monthStart, end: monthEnd });
      }).length;

      months.push({
        month: format(monthStart, 'MMM'),
        fullMonth: format(monthStart, 'MMMM yyyy'),
        books: booksCompleted,
      });
    }
    
    return months;
  }, [books]);

  // Calculate genre distribution
  const genreStats = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    
    books.forEach(book => {
      book.genre.forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    return Object.entries(genreCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [books]);

  // Calculate reading pace (pages per day)
  const readingPaceData = useMemo(() => {
    const now = new Date();
    const weeks = [];
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      
      let totalPages = 0;
      books.forEach(book => {
        if (book.status === 'completed' && book.dateCompleted) {
          const completedDate = parseISO(book.dateCompleted);
          if (isWithinInterval(completedDate, { start: weekStart, end: weekEnd })) {
            totalPages += book.pagesTotal || 0;
          }
        }
      });

      weeks.push({
        week: `W${12 - i}`,
        pages: Math.round(totalPages / 7),
      });
    }
    
    return weeks;
  }, [books]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const completedBooks = books.filter(b => b.status === 'completed');
    const currentYear = new Date().getFullYear();
    const booksThisYear = completedBooks.filter(b => 
      b.dateCompleted && parseISO(b.dateCompleted).getFullYear() === currentYear
    );
    
    const totalPagesRead = books.reduce((sum, b) => sum + (b.pagesRead || 0), 0);
    const avgPagesPerBook = completedBooks.length > 0
      ? Math.round(completedBooks.reduce((sum, b) => sum + (b.pagesTotal || 0), 0) / completedBooks.length)
      : 0;

    // Calculate reading streak (simplified - consecutive days with any reading activity)
    let streak = 0;
    const sortedCompleted = [...completedBooks]
      .filter(b => b.dateCompleted)
      .sort((a, b) => parseISO(b.dateCompleted!).getTime() - parseISO(a.dateCompleted!).getTime());
    
    if (sortedCompleted.length > 0) {
      const lastCompleted = parseISO(sortedCompleted[0].dateCompleted!);
      const daysSinceLastBook = differenceInDays(new Date(), lastCompleted);
      streak = daysSinceLastBook <= 30 ? Math.max(1, 30 - daysSinceLastBook) : 0;
    }

    return {
      totalBooks: books.length,
      completedThisYear: booksThisYear.length,
      totalPagesRead,
      avgPagesPerBook,
      readingStreak: streak,
      currentlyReading: books.filter(b => b.status === 'reading').length,
    };
  }, [books]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Reading Statistics
        </h1>
        <p className="text-muted-foreground">
          Track your reading journey with detailed insights and analytics.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Books This Year"
          value={summaryStats.completedThisYear}
          icon={Calendar}
          delay={0}
        />
        <StatCard
          title="Total Pages"
          value={summaryStats.totalPagesRead.toLocaleString()}
          icon={BookOpen}
          delay={0.1}
        />
        <StatCard
          title="Avg Pages/Book"
          value={summaryStats.avgPagesPerBook}
          icon={Target}
          delay={0.2}
        />
        <StatCard
          title="Currently Reading"
          value={summaryStats.currentlyReading}
          icon={Clock}
          delay={0.3}
        />
        <StatCard
          title="Reading Streak"
          value={`${summaryStats.readingStreak}d`}
          icon={Flame}
          delay={0.4}
        />
        <StatCard
          title="Total Library"
          value={summaryStats.totalBooks}
          icon={TrendingUp}
          delay={0.5}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Reading Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Books Completed (Last 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                      labelFormatter={(label, payload) => payload[0]?.payload?.fullMonth || label}
                    />
                    <Bar 
                      dataKey="books" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                      name="Books"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Genre Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Most Read Genres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center">
                {genreStats.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={false}
                      >
                        {genreStats.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={GENRE_COLORS[index % GENRE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full text-center text-muted-foreground">
                    Add books with genres to see distribution
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reading Pace */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Reading Pace (Pages/Day - Last 12 Weeks)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={readingPaceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))',
                      }}
                      formatter={(value) => [`${value} pages/day`, 'Pace']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pages" 
                      stroke="hsl(var(--bookhive-forest))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--bookhive-forest))', strokeWidth: 2 }}
                      activeDot={{ r: 6, fill: 'hsl(var(--bookhive-amber))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  delay?: number;
}

function StatCard({ title, value, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className="border-border/50 shadow-card hover:shadow-elevated transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{title}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
