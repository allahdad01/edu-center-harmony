
import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, BookOpenCheck, Users, CalendarDays } from 'lucide-react';
import { Book } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Helper to calculate book progress
const getBookProgress = (book: Book): number => {
  if (!book.isActive || !book.endDate) return 0;
  
  const today = new Date();
  const startDate = new Date(book.startDate);
  const endDate = new Date(book.endDate);
  
  // If book hasn't started yet
  if (startDate > today) return 0;
  
  // If book has ended
  if (endDate < today) return 100;
  
  // Calculate percentage of days passed
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.min(Math.round((daysElapsed / totalDays) * 100), 100);
};

interface BooksListProps {
  books: Book[];
  isLoading: boolean;
  onViewDetails: (book: Book) => void;
}

export function BooksList({ books, isLoading, onViewDetails }: BooksListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead className="hidden md:table-cell">Start Date</TableHead>
            <TableHead className="hidden md:table-cell">Progress</TableHead>
            <TableHead className="hidden md:table-cell">Students</TableHead>
            <TableHead className="hidden md:table-cell">Teachers</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-28" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-32" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-8" /></TableCell>
              </TableRow>
            ))
          ) : books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                No books found. Try adjusting your search or filters.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => {
              const progress = getBookProgress(book);
              return (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.name}</TableCell>
                  <TableCell>{book.department}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(book.startDate), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-2" />
                      <span className="text-xs">{progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {book.students.length}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {book.teacherIds.length > 0 ? (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                        {book.teacherIds.length}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                        None
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(book)}>
                          <BookOpenCheck className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Students
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Manage Schedule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          Edit Book
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
