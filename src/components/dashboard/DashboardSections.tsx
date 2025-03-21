import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Building, BarChart4, Layers } from 'lucide-react';

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
      return (
        <>
          <RevenueOverview />
          <StudentEnrollment />
          <PerformanceOverview />
        </>
      );
    case 'superadmin':
      return (
        <>
          <SuperAdminOverview />
          <BranchPerformance />
          <AdminManagement />
        </>
      );
    default:
      return null;
  }
}

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

export const SuperAdminOverview = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between">
        <span>System Overview</span>
        <Button variant="outline" size="sm" asChild>
          <Link to="/reports">View Reports</Link>
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Total Students</p>
          </div>
          <div className="text-sm font-medium">1,245</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Active Teachers</p>
          </div>
          <div className="text-sm font-medium">64</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Monthly Revenue</p>
          </div>
          <div className="text-sm font-medium">$168,720</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Growth Rate</p>
          </div>
          <div className="text-sm font-medium text-green-500">+15.3%</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const BranchPerformance = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between">
        <span>Branch Performance</span>
        <Button variant="outline" size="sm" asChild>
          <Link to="/branches">Manage</Link>
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Main Branch</p>
            <p className="text-sm text-muted-foreground">Downtown</p>
          </div>
          <div className="text-sm font-medium text-green-500">$78,450</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">North Campus</p>
            <p className="text-sm text-muted-foreground">Uptown</p>
          </div>
          <div className="text-sm font-medium text-green-500">$45,210</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">East Wing</p>
            <p className="text-sm text-muted-foreground">Riverside</p>
          </div>
          <div className="text-sm font-medium text-amber-500">$32,180</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">South Center</p>
            <p className="text-sm text-muted-foreground">Marina</p>
          </div>
          <div className="text-sm font-medium text-red-500">$12,880</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const AdminManagement = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex justify-between">
        <span>Administrators</span>
        <Button variant="outline" size="sm" asChild>
          <Link to="/users">Manage</Link>
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Total Admins</p>
          </div>
          <div className="text-sm font-medium">12</div>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-medium">Recently Added</p>
          </div>
          <div className="text-sm font-medium">2 this month</div>
        </div>
        <div className="mt-4">
          <Button size="sm" className="w-full" asChild>
            <Link to="/users/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Administrator
            </Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
