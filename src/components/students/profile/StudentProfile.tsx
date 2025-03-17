
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
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { StudentService } from '@/services/StudentService';
import { useToast } from '@/hooks/use-toast';

interface StudentProfileProps {
  student: Student;
  onEdit?: () => void;
}

export function StudentProfile({ student, onEdit }: StudentProfileProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fullStudentData, setFullStudentData] = useState<Student | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadFullStudentData = async () => {
      setIsLoading(true);
      try {
        const data = await StudentService.getStudentById(student.id);
        setFullStudentData(data);
      } catch (error: any) {
        console.error("Error loading student data:", error);
        toast({
          variant: "destructive",
          title: "Error loading student data",
          description: error.message || "Failed to load complete student information.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFullStudentData();
  }, [student.id, toast]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading student profile...</p>
      </div>
    );
  }

  if (!fullStudentData) {
    return (
      <div className="flex h-[calc(100vh-6rem)] flex-col items-center justify-center space-y-2">
        <p className="text-lg font-medium">Student data not available</p>
        <p className="text-sm text-muted-foreground">
          There was a problem loading the student profile. Please try again.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="container max-w-screen-xl p-6 space-y-6">
        <StudentHeader student={fullStudentData} onEdit={onEdit} />
        
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="w-full sm:w-auto flex flex-wrap">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="examination">Examination</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="mt-6">
            <StudentBooks student={fullStudentData} />
          </TabsContent>
          
          <TabsContent value="attendance" className="mt-6">
            <StudentAttendance student={fullStudentData} />
          </TabsContent>
          
          <TabsContent value="examination" className="mt-6">
            <StudentExamination student={fullStudentData} />
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-6">
            <StudentInvoices student={fullStudentData} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
