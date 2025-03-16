
import { BookOpenCheck, BarChart, Users, ClipboardList } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';

interface BookStatisticsProps {
  totalBooks: number;
  activeBooks: number;
  totalStudents: number;
  booksWithoutTeacher: number;
}

export function BookStatistics({
  totalBooks,
  activeBooks,
  totalStudents,
  booksWithoutTeacher
}: BookStatisticsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card hoverable>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Books</CardTitle>
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <BookOpenCheck className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBooks}</div>
        </CardContent>
      </Card>

      <Card hoverable>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Books</CardTitle>
          <div className="rounded-md bg-green-500/10 p-2 text-green-500">
            <BarChart className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBooks}</div>
        </CardContent>
      </Card>

      <Card hoverable>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Students</CardTitle>
          <div className="rounded-md bg-blue-500/10 p-2 text-blue-500">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </CardContent>
      </Card>

      <Card hoverable>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Books Without Teacher</CardTitle>
          <div className="rounded-md bg-yellow-500/10 p-2 text-yellow-500">
            <ClipboardList className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{booksWithoutTeacher}</div>
        </CardContent>
      </Card>
    </div>
  );
}
