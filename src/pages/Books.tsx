
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  PlusCircle, 
  Download, 
  Filter, 
  BookOpenCheck, 
  Users,
  CalendarDays,
  ClipboardList,
  MoreHorizontal,
  X,
  BarChart
} from 'lucide-react';
import { format } from 'date-fns';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import GlassPanel from '@/components/ui-custom/GlassPanel';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Book } from '@/types';
import BookDetails from '@/components/books/BookDetails';
import BookForm from '@/components/books/BookForm';
import BookFilters from '@/components/books/BookFilters';

// Mock data fetching function
const fetchBooks = async (): Promise<Book[]> => {
  return [
    { 
      id: 'b1', 
      name: 'English Grammar Level 3', 
      department: 'English', 
      startDate: new Date('2023-02-10'), 
      endDate: new Date('2023-05-10'), 
      fee: 1500, 
      periods: 1, 
      isActive: true, 
      teacherIds: ['t1'],
      students: [
        { id: 's1', name: 'Ahmad Rahimi', email: 'ahmad.rahimi@example.com', role: 'student', fatherName: 'Mohammad Rahimi', contactNumber: '+93 700 123 456', address: 'Kabul, Afghanistan', isActive: true, createdAt: new Date('2023-01-15'), enrolledBooks: [], waitlistedBooks: [], attendance: [], marks: [], invoices: [] },
        { id: 's5', name: 'Najiba Karimi', email: 'najiba.karimi@example.com', role: 'student', fatherName: 'Abdul Karim', contactNumber: '+93 700 555 666', address: 'Kabul, Afghanistan', isActive: true, createdAt: new Date('2023-01-18'), enrolledBooks: [], waitlistedBooks: [], attendance: [], marks: [], invoices: [] },
      ]
    },
    { 
      id: 'b2', 
      name: 'Mathematics Foundation', 
      department: 'Mathematics', 
      startDate: new Date('2023-02-15'), 
      endDate: new Date('2023-05-15'), 
      fee: 1800, 
      periods: 2, 
      isActive: true, 
      teacherIds: ['t2', 't3'],
      students: [
        { id: 's2', name: 'Fatima Ahmadi', email: 'fatima.ahmadi@example.com', role: 'student', fatherName: 'Ali Ahmadi', contactNumber: '+93 700 987 654', address: 'Herat, Afghanistan', isActive: true, createdAt: new Date('2023-01-20'), enrolledBooks: [], waitlistedBooks: [], attendance: [], marks: [], invoices: [] },
        { id: 's4', name: 'Maryam Hashimi', email: 'maryam.hashimi@example.com', role: 'student', fatherName: 'Mahmood Hashimi', contactNumber: '+93 700 444 555', address: 'Jalalabad, Afghanistan', isActive: true, createdAt: new Date('2023-01-19'), enrolledBooks: [], waitlistedBooks: [], attendance: [], marks: [], invoices: [] }
      ]
    },
    { 
      id: 'b3', 
      name: 'Advanced English Writing', 
      department: 'English', 
      startDate: new Date('2023-06-01'), 
      endDate: undefined, 
      fee: 2000, 
      periods: 1, 
      isActive: false, 
      teacherIds: ['t1'],
      students: []
    },
    { 
      id: 'b4', 
      name: 'Physics Basics', 
      department: 'Science', 
      startDate: new Date('2023-03-01'), 
      endDate: new Date('2023-06-01'), 
      fee: 2000, 
      periods: 1, 
      isActive: true, 
      teacherIds: ['t3'],
      students: [
        { id: 's6', name: 'Sayed Ali', email: 'sayed.ali@example.com', role: 'student', fatherName: 'Sayed Mohammad', contactNumber: '+93 700 666 777', address: 'Kabul, Afghanistan', isActive: true, createdAt: new Date('2023-01-21'), enrolledBooks: [], waitlistedBooks: [], attendance: [], marks: [], invoices: [] }
      ]
    },
    { 
      id: 'b5', 
      name: 'Chemistry Basics', 
      department: 'Science', 
      startDate: new Date('2023-04-01'), 
      endDate: new Date('2023-07-01'), 
      fee: 2200, 
      periods: 1, 
      isActive: true, 
      teacherIds: [],
      students: []
    }
  ];
};

// Helper to calculate days remaining or completion percentage
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

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: books = [], isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: fetchBooks,
  });

  // Filter books based on search term and active tab
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && book.isActive;
    if (activeTab === 'inactive') return matchesSearch && !book.isActive;
    if (activeTab === 'noTeacher') return matchesSearch && book.teacherIds.length === 0;
    
    return matchesSearch;
  });

  // Statistics
  const totalBooks = books.length;
  const activeBooks = books.filter(book => book.isActive).length;
  const totalStudents = books.reduce((acc, book) => acc + book.students.length, 0);
  const booksWithoutTeacher = books.filter(book => book.teacherIds.length === 0).length;

  // Pagination logic
  const booksPerPage = 10;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * booksPerPage,
    currentPage * booksPerPage
  );

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-6 p-6 md:p-8">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Books</h1>
            <p className="text-muted-foreground">
              Manage books, assign teachers, and monitor student enrollment.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Add Book
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Book</DialogTitle>
                </DialogHeader>
                <BookForm 
                  onSuccess={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Export All Books (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Active Books (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Student Enrollments (PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Statistics Cards */}
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

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex w-full max-w-lg items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search books..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-muted' : ''}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex">
              <Tabs 
                defaultValue="all" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList>
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All Books</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs sm:text-sm">Active</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-xs sm:text-sm">Inactive</TabsTrigger>
                  <TabsTrigger value="noTeacher" className="text-xs sm:text-sm">No Teacher</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {showFilters && (
            <GlassPanel className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <BookFilters />
            </GlassPanel>
          )}

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
                ) : paginatedBooks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No books found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBooks.map((book) => {
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
                              <DropdownMenuItem onClick={() => handleViewDetails(book)}>
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

          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Book Details Dialog */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Book Details</DialogTitle>
            </DialogHeader>
            {selectedBook && <BookDetails book={selectedBook} />}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
