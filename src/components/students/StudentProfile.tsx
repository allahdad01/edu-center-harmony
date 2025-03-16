
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCog, 
  GraduationCap, 
  BookOpenCheck, 
  Calendar,
  FileText,
  Mail,
  Phone,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Student } from '@/types';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface StudentProfileProps {
  student: Student;
}

export function StudentProfile({ student }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState('books');
  const navigate = useNavigate();

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Opening student profile editor...",
    });
    // In a real app, this would navigate to an edit page or open a modal
  };

  const handleGenerateIdCard = () => {
    toast({
      title: "Generating ID Card",
      description: "Student ID card is being generated. It will be ready to download shortly.",
    });
    // In a real app, this would trigger an API call to generate a PDF
  };

  const handleViewResultSheet = () => {
    toast({
      title: "Result Sheet",
      description: "Loading student result sheet...",
    });
    // In a real app, this would navigate to the results page
  };

  const handleViewInvoices = () => {
    toast({
      title: "Invoices",
      description: "Loading student invoices...",
    });
    // In a real app, this would navigate to the invoices page
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            <div className="rounded-full bg-primary/10 p-2">
              <UserCog className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-muted-foreground">Student ID: {student.id}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {student.isActive ? (
                  <Badge className="bg-green-500 text-white">Active</Badge>
                ) : (
                  <Badge variant="outline" className="border-red-500 text-red-500">
                    Inactive
                  </Badge>
                )}
                
                {student.enrolledBooks.length > 0 && (
                  <Badge variant="outline" className="border-primary text-primary">
                    {student.enrolledBooks.length} Enrolled Books
                  </Badge>
                )}
                
                {student.waitlistedBooks.length > 0 && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                    {student.waitlistedBooks.length} Waitlisted
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{student.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{student.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{student.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Registered on {format(student.createdAt, 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span>Father's Name: {student.fatherName}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 md:w-1/3">
          <Button className="w-full justify-start gap-2" onClick={handleEditProfile}>
            <UserCog className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleGenerateIdCard}>
            <FileText className="h-4 w-4" />
            Generate ID Card
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleViewResultSheet}>
            <GraduationCap className="h-4 w-4" />
            View Result Sheet
          </Button>
          <Button variant="outline" className="w-full justify-start gap-2" onClick={handleViewInvoices}>
            <FileText className="h-4 w-4" />
            View Invoices
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="books" className="flex-1">
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Books
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex-1">
            <Calendar className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="marks" className="flex-1">
            <GraduationCap className="mr-2 h-4 w-4" />
            Examination
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex-1">
            <FileText className="mr-2 h-4 w-4" />
            Invoices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books" className="space-y-4 pt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Enrolled Books</h3>
            <Button size="sm" variant="outline" onClick={() => toast({
              title: "Change Books",
              description: "Opening book selection interface...",
            })}>
              Change Books
            </Button>
          </div>
          
          {student.enrolledBooks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-2 py-6 text-center">
                  <BookOpenCheck className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No Books Enrolled</p>
                  <p className="text-sm text-muted-foreground">
                    This student is not currently enrolled in any books.
                  </p>
                  <Button size="sm" className="mt-2" onClick={() => toast({
                    title: "Enroll in Book",
                    description: "Opening book enrollment interface...",
                  })}>
                    Enroll in a Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {student.enrolledBooks.map((book) => (
                <Card key={book.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{book.name}</CardTitle>
                        <CardDescription>{book.department}</CardDescription>
                      </div>
                      <Badge className={book.isActive ? "bg-green-500" : "bg-muted"}>
                        {book.isActive ? "Active" : "Completed"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">{format(book.startDate, 'PPP')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Date</p>
                        <p className="font-medium">
                          {book.endDate ? format(book.endDate, 'PPP') : 'Ongoing'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fee</p>
                        <p className="font-medium">${book.fee}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Periods</p>
                        <p className="font-medium">{book.periods}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => toast({
                      title: "Book Details",
                      description: `Viewing details for ${book.name}`,
                    })}>View Details</Button>
                    <Button variant="outline" size="sm" onClick={() => toast({
                      title: "Change Book",
                      description: `Changing book ${book.name}`,
                    })}>Change Book</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {student.waitlistedBooks.length > 0 && (
            <>
              <h3 className="mt-6 text-lg font-medium">Waitlisted Books</h3>
              <div className="space-y-4">
                {student.waitlistedBooks.map((book) => (
                  <Card key={book.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{book.name}</CardTitle>
                          <CardDescription>{book.department}</CardDescription>
                        </div>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                          Waitlisted
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Expected Start</p>
                          <p className="font-medium">{format(book.startDate, 'PPP')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Fee</p>
                          <p className="font-medium">${book.fee}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => toast({
                        title: "Book Details",
                        description: `Viewing waitlisted book details for ${book.name}`,
                      })}>View Details</Button>
                      <Button variant="outline" size="sm" onClick={() => toast({
                        title: "Remove from Waitlist",
                        description: `Removing ${book.name} from waitlist`,
                      })}>Remove from Waitlist</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="attendance" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                View attendance history for all enrolled books
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.attendance.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-6 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No Attendance Records</p>
                  <p className="text-sm text-muted-foreground">
                    There are no attendance records available for this student.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recorded By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would be populated with actual attendance data */}
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No attendance records found.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="marks" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Examination Results</CardTitle>
              <CardDescription>
                View marks and performance in various examinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {student.marks.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-6 text-center">
                  <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No Examination Records</p>
                  <p className="text-sm text-muted-foreground">
                    There are no examination records available for this student.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Exam Type</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would be populated with actual marks data */}
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No examination records found.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Invoices & Payments</CardTitle>
                <CardDescription>
                  View all invoice and payment history
                </CardDescription>
              </div>
              <Button size="sm" onClick={() => toast({
                title: "Generate Invoice",
                description: "Opening invoice generator...",
              })}>Generate Invoice</Button>
            </CardHeader>
            <CardContent>
              {student.invoices && student.invoices.length === 0 ? (
                <div className="flex flex-col items-center justify-center space-y-2 py-6 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-lg font-medium">No Invoice Records</p>
                  <p className="text-sm text-muted-foreground">
                    There are no invoice records available for this student.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* This would be populated with actual invoice data */}
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No invoice records found.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
