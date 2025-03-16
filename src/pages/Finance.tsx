
import { useState } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreditCard, DollarSign, FileText, MoreHorizontal, Plus, Search, TrendingUp, User, Wallet, Download, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function Finance() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const transactions = [
    { id: 'INV-001', date: new Date('2023-06-15'), studentName: 'Ahmad Rahimi', studentId: 's1', amount: 1500, type: 'payment', status: 'completed', bookName: 'English Grammar Level 3' },
    { id: 'INV-002', date: new Date('2023-06-18'), studentName: 'Fatima Ahmadi', studentId: 's2', amount: 1800, type: 'payment', status: 'pending', bookName: 'Mathematics Foundation' },
    { id: 'INV-003', date: new Date('2023-07-01'), studentName: 'Najiba Karimi', studentId: 's5', amount: 1500, type: 'payment', status: 'completed', bookName: 'English Grammar Level 3' },
    { id: 'INV-004', date: new Date('2023-07-05'), studentName: 'Sayed Ali', studentId: 's6', amount: 2000, type: 'payment', status: 'completed', bookName: 'Physics Basics' },
    { id: 'EXP-001', date: new Date('2023-06-20'), description: 'Teacher Salary - Ali Hakimi', amount: 5000, type: 'expense', category: 'salary' },
    { id: 'EXP-002', date: new Date('2023-06-25'), description: 'Office Supplies', amount: 500, type: 'expense', category: 'supplies' },
    { id: 'EXP-003', date: new Date('2023-07-02'), description: 'Electricity Bill', amount: 300, type: 'expense', category: 'utilities' },
  ];

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) => {
      if ('studentName' in transaction) {
        return transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
               transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
      }
    }
  );

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'payment')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpenses;

  return (
    <PageTransition>
      <div className="container max-w-screen-2xl space-y-6 p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
            <p className="text-muted-foreground">
              Manage payments, expenses, and financial reports.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Transaction
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">${totalIncome.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <Wallet className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">${totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">-3% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">${balance.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Updated just now</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">
              <CreditCard className="mr-2 h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="mr-2 h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="expenses">
              <Wallet className="mr-2 h-4 w-4" />
              Expenses
            </TabsTrigger>
            <TabsTrigger value="reports">
              <TrendingUp className="mr-2 h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            
            <ScrollArea className="h-[calc(100vh-24rem)]">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center">
                            No transactions found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.id}</TableCell>
                            <TableCell>{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                            <TableCell>
                              {'studentName' in transaction ? (
                                <div className="flex flex-col">
                                  <span>{transaction.studentName}</span>
                                  <span className="text-xs text-muted-foreground">{transaction.bookName}</span>
                                </div>
                              ) : (
                                transaction.description
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={transaction.type === 'payment' ? 'text-green-500' : 'text-red-500'}>
                                {transaction.type === 'payment' ? '+' : '-'}${transaction.amount}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={
                                transaction.type === 'payment' 
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-red-500/10 text-red-500'
                              }>
                                {transaction.type === 'payment' ? 'Income' : 'Expense'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {'status' in transaction && (
                                <Badge variant={transaction.status === 'completed' ? 'default' : 'outline'}>
                                  {transaction.status}
                                </Badge>
                              )}
                              {'category' in transaction && (
                                <Badge variant="outline">
                                  {transaction.category}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  {'studentName' in transaction && (
                                    <DropdownMenuItem>
                                      <User className="mr-2 h-4 w-4" />
                                      View Student
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>Print Receipt</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage your invoices and payments.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Invoice management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>Track and manage your expenses.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Expense management functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
                <CardDescription>Generate and view financial reports.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Financial reporting functionality will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
