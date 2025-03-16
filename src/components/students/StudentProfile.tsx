
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenCheck, Calendar, FileText, GraduationCap } from 'lucide-react';
import { Student } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  StudentHeader,
  StudentBooks,
  StudentAttendance,
  StudentExamination,
  StudentInvoices
} from './profile';

interface StudentProfileProps {
  student: Student;
}

export function StudentProfile({ student }: StudentProfileProps) {
  const [activeTab, setActiveTab] = useState('books');
  const navigate = useNavigate();

  return (
    <ScrollArea className="h-screen">
      <div className="space-y-6">
        <StudentHeader student={student} />

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
            <StudentBooks student={student} />
          </TabsContent>
          
          <TabsContent value="attendance" className="pt-4">
            <StudentAttendance student={student} />
          </TabsContent>
          
          <TabsContent value="marks" className="pt-4">
            <StudentExamination student={student} />
          </TabsContent>
          
          <TabsContent value="invoices" className="pt-4">
            <StudentInvoices student={student} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
