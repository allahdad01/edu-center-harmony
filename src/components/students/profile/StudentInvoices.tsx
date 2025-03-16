
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Student } from '@/types';
import { FileText } from 'lucide-react';

interface StudentInvoicesProps {
  student: Student;
}

export function StudentInvoices({ student }: StudentInvoicesProps) {
  return (
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
  );
}
