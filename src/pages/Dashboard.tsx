
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, BookOpenCheck, Calendar, GraduationCap, LayoutDashboard, Users, PieChart, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role as UserRole;
  
  // Role-specific welcome message and stats
  const dashboardConfig = {
    student: {
      welcomeMessage: "Track your academic progress, attendance, and upcoming exams.",
      stats: [
        { title: "Current Books", value: "3", icon: <BookOpenCheck /> },
        { title: "Attendance", value: "92%", icon: <Calendar /> },
        { title: "Next Exam", value: "May 15", icon: <GraduationCap /> },
        { title: "Pending Fees", value: "$250", icon: <DollarSign /> }
      ]
    },
    teacher: {
      welcomeMessage: "Manage your classes, student attendance and grades.",
      stats: [
        { title: "Active Books", value: "5", icon: <BookOpenCheck /> },
        { title: "Students", value: "78", icon: <Users /> },
        { title: "Upcoming Exams", value: "3", icon: <GraduationCap /> },
        { title: "Classes Today", value: "4", icon: <Calendar /> }
      ]
    },
    finance: {
      welcomeMessage: "Track finances, invoices, and pending payments.",
      stats: [
        { title: "Pending Invoices", value: "24", icon: <DollarSign /> },
        { title: "Monthly Revenue", value: "$12,530", icon: <BarChart /> },
        { title: "Paid Students", value: "142", icon: <Users /> },
        { title: "Expenses", value: "$5,210", icon: <PieChart /> }
      ]
    },
    controller: {
      welcomeMessage: "Manage books, schedules, and monitor academic performance.",
      stats: [
        { title: "Active Books", value: "18", icon: <BookOpenCheck /> },
        { title: "Active Students", value: "245", icon: <Users /> },
        { title: "Upcoming Exams", value: "7", icon: <GraduationCap /> },
        { title: "Teachers", value: "15", icon: <Users /> }
      ]
    },
    admin: {
      welcomeMessage: "Overview of the educational center operations.",
      stats: [
        { title: "Total Students", value: "382", icon: <Users /> },
        { title: "Total Revenue", value: "$42,180", icon: <DollarSign /> },
        { title: "Active Books", value: "24", icon: <BookOpenCheck /> },
        { title: "Teachers", value: "18", icon: <Users /> }
      ]
    },
    superadmin: {
      welcomeMessage: "Manage multiple branches and monitor overall performance.",
      stats: [
        { title: "Total Branches", value: "5", icon: <LayoutDashboard /> },
        { title: "Total Students", value: "1,245", icon: <Users /> },
        { title: "Total Revenue", value: "$168,720", icon: <DollarSign /> },
        { title: "Total Teachers", value: "64", icon: <Users /> }
      ]
    }
  };

  // Default to student view if role isn't recognized
  const config = dashboardConfig[role] || dashboardConfig.student;

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-8 p-8">
        <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">{config.welcomeMessage}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button>View Reports</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {config.stats.map((stat, index) => (
            <Card key={index} hoverable className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {renderRoleSpecificContent(role)}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics content would appear here, showing charts and trends relevant to your role.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Reports and documents would be accessible here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your recent notifications and alerts would appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}

function renderRoleSpecificContent(role: UserRole) {
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

// Mock components for role-specific dashboard sections
const UpcomingExams = () => (
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

const RecentAttendance = () => (
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

const PendingInvoices = () => (
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

const ClassesToday = () => (
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

const StudentPerformance = () => (
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

const UpcomingSchedule = () => (
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

const RevenueOverview = () => (
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

const ExpenseBreakdown = () => (
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

const ExamSchedule = () => (
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

const BookPerformance = () => (
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

const TeacherAttendance = () => (
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

const StudentEnrollment = () => (
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

const PerformanceOverview = () => (
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
