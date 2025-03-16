
import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { CalendarDays, Plus, Clock, Book, GraduationCap } from 'lucide-react';

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("day");
  const isMobile = useIsMobile();

  const scheduleEvents = [
    { id: 1, time: '08:00 - 09:30', title: 'English Grammar Level 3', teacher: 'Ali Khan', room: 'Room 101', type: 'class' },
    { id: 2, time: '10:00 - 11:30', title: 'Mathematics Foundation', teacher: 'Sarah Ahmad', room: 'Room 203', type: 'class' },
    { id: 3, time: '12:00 - 13:00', title: 'Lunch Break', type: 'break' },
    { id: 4, time: '13:30 - 15:00', title: 'Physics Basics', teacher: 'Mohammad Nazari', room: 'Lab 1', type: 'class' },
    { id: 5, time: '15:30 - 17:00', title: 'Teacher Meeting', location: 'Conference Room', type: 'meeting' },
  ];

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-6 p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
            <p className="text-muted-foreground">
              Manage and view your class schedule and events.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
            <Select defaultValue={view} onValueChange={setView}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card className="border border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-md">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="events" className="flex-1">
            <TabsList className="mb-4">
              <TabsTrigger value="events">
                <CalendarDays className="mr-2 h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="classes">
                <Book className="mr-2 h-4 w-4" />
                Classes
              </TabsTrigger>
              <TabsTrigger value="rooms">
                <GraduationCap className="mr-2 h-4 w-4" />
                Rooms
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="mt-0">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg">
                    <CalendarDays className="mr-2 h-5 w-5" />
                    {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Today'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                    <div className="space-y-4">
                      {scheduleEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`rounded-md border p-3 ${
                            event.type === 'break' ? 'bg-muted/50' : 
                            event.type === 'meeting' ? 'bg-yellow-50 dark:bg-yellow-950/20' : 
                            'bg-card'
                          }`}
                        >
                          <div className="flex justify-between">
                            <div className="font-medium">{event.title}</div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-3 w-3" />
                              {event.time}
                            </div>
                          </div>
                          {event.type === 'class' && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <div>Teacher: {event.teacher}</div>
                              <div>Location: {event.room}</div>
                            </div>
                          )}
                          {event.type === 'meeting' && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              <div>Location: {event.location}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="classes" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Class Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Class schedule content will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rooms" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Room Allocations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Room allocation information will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
