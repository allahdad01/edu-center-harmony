
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '@/types';
import { Calendar } from 'lucide-react';

interface StudentAttendanceProps {
  student: Student;
}

export function StudentAttendance({ student }: StudentAttendanceProps) {
  return (
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
  );
}
