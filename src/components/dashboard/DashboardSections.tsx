
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { UserRole } from '@/types';

export function renderRoleSpecificContent(role: UserRole) {
  // Content specific to each role
  switch(role) {
    case 'student':
      return (
        <>
          <UpcomingExams />
          <RecentAttendance />
          <PendingInvoices />
        </>
      );
    case 'teacher':
      return (
        <>
          <ClassesToday />
          <StudentPerformance />
          <UpcomingSchedule />
        </>
      );
    case 'finance':
      return (
        <>
          <RevenueOverview />
          <PendingInvoices />
          <ExpenseBreakdown />
        </>
      );
    case 'controller':
      return (
        <>
          <ExamSchedule />
          <BookPerformance />
          <TeacherAttendance />
        </>
      );
    case 'admin':
    case 'superadmin':
      return (
        <>
          <RevenueOverview />
          <StudentEnrollment />
          <PerformanceOverview />
        </>
      );
    default:
      return null;
  }
}

// Student dashboard sections
export const UpcomingExams = () => (
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Exams</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">English Grammar</p>
            <p className="text-sm text-muted-foreground">Final Exam</p>
          </div>
          <div className="text-sm font-medium">May 15</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Mathematics</p>
            <p className="text-sm text-muted-foreground">Quiz A</p>
          </div>
          <div className="text-sm font-medium">May 20</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const RecentAttendance = () => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Attendance</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">May 10</p>
          </div>
          <div className="text-sm font-medium text-green-500">Present</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">May 9</p>
          </div>
          <div className="text-sm font-medium text-green-500">Present</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">May 8</p>
          </div>
          <div className="text-sm font-medium text-red-500">Absent</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PendingInvoices = () => (
  <Card>
    <CardHeader>
      <CardTitle>Pending Invoices</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">English Course</p>
            <p className="text-sm text-muted-foreground">Invoice #2345</p>
          </div>
          <div className="text-sm font-medium">$150</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Mathematics</p>
            <p className="text-sm text-muted-foreground">Invoice #2346</p>
          </div>
          <div className="text-sm font-medium">$100</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Teacher dashboard sections
export const ClassesToday = () => (
  <Card>
    <CardHeader>
      <CardTitle>Classes Today</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">English Grammar</p>
            <p className="text-sm text-muted-foreground">Room 101</p>
          </div>
          <div className="text-sm font-medium">8:00 AM</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Advanced Writing</p>
            <p className="text-sm text-muted-foreground">Room 205</p>
          </div>
          <div className="text-sm font-medium">10:00 AM</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StudentPerformance = () => (
  <Card>
    <CardHeader>
      <CardTitle>Student Performance</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center text-5xl font-bold text-primary">78%</div>
      <p className="mt-2 text-center text-sm text-muted-foreground">Average class performance</p>
    </CardContent>
  </Card>
);

export const UpcomingSchedule = () => (
  <Card>
    <CardHeader>
      <CardTitle>Upcoming Schedule</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">May 12</p>
            <p className="text-sm text-muted-foreground">Quiz Administration</p>
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">May 15</p>
            <p className="text-sm text-muted-foreground">Staff Meeting</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Finance dashboard sections
export const RevenueOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Revenue Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">This Month</p>
          </div>
          <div className="text-sm font-medium">$12,530</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Last Month</p>
          </div>
          <div className="text-sm font-medium">$11,245</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Growth</p>
          </div>
          <div className="text-sm font-medium text-green-500">+11.4%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ExpenseBreakdown = () => (
  <Card>
    <CardHeader>
      <CardTitle>Expense Breakdown</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Salaries</p>
          </div>
          <div className="text-sm font-medium">$8,250</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Utilities</p>
          </div>
          <div className="text-sm font-medium">$1,450</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Supplies</p>
          </div>
          <div className="text-sm font-medium">$780</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Controller dashboard sections
export const ExamSchedule = () => (
  <Card>
    <CardHeader>
      <CardTitle>Exam Schedule</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">English Grammar</p>
            <p className="text-sm text-muted-foreground">Final Exam</p>
          </div>
          <div className="text-sm font-medium">May 15</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Mathematics</p>
            <p className="text-sm text-muted-foreground">Quiz A</p>
          </div>
          <div className="text-sm font-medium">May 20</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BookPerformance = () => (
  <Card>
    <CardHeader>
      <CardTitle>Book Performance</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">English Grammar</p>
          </div>
          <div className="text-sm font-medium">85%</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Mathematics</p>
          </div>
          <div className="text-sm font-medium">72%</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Science</p>
          </div>
          <div className="text-sm font-medium">78%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const TeacherAttendance = () => (
  <Card>
    <CardHeader>
      <CardTitle>Teacher Attendance</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">John Smith</p>
            <p className="text-sm text-muted-foreground">English</p>
          </div>
          <div className="text-sm font-medium text-green-500">Present</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Sarah Jones</p>
            <p className="text-sm text-muted-foreground">Mathematics</p>
          </div>
          <div className="text-sm font-medium text-green-500">Present</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Michael Brown</p>
            <p className="text-sm text-muted-foreground">Science</p>
          </div>
          <div className="text-sm font-medium text-red-500">Absent</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Admin dashboard sections
export const StudentEnrollment = () => (
  <Card>
    <CardHeader>
      <CardTitle>Student Enrollment</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">English Department</p>
          </div>
          <div className="text-sm font-medium">145 students</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Mathematics</p>
          </div>
          <div className="text-sm font-medium">120 students</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Science</p>
          </div>
          <div className="text-sm font-medium">117 students</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const PerformanceOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle>Performance Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Average Attendance</p>
          </div>
          <div className="text-sm font-medium">87%</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Pass Rate</p>
          </div>
          <div className="text-sm font-medium">92%</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Teacher Rating</p>
          </div>
          <div className="text-sm font-medium">4.7/5</div>
        </div>
      </div>
    </CardContent>
  </Card>
);
