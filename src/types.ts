/**
 * Employee Management System (EMS) TypeScript Type Definitions
 */

export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  designation?: string;
  token?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  designation: string;
  role: UserRole;
  salary: number;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'On Leave' | 'Suspended';
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM
  checkOut?: string; // HH:MM
  status: 'Present' | 'Absent' | 'Late' | 'Half-Day';
  workHours?: number;
}

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Casual';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  remarks?: string;
}

export interface LeaveBalance {
  Annual: number;
  Sick: number;
  Casual: number;
  Unpaid: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentName: string;
  designation: string;
  month: string; // "January", "February", etc.
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'Paid' | 'Processing' | 'Unpaid';
  paymentDate?: string;
}

export interface RecentActivity {
  id: string;
  type: 'employee' | 'leave' | 'attendance' | 'payroll' | 'auth';
  title: string;
  description: string;
  timestamp: string; // ISO or human readable like "10 mins ago"
  user: string;
}
