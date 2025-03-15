
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { dashboardConfig } from '@/components/dashboard/DashboardConfig';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { renderRoleSpecificContent } from '@/components/dashboard/DashboardSections';

export default function Dashboard() {
  const { user } = useAuth();
  const role = user?.role as UserRole;
  
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

        <DashboardStats stats={config.stats} />

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
