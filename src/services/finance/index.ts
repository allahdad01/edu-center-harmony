
import { InvoiceService } from './InvoiceService';
import { ExpenseService } from './ExpenseService';
import { SalaryService } from './SalaryService';

export class FinanceService {
  // Invoice methods
  static getAllInvoices = InvoiceService.getAllInvoices;
  static getStudentInvoices = InvoiceService.getStudentInvoices;
  static createInvoice = InvoiceService.createInvoice;
  static updateInvoice = InvoiceService.updateInvoice;
  static markInvoiceAsPaid = InvoiceService.markInvoiceAsPaid;
  static deleteInvoice = InvoiceService.deleteInvoice;
  
  // Expense methods
  static getAllExpenses = ExpenseService.getAllExpenses;
  static createExpense = ExpenseService.createExpense;
  static updateExpense = ExpenseService.updateExpense;
  static deleteExpense = ExpenseService.deleteExpense;
  
  // Salary methods
  static getAllSalaries = SalaryService.getAllSalaries;
  static createSalary = SalaryService.createSalary;
  static markSalaryAsPaid = SalaryService.markSalaryAsPaid;
  static recordSalaryAdvance = SalaryService.recordSalaryAdvance;
  static deleteSalary = SalaryService.deleteSalary;
}
