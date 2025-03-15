
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  BookOpen,
  Calendar,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Settings,
  ShoppingCart,
  User,
  Users,
  FileText,
  CreditCard,
  School,
  Building,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const role = user?.role || 'student';

  const mainNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: ['student', 'teacher', 'finance', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Students',
      href: '/students',
      icon: <GraduationCap className="h-5 w-5" />,
      roles: ['teacher', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Teachers',
      href: '/teachers',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'superadmin', 'controller'],
    },
    {
      title: 'Books/Courses',
      href: '/books',
      icon: <BookOpen className="h-5 w-5" />,
      roles: ['teacher', 'student', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Schedule',
      href: '/schedule',
      icon: <Calendar className="h-5 w-5" />,
      roles: ['student', 'teacher', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Attendance',
      href: '/attendance',
      icon: <FileText className="h-5 w-5" />,
      roles: ['student', 'teacher', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Exams & Marks',
      href: '/exams',
      icon: <Layers className="h-5 w-5" />,
      roles: ['student', 'teacher', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Finance',
      href: '/finance',
      icon: <CreditCard className="h-5 w-5" />,
      roles: ['finance', 'admin', 'superadmin'],
    },
    {
      title: 'Invoices',
      href: '/invoices',
      icon: <ShoppingCart className="h-5 w-5" />,
      roles: ['student', 'finance', 'admin', 'superadmin'],
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: <BarChart3 className="h-5 w-5" />,
      roles: ['controller', 'finance', 'admin', 'superadmin'],
    },
    {
      title: 'Branches',
      href: '/branches',
      icon: <Building className="h-5 w-5" />,
      roles: ['superadmin'],
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      title: 'Profile',
      href: '/profile',
      icon: <User className="h-5 w-5" />,
      roles: ['student', 'teacher', 'finance', 'controller', 'admin', 'superadmin'],
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
      roles: ['student', 'teacher', 'finance', 'controller', 'admin', 'superadmin'],
    },
  ];

  const filteredMainNavItems = mainNavItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-sidebar transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <School className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">EduCenter</span>
        </Link>
      </div>
      <div className="flex h-[calc(100vh-4rem)] flex-col justify-between overflow-y-auto p-4">
        <nav className="space-y-6">
          <div className="space-y-1">
            {filteredMainNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  location.pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
        <div className="rounded-md bg-sidebar-accent p-4">
          <div className="mb-2 text-xs font-medium">Logged in as</div>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-1">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">{user?.name || 'Guest'}</div>
              <div className="text-xs text-muted-foreground capitalize">{user?.role || 'Not logged in'}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
