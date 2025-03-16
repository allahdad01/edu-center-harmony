
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Student } from '@/types';
import { GraduationCap } from 'lucide-react';

interface StudentExaminationProps {
  student: Student;
}

export function StudentExamination({ student }: StudentExaminationProps) {
  return (
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
  );
}
