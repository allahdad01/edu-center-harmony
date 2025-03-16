
import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Edit, Filter, GraduationCap, Layers, MoreHorizontal, Plus, Search, Users, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function Exams() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock exams data
  const exams = [
    { id: 'E001', title: 'English Grammar Final Exam', book: 'English Grammar Level 3', date: new Date('2023-07-20'), status: 'upcoming', totalMarks: 100, passingMarks: 50 },
    { id: 'E002', title: 'Mathematics Mid-Term', book: 'Mathematics Foundation', date: new Date('2023-06-15'), status: 'completed', totalMarks: 100, passingMarks: 50, studentsAppeared: 25, avgMarks: 72 },
    { id: 'E003', title: 'Physics Quiz 1', book: 'Physics Basics', date: new Date('2023-06-10'), status: 'completed', totalMarks: 50, passingMarks: 25, studentsAppeared: 15, avgMarks: 32 },
    { id: 'E004', title: 'Chemistry Mid-Term', book: 'Chemistry Basics', date: new Date('2023-07-05'), status: 'ongoing', totalMarks: 100, passingMarks: 50 },
    { id: 'E005', title: 'Advanced English Writing Review', book: 'Advanced English Writing', date: new Date('2023-08-10'), status: 'upcoming', totalMarks: 100, passingMarks: 60 },
  ];

  // Mock student results data
  const results = [
    { id: 'R001', examId: 'E002', studentId: 's1', studentName: 'Ahmad Rahimi', marks: 85, status: 'passed', grade: 'A' },
    { id: 'R002', examId: 'E002', studentId: 's2', studentName: 'Fatima Ahmadi', marks: 78, status: 'passed', grade: 'B' },
    { id: 'R003', examId: 'E002', studentId: 's4', studentName: 'Maryam Hashimi', marks: 62, status: 'passed', grade: 'C' },
    { id: 'R004', examId: 'E003', studentId: 's1', studentName: 'Ahmad Rahimi', marks: 42, status: 'passed', grade: 'B' },
    { id: 'R005', examId: 'E003', studentId: 's6', studentName: 'Sayed Ali', marks: 22, status: 'failed', grade: 'F' },
  ];

  // Filter exams based on search term
  const filteredExams = exams.filter(
    (exam) => exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
              exam.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
              exam.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-6 p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exams & Marks</h1>
            <p className="text-muted-foreground">
              Create and manage exams, record marks, and generate report cards.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Generate Reports
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
              <GraduationCap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.filter(e => e.status === 'upcoming').length}</div>
              <p className="text-xs text-muted-foreground">Next: {exams.filter(e => e.status === 'upcoming').sort((a, b) => a.date.getTime() - b.date.getTime())[0]?.title}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed Exams</CardTitle>
              <Check className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.filter(e => e.status === 'completed').length}</div>
              <p className="text-xs text-muted-foreground">Total students appeared: {exams.filter(e => e.status === 'completed').reduce((sum, e) => sum + (e.studentsAppeared || 0), 0)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
              <Layers className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(exams.filter(e => e.status === 'completed' && e.avgMarks !== undefined).reduce((sum, e) => sum + (e.avgMarks || 0), 0) / 
                  (exams.filter(e => e.status === 'completed' && e.avgMarks !== undefined).length || 1))}%
              </div>
              <Progress value={72} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-exams" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all-exams">All Exams</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="student-results">Student Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-exams" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search exams..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Exam ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Book</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExams.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No exams found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredExams.map((exam) => (
                          <TableRow key={exam.id}>
                            <TableCell className="font-medium">{exam.id}</TableCell>
                            <TableCell>{exam.title}</TableCell>
                            <TableCell>{exam.book}</TableCell>
                            <TableCell>{format(exam.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              <Badge
                                variant={exam.status === 'completed' ? 'default' : 
                                        exam.status === 'upcoming' ? 'outline' : 'secondary'}
                              >
                                {exam.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{exam.totalMarks}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  {exam.status === 'upcoming' && (
                                    <DropdownMenuItem>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Exam
                                    </DropdownMenuItem>
                                  )}
                                  {exam.status === 'completed' && (
                                    <>
                                      <DropdownMenuItem>
                                        <Users className="mr-2 h-4 w-4" />
                                        View Results
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        Generate Report
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {exam.status === 'ongoing' && (
                                    <DropdownMenuItem>Enter Marks</DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Exams</CardTitle>
                <CardDescription>Plan and prepare for upcoming examinations.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.filter(e => e.status === 'upcoming').map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.id}</TableCell>
                        <TableCell>{exam.title}</TableCell>
                        <TableCell>{exam.book}</TableCell>
                        <TableCell>{format(exam.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ongoing">
            <Card>
              <CardHeader>
                <CardTitle>Ongoing Exams</CardTitle>
                <CardDescription>Manage exams that are currently in progress.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.filter(e => e.status === 'ongoing').map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.id}</TableCell>
                        <TableCell>{exam.title}</TableCell>
                        <TableCell>{exam.book}</TableCell>
                        <TableCell>{format(exam.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
                        <TableCell>
                          <Button size="sm">Enter Marks</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Exams</CardTitle>
                <CardDescription>View results and reports for completed exams.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg. Marks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams.filter(e => e.status === 'completed').map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.id}</TableCell>
                        <TableCell>{exam.title}</TableCell>
                        <TableCell>{exam.book}</TableCell>
                        <TableCell>{format(exam.date, 'MMM d, yyyy')}</TableCell>
                        <TableCell>{exam.studentsAppeared}</TableCell>
                        <TableCell>{exam.avgMarks}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">View Results</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="student-results">
            <Card>
              <CardHeader>
                <CardTitle>Student Results</CardTitle>
                <CardDescription>View and manage individual student exam results.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Result ID</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Exam</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => {
                      const exam = exams.find(e => e.id === result.examId);
                      return (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.id}</TableCell>
                          <TableCell>{result.studentName}</TableCell>
                          <TableCell>{exam?.title}</TableCell>
                          <TableCell>{result.marks}/{exam?.totalMarks}</TableCell>
                          <TableCell>
                            <Badge
                              variant={result.status === 'passed' ? 'default' : 'destructive'}
                            >
                              {result.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.grade}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">View Details</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
