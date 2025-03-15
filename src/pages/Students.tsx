
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  UserPlus, 
  Download, 
  Filter, 
  GraduationCap, 
  Users,
  BookOpenCheck,
  FileText,
  UserCog,
  X
} from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student } from '@/types';
import { StudentForm } from '@/components/students/StudentForm';
import { StudentProfile } from '@/components/students/StudentProfile';
import { StudentFilters } from '@/components/students/StudentFilters';
import GlassPanel from '@/components/ui-custom/GlassPanel';

// Mock data fetching function - would be replaced with actual API call
const fetchStudents = async () => {
  // This would be an API call in a real application
  return [
    {
      id: 's1',
      name: 'Ahmad Rahimi',
      email: 'ahmad.rahimi@example.com',
      role: 'student',
      fatherName: 'Mohammad Rahimi',
      contactNumber: '+93 700 123 456',
      address: 'Kabul, Afghanistan',
      isActive: true,
      createdAt: new Date('2023-01-15'),
      enrolledBooks: [
        { id: 'b1', name: 'English Grammar Level 3', department: 'English', startDate: new Date('2023-02-10'), endDate: new Date('2023-05-10'), fee: 1500, periods: 1, isActive: true, teacherIds: ['t1'], students: [] }
      ],
      waitlistedBooks: [],
      attendance: [],
      marks: []
    },
    {
      id: 's2',
      name: 'Fatima Ahmadi',
      email: 'fatima.ahmadi@example.com',
      role: 'student',
      fatherName: 'Ali Ahmadi',
      contactNumber: '+93 700 987 654',
      address: 'Herat, Afghanistan',
      isActive: true,
      createdAt: new Date('2023-01-20'),
      enrolledBooks: [
        { id: 'b2', name: 'Mathematics Foundation', department: 'Mathematics', startDate: new Date('2023-02-15'), endDate: new Date('2023-05-15'), fee: 1800, periods: 2, isActive: true, teacherIds: ['t2', 't3'], students: [] }
      ],
      waitlistedBooks: [],
      attendance: [],
      marks: []
    },
    {
      id: 's3',
      name: 'Omar Karimi',
      email: 'omar.karimi@example.com',
      role: 'student',
      fatherName: 'Karim Omar',
      contactNumber: '+93 700 456 789',
      address: 'Mazar-i-Sharif, Afghanistan',
      isActive: false,
      createdAt: new Date('2023-01-25'),
      enrolledBooks: [],
      waitlistedBooks: [
        { id: 'b3', name: 'Advanced English Writing', department: 'English', startDate: new Date('2023-06-01'), endDate: undefined, fee: 2000, periods: 1, isActive: false, teacherIds: ['t1'], students: [] }
      ],
      attendance: [],
      marks: []
    }
  ] as Student[];
};

export default function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
  });

  // Filter students based on search term and active tab
  const filteredStudents = students.filter((student) => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.contactNumber.includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && student.isActive;
    if (activeTab === 'inactive') return matchesSearch && !student.isActive;
    if (activeTab === 'waitlisted') return matchesSearch && student.waitlistedBooks.length > 0;
    
    return matchesSearch;
  });

  // Pagination logic
  const studentsPerPage = 10;
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  };

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-6 p-6 md:p-8">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Students</h1>
            <p className="text-muted-foreground">
              Manage student records, view performance, and track progress.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <StudentForm 
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
                  Export All Students (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Active Students (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Student Cards (PDF)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex w-full max-w-lg items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
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
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All Students</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs sm:text-sm">Active</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-xs sm:text-sm">Inactive</TabsTrigger>
                  <TabsTrigger value="waitlisted" className="text-xs sm:text-sm">Waitlisted</TabsTrigger>
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
              <StudentFilters />
            </GlassPanel>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Father's Name</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Books</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      Loading students...
                    </TableCell>
                  </TableRow>
                ) : paginatedStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      No students found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.contactNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.enrolledBooks.length > 0 ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {student.enrolledBooks.length} Books
                          </Badge>
                        ) : student.waitlistedBooks.length > 0 ? (
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                            Waitlisted
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            No Books
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.isActive ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <UserCog className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewProfile(student)}>
                              <Users className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpenCheck className="mr-2 h-4 w-4" />
                              View Books
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <GraduationCap className="mr-2 h-4 w-4" />
                              View Marks
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Invoices
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              Edit Student
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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

        {/* Student Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Student Profile</DialogTitle>
            </DialogHeader>
            {selectedStudent && <StudentProfile student={selectedStudent} />}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
