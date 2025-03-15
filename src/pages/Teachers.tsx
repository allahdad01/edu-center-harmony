
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  UserPlus, 
  Download, 
  Filter, 
  BookOpenCheck, 
  GraduationCap, 
  UserCog,
  Wallet,
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
import { Skeleton } from '@/components/ui/skeleton';
import GlassPanel from '@/components/ui-custom/GlassPanel';
import { Teacher, SalaryType } from '@/types';
import TeacherProfile from '@/components/teachers/TeacherProfile';
import TeacherForm from '@/components/teachers/TeacherForm';
import TeacherFilters from '@/components/teachers/TeacherFilters';

// Mock data fetching function - would be replaced with actual API call
const fetchTeachers = async (): Promise<Teacher[]> => {
  // This would be an API call in a real application
  return [
    {
      id: 't1',
      name: 'Abdul Khaliq',
      email: 'abdul.khaliq@example.com',
      role: 'teacher',
      contactNumber: '+93 700 123 456',
      address: 'Kabul, Afghanistan',
      isActive: true,
      specialization: 'English Language',
      dateOfJoining: new Date('2022-08-15'),
      salaryType: 'fixed',
      salaryAmount: 15000,
      assignedBooks: [
        { id: 'b1', name: 'English Grammar Level 3', department: 'English', startDate: new Date('2023-02-10'), endDate: new Date('2023-05-10'), fee: 1500, periods: 1, isActive: true, teacherIds: ['t1'], students: [] }
      ],
      attendance: []
    },
    {
      id: 't2',
      name: 'Farida Noori',
      email: 'farida.noori@example.com',
      role: 'teacher',
      contactNumber: '+93 700 234 567',
      address: 'Herat, Afghanistan',
      isActive: true,
      specialization: 'Mathematics',
      dateOfJoining: new Date('2022-03-10'),
      salaryType: 'percentage',
      salaryAmount: 40, // 40% of student fees
      assignedBooks: [
        { id: 'b2', name: 'Mathematics Foundation', department: 'Mathematics', startDate: new Date('2023-02-15'), endDate: new Date('2023-05-15'), fee: 1800, periods: 2, isActive: true, teacherIds: ['t2', 't3'], students: [] }
      ],
      attendance: []
    },
    {
      id: 't3',
      name: 'Mohammad Nazir',
      email: 'mohammad.nazir@example.com',
      role: 'teacher',
      contactNumber: '+93 700 345 678',
      address: 'Mazar-i-Sharif, Afghanistan',
      isActive: true,
      specialization: 'Physics',
      dateOfJoining: new Date('2022-05-20'),
      salaryType: 'perBook',
      salaryAmount: 5000, // 5000 per book
      assignedBooks: [
        { id: 'b2', name: 'Mathematics Foundation', department: 'Mathematics', startDate: new Date('2023-02-15'), endDate: new Date('2023-05-15'), fee: 1800, periods: 2, isActive: true, teacherIds: ['t2', 't3'], students: [] },
        { id: 'b4', name: 'Physics Basics', department: 'Science', startDate: new Date('2023-03-01'), endDate: new Date('2023-06-01'), fee: 2000, periods: 1, isActive: true, teacherIds: ['t3'], students: [] }
      ],
      attendance: []
    },
    {
      id: 't4',
      name: 'Zahra Ahmadi',
      email: 'zahra.ahmadi@example.com',
      role: 'teacher',
      contactNumber: '+93 700 456 789',
      address: 'Kabul, Afghanistan',
      isActive: false,
      specialization: 'Chemistry',
      dateOfJoining: new Date('2022-01-15'),
      salaryType: 'fixed',
      salaryAmount: 18000,
      assignedBooks: [],
      attendance: []
    }
  ];
};

const getSalaryTypeLabel = (type: SalaryType): string => {
  switch (type) {
    case 'fixed':
      return 'Fixed';
    case 'perBook':
      return 'Per Book';
    case 'percentage':
      return 'Percentage';
    default:
      return 'Unknown';
  }
};

export default function Teachers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
  });

  // Filter teachers based on search term and active tab
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = 
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.contactNumber.includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && teacher.isActive;
    if (activeTab === 'inactive') return matchesSearch && !teacher.isActive;
    
    return matchesSearch;
  });

  // Pagination logic
  const teachersPerPage = 10;
  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * teachersPerPage,
    currentPage * teachersPerPage
  );

  const handleViewProfile = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsProfileOpen(true);
  };

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-6 p-6 md:p-8">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
            <p className="text-muted-foreground">
              Manage teachers, view assigned books, and track performance.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1">
                  <UserPlus className="h-4 w-4" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                </DialogHeader>
                <TeacherForm 
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
                  Export All Teachers (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Active Teachers (CSV)
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export Salary Details (PDF)
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
                  placeholder="Search teachers..."
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
                  <TabsTrigger value="all" className="text-xs sm:text-sm">All Teachers</TabsTrigger>
                  <TabsTrigger value="active" className="text-xs sm:text-sm">Active</TabsTrigger>
                  <TabsTrigger value="inactive" className="text-xs sm:text-sm">Inactive</TabsTrigger>
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
              <TeacherFilters />
            </GlassPanel>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead className="hidden md:table-cell">Contact</TableHead>
                  <TableHead className="hidden md:table-cell">Salary Type</TableHead>
                  <TableHead className="hidden md:table-cell">Books</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedTeachers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      No teachers found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTeachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.specialization}</TableCell>
                      <TableCell className="hidden md:table-cell">{teacher.contactNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className={
                          teacher.salaryType === 'fixed' 
                            ? 'bg-blue-500/10 text-blue-500' 
                            : teacher.salaryType === 'perBook'
                              ? 'bg-purple-500/10 text-purple-500'
                              : 'bg-green-500/10 text-green-500'
                        }>
                          {getSalaryTypeLabel(teacher.salaryType)}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {teacher.assignedBooks.length > 0 ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {teacher.assignedBooks.length} Books
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            No Books
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {teacher.isActive ? (
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
                            <DropdownMenuItem onClick={() => handleViewProfile(teacher)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpenCheck className="mr-2 h-4 w-4" />
                              Assigned Books
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <GraduationCap className="mr-2 h-4 w-4" />
                              View Performance
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Wallet className="mr-2 h-4 w-4" />
                              Salary Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              Edit Teacher
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

        {/* Teacher Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Teacher Profile</DialogTitle>
            </DialogHeader>
            {selectedTeacher && <TeacherProfile teacher={selectedTeacher} />}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
