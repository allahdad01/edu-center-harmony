
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Student } from '@/types';
import { AlertCircle, Clock, FileText, GraduationCap, Mail, MapPin, Phone, UserCog } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface StudentHeaderProps {
  student: Student;
  onEdit?: () => void;
}

export function StudentHeader({ student, onEdit }: StudentHeaderProps) {
  const handleEditProfile = () => {
    if (onEdit) {
      onEdit();
      return;
    }
    
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
  );
}
