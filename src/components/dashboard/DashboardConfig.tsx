
import { BookOpenCheck, Calendar, GraduationCap, LayoutDashboard, Users, PieChart, DollarSign, BarChart } from 'lucide-react';
import { UserRole } from '@/types';

export interface DashboardStat {
  title: string;
  value: string;
  icon: JSX.Element;
}

export interface DashboardConfig {
  welcomeMessage: string;
  stats: DashboardStat[];
}

export const dashboardConfig: Record<UserRole, DashboardConfig> = {
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
