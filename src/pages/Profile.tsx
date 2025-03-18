
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types';
import { format } from 'date-fns';

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      contactNumber: user?.contactNumber || '',
      address: user?.address || '',
    },
  });
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        contactNumber: user.contactNumber || '',
        address: user.address || '',
      });
    }
  }, [user, form]);
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user) return;
      
      await updateProfile({
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber || '',
        address: data.address || '',
      });
      
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };
  
  if (!user) {
    return (
      <PageTransition>
        <div className="container p-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Please login to view your profile.</p>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }
  
  return (
    <PageTransition>
      <div className="container max-w-6xl p-8">
        <div className="flex flex-col justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>
        </div>
        
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-28 w-28">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <Badge className="capitalize">{user.role}</Badge>
                </div>
                <div className="mt-6 w-full">
                  <div className="flex items-center gap-2 pb-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Role: <span className="font-medium capitalize">{user.role}</span></p>
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Joined: <span className="font-medium">{format(user.createdAt, 'PPP')}</span></p>
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Phone: <span className="font-medium">{user.contactNumber || 'Not provided'}</span></p>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">Address: <span className="font-medium">{user.address || 'Not provided'}</span></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account information and manage your profile settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-6">
                  <TabsTrigger value="details">Personal Details</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Your contact number for communications
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                disabled={!isEditing}
                                className={!isEditing ? "bg-muted" : ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {isEditing ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false);
                              form.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <Button 
                            type="button"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Profile
                          </Button>
                        </div>
                      )}
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="preferences">
                  <div className="space-y-6">
                    <div className="rounded-md border p-4">
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage your notification preferences
                      </p>
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground">
                          Notification settings will be implemented in a future update.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}
