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
import { BookService } from '@/services/book';
import { useToast } from '@/hooks/use-toast';

export default function Books() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const { data: books = [], isLoading, refetch } = useQuery({
    queryKey: ['books'],
    queryFn: BookService.getAllBooks,
    meta: {
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Error loading books",
          description: error.message || "Could not load books. Please try again.",
        });
      }
    }
  });

  // Filter books based on search term and active tab
  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(book.department).toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const handleViewDetails = async (book: Book) => {
    try {
      // Get full book details
      const fullBookDetails = await BookService.getBookById(book.id);
      setSelectedBook(fullBookDetails);
      setIsDetailsOpen(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading book details",
        description: error.message || "Could not load book details. Please try again.",
      });
    }
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
                onSuccess={() => refetch()}
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
