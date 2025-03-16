
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  StudentHeader, 
  StudentBooks, 
  StudentAttendance, 
  StudentExamination, 
  StudentInvoices 
} from '@/components/students/profile';

interface StudentProfileProps {
  student: Student;
  onEdit?: () => void;
}

export function StudentProfile({ student, onEdit }: StudentProfileProps) {
  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="container max-w-screen-xl p-6 space-y-6">
        <StudentHeader student={student} onEdit={onEdit} />
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="w-full sm:w-auto flex flex-wrap">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="examination">Examination</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-6">
            <StudentBooks student={student} />
          </TabsContent>
          
          <TabsContent value="attendance" className="mt-6">
            <StudentAttendance student={student} />
          </TabsContent>
          
          <TabsContent value="examination" className="mt-6">
            <StudentExamination student={student} />
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-6">
            <StudentInvoices student={student} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
