
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GraduationCap, BarChart, Users, BookOpen, Heart, Calendar, CheckCircle, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassPanel from '@/components/ui-custom/GlassPanel';

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_35%_at_60%_30%,#3b82f680_0%,transparent_50%)]" />
        
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 flex justify-center">
                <div className="rounded-xl bg-primary p-2">
                  <GraduationCap className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                Education Management,{' '}
                <span className="text-primary">Simplified</span>
              </h1>
              <p className="mb-10 text-lg text-muted-foreground md:text-xl">
                A comprehensive platform designed for educational centers to manage
                students, teachers, courses, finances, and more with elegance and efficiency.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6">
                  <Link to="/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-6">
                  <Link to="/dashboard">View Demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm">
              <span className="text-muted-foreground">Smart Features</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to manage your educational center
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our platform provides comprehensive tools for students, teachers, administrators, and financial managers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard 
              icon={<Users className="h-6 w-6" />}
              title="Student Management"
              description="Effortlessly track student information, attendance, and academic progress in one place."
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6" />}
              title="Course Management"
              description="Create and manage books/courses, assign teachers, and track performance metrics."
            />
            <FeatureCard 
              icon={<Calendar className="h-6 w-6" />}
              title="Automated Scheduling"
              description="Generate class schedules automatically based on teacher availability and course requirements."
            />
            <FeatureCard 
              icon={<PieChart className="h-6 w-6" />}
              title="Financial Tracking"
              description="Manage student invoices, track payments, and handle expenses with ease."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-6 w-6" />}
              title="Attendance System"
              description="Take daily attendance with simple interfaces for teachers and administrators."
            />
            <FeatureCard 
              icon={<BarChart className="h-6 w-6" />}
              title="Comprehensive Reporting"
              description="Generate detailed reports on student performance, finances, and overall operations."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <GlassPanel intensity="light" className="overflow-hidden p-8 md:p-12">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Ready to transform your educational center?
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    Join hundreds of educational institutions that have streamlined their operations, improved student outcomes, and increased efficiency.
                  </p>
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Button asChild size="lg">
                      <Link to="/login">Get Started</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link to="/dashboard">Request Demo</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="absolute inset-0 blur-3xl bg-primary/20 rounded-full" />
                    <div className="relative grid gap-4 grid-cols-2">
                      <StatBox title="Students Managed" value="10,000+" />
                      <StatBox title="Educational Centers" value="500+" />
                      <StatBox title="Books/Courses" value="2,500+" />
                      <StatBox title="Satisfaction Rate" value="99%" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center">
              <div className="mr-2 rounded-md bg-primary p-1">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">EduCenter</span>
            </div>
            <div className="mt-6 md:mt-0">
              <p className="text-center text-sm text-muted-foreground md:text-right">
                © {new Date().getFullYear()} EduCenter Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md"
    >
      <div className="mb-4 rounded-lg bg-primary/10 p-3 text-primary w-fit">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function StatBox({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-card p-6 shadow-sm">
      <p className="text-3xl font-bold">{value}</p>
      <p className="mt-2 text-center text-sm text-muted-foreground">{title}</p>
    </div>
  );
}
