
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
  BookOpenCheck,
  Calendar,
  Clock,
  DollarSign,
  GraduationCap,
  UserCog,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BookDetailsProps {
  book: Book;
}

export default function BookDetails({ book }: BookDetailsProps) {
  // Calculate progress
  const getProgress = (): number => {
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

  const progress = getProgress();
  const daysRemaining = book.endDate 
    ? Math.max(0, Math.ceil((new Date(book.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-primary" />
            {book.name}
            {book.isActive ? (
              <Badge className="ml-2 bg-green-500/10 text-green-500">
                Active
              </Badge>
            ) : (
              <Badge variant="outline" className="ml-2">
                Inactive
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">{book.department} Department</p>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <Button variant="outline" size="sm">Edit Book</Button>
          <Button size="sm">Manage Students</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Start Date:</span>
              <span className="font-medium">{format(new Date(book.startDate), 'MMMM d, yyyy')}</span>
            </div>
            {book.endDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date:</span>
                <span className="font-medium">{format(new Date(book.endDate), 'MMMM d, yyyy')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Periods:</span>
              <span className="font-medium">{book.periods}</span>
            </div>
            
            {book.isActive && book.endDate && (
              <div className="pt-2">
                <div className="mb-1 flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  {daysRemaining} days remaining
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Students:</span>
              <span className="font-medium">{book.students.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium">30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Waitlisted:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                View Students
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Financial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fee:</span>
              <span className="font-medium">{book.fee.toLocaleString()} AFN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-medium">{(book.fee * book.students.length).toLocaleString()} AFN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid Students:</span>
              <span className="font-medium">{Math.floor(book.students.length * 0.7)}</span>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Financial Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <Tabs defaultValue="teachers">
        <TabsList>
          <TabsTrigger value="teachers">Assigned Teachers</TabsTrigger>
          <TabsTrigger value="students">Student List</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers" className="mt-4">
          {book.teacherIds.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <UserCog className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No Teachers Assigned</h3>
                <p className="text-muted-foreground mb-4">
                  This book doesn't have any teachers assigned yet.
                </p>
                <Button>Assign Teachers</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{book.teacherIds.length} Teachers Assigned</h3>
                <Button variant="outline" size="sm">Manage Teachers</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.teacherIds.map((teacherId, index) => (
                  <Card key={teacherId}>
                    <CardContent className="py-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {index === 0 ? "Abdul Khaliq" : "Mohammad Nazir"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {index === 0 ? "Period 1" : "Period 2"}
                        </div>
                      </div>
                      <Badge variant="outline">
                        ID: {teacherId}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="students" className="mt-4">
          {book.students.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No Students Enrolled</h3>
                <p className="text-muted-foreground mb-4">
                  This book doesn't have any students enrolled yet.
                </p>
                <Button>Enroll Students</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead className="hidden md:table-cell">Contact</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {book.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.id}</TableCell>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell className="hidden md:table-cell">{student.contactNumber}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {student.isActive ? (
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Weekly Schedule</h3>
                <Button variant="outline" size="sm">Edit Schedule</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {book.periods === 1 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">8:00 AM - 9:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4 text-muted-foreground" />
                      <span>Abdul Khaliq</span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"].map(day => (
                        <Badge key={day} variant="outline" className="bg-primary/10 text-primary">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Period 1</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">8:00 AM - 9:00 AM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                          <span>Abdul Khaliq</span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {["Saturday", "Monday", "Wednesday"].map(day => (
                            <Badge key={day} variant="outline" className="bg-primary/10 text-primary">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Period 2</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">9:00 AM - 10:00 AM</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <UserCog className="h-4 w-4 text-muted-foreground" />
                          <span>Mohammad Nazir</span>
                        </div>
                        <div className="flex gap-1 flex-wrap">
                          {["Sunday", "Tuesday", "Thursday"].map(day => (
                            <Badge key={day} variant="outline" className="bg-primary/10 text-primary">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exams" className="mt-4">
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Exam Schedule</h3>
                <Button variant="outline" size="sm">Add Exam</Button>
              </div>
              
              <div className="space-y-4">
                {book.isActive ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-blue-500" />
                          Quiz A
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{format(new Date(book.startDate.getTime() + 15 * 24 * 60 * 60 * 1000), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-purple-500" />
                          Oral Exam
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{format(new Date(book.endDate || new Date()), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-green-500" />
                          Final Exam
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{format(new Date(book.endDate || new Date()), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Status:</span>
                          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                            Upcoming
                          </Badge>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" className="w-full">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No exams scheduled yet. This book is currently inactive.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
