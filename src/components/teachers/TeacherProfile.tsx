
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Teacher, SalaryType } from "@/types";
import { CalendarDays, GraduationCap, Mail, Phone, UserCog, MapPin, BookOpen, Wallet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface TeacherProfileProps {
  teacher: Teacher;
}

export default function TeacherProfile({ teacher }: TeacherProfileProps) {
  const formatSalaryType = (type: SalaryType) => {
    switch (type) {
      case 'fixed':
        return 'Fixed Salary';
      case 'per-book':
        return 'Per Book';
      case 'percentage':
        return 'Percentage of Student Fees';
      default:
        return type;
    }
  };

  const formatSalaryAmount = (amount: number, type: SalaryType) => {
    switch (type) {
      case 'fixed':
        return `${amount.toLocaleString()} AFN/month`;
      case 'per-book':
        return `${amount.toLocaleString()} AFN/book`;
      case 'percentage':
        return `${amount}%`;
      default:
        return amount.toLocaleString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <UserCog className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{teacher.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>Specialization: {teacher.specialization}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Joined: {format(new Date(teacher.dateOfJoining), 'MMMM d, yyyy')}</span>
              </div>
              <div className="pt-2">
                <Badge className={teacher.isActive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10"}>
                  {teacher.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-2/3 space-y-6">
          {/* Salary Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Salary Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Salary Type</div>
                  <div className="font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    {formatSalaryType(teacher.salaryType)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Salary Amount</div>
                  <div className="font-medium">
                    {formatSalaryAmount(teacher.salaryAmount, teacher.salaryType)}
                  </div>
                </div>
              </div>

              <Separator />

              {teacher.salaryType === 'per-book' && (
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Estimated Monthly Salary</div>
                  <div className="font-medium text-lg">
                    {(teacher.salaryAmount * teacher.assignedBooks.length).toLocaleString()} AFN
                  </div>
                  <p className="text-xs text-muted-foreground">Based on {teacher.assignedBooks.length} assigned books</p>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <Button variant="outline" size="sm">View Salary History</Button>
                <Button variant="outline" size="sm">Record Advance</Button>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Books */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Assigned Books</CardTitle>
              <CardDescription>
                {teacher.assignedBooks.length} {teacher.assignedBooks.length === 1 ? 'book' : 'books'} currently assigned
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teacher.assignedBooks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No books currently assigned to this teacher
                </div>
              ) : (
                <div className="space-y-4">
                  {teacher.assignedBooks.map((book) => (
                    <div key={book.id} className="flex items-center justify-between border-b pb-2 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <div>
                          <div className="font-medium">{book.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {book.department} • {book.periods} {book.periods === 1 ? 'period' : 'periods'} • {book.students.length} students
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">
                        {format(new Date(book.startDate), 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Edit Teacher</Button>
        <Button variant="default">View Performance</Button>
      </div>
    </div>
  );
}
