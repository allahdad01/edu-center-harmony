import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageTransition from '@/components/layout/PageTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book } from '@/types';
import BookDetails from '@/components/books/BookDetails';
import { BookStatistics } from '@/components/books/BookStatistics';
import { BookSearchControls } from '@/components/books/BookSearchControls';
import { BooksList } from '@/components/books/BooksList';
import { BookPagination } from '@/components/books/BookPagination';
import { AddBookDialog } from '@/components/books/AddBookDialog';
import { ExportBooksMenu } from '@/components/books/ExportBooksMenu';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <ScrollArea className="h-screen">
        <div className="container max-w-screen-2xl space-y-6 p-6 md:p-8">
          <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Books</h1>
              <p className="text-muted-foreground">
                Manage books, assign teachers, and monitor student enrollment.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <AddBookDialog 
                isOpen={isAddDialogOpen} 
                setIsOpen={setIsAddDialogOpen}
              />
              <ExportBooksMenu />
            </div>
          </div>

          {/* Statistics Cards */}
          <BookStatistics 
            totalBooks={totalBooks}
            activeBooks={activeBooks}
            totalStudents={totalStudents}
            booksWithoutTeacher={booksWithoutTeacher}
          />

          <div className="flex flex-col space-y-4">
            <BookSearchControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />

            <BooksList
              books={paginatedBooks}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />

            <BookPagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
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
      </ScrollArea>
    </PageTransition>
  );
}
