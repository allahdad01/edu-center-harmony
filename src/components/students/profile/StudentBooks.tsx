
import { Book, Student } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { BookOpenCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface StudentBooksProps {
  student: Student;
}

export function StudentBooks({ student }: StudentBooksProps) {
  return (
    <div className="space-y-4">
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
        <EmptyBooksState />
      ) : (
        <div className="space-y-4">
          {student.enrolledBooks.map((book) => (
            <BookCard key={book.id} book={book} isWaitlisted={false} />
          ))}
        </div>
      )}
      
      {student.waitlistedBooks.length > 0 && (
        <>
          <h3 className="mt-6 text-lg font-medium">Waitlisted Books</h3>
          <div className="space-y-4">
            {student.waitlistedBooks.map((book) => (
              <BookCard key={book.id} book={book} isWaitlisted={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyBooksState() {
  return (
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
  );
}

interface BookCardProps {
  book: Book;
  isWaitlisted: boolean;
}

function BookCard({ book, isWaitlisted }: BookCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{book.name}</CardTitle>
            <CardDescription>{book.department}</CardDescription>
          </div>
          {isWaitlisted ? (
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              Waitlisted
            </Badge>
          ) : (
            <Badge className={book.isActive ? "bg-green-500" : "bg-muted"}>
              {book.isActive ? "Active" : "Completed"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">{isWaitlisted ? "Expected Start" : "Start Date"}</p>
            <p className="font-medium">{format(book.startDate, 'PPP')}</p>
          </div>
          {!isWaitlisted && (
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p className="font-medium">
                {book.endDate ? format(book.endDate, 'PPP') : 'Ongoing'}
              </p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Fee</p>
            <p className="font-medium">${book.fee}</p>
          </div>
          {!isWaitlisted && (
            <div>
              <p className="text-muted-foreground">Periods</p>
              <p className="font-medium">{book.periods}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => toast({
          title: "Book Details",
          description: `Viewing ${isWaitlisted ? "waitlisted " : ""}details for ${book.name}`,
        })}>View Details</Button>
        <Button variant="outline" size="sm" onClick={() => toast({
          title: isWaitlisted ? "Remove from Waitlist" : "Change Book",
          description: isWaitlisted ? `Removing ${book.name} from waitlist` : `Changing book ${book.name}`,
        })}>
          {isWaitlisted ? "Remove from Waitlist" : "Change Book"}
        </Button>
      </CardFooter>
    </Card>
  );
}
