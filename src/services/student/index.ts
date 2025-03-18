
import { StudentQueryService } from './StudentQueryService';
import { StudentMutationService } from './StudentMutationService';

export class StudentService {
  // Query methods
  static getAllStudents = StudentQueryService.getAllStudents;
  static getStudentById = StudentQueryService.getStudentById;
  static getStudentAttendance = StudentQueryService.getStudentAttendance;
  static getStudentExams = StudentQueryService.getStudentExams;
  static getStudentInvoices = StudentQueryService.getStudentInvoices;
  
  // Mutation methods
  static createStudent = StudentMutationService.createStudent;
  static updateStudent = StudentMutationService.updateStudent;
  static deleteStudent = StudentMutationService.deleteStudent;
  static enrollStudentInBook = StudentMutationService.enrollStudentInBook;
  static removeStudentFromBook = StudentMutationService.removeStudentFromBook;
}
