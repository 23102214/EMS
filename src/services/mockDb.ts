/**
 * Mock Database for Employee Management System (EMS)
 * Restores and persists standard corporate HR records in localStorage.
 */

import { Employee, Department, Attendance, LeaveRequest, Payroll, RecentActivity } from '../types';

// Seed lists with beautiful, standard corporate mock data
const DEFAULT_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Engineering', code: 'ENG', description: 'Core software engineering and systems design', employeeCount: 4, managerName: 'Sarah Jenkins' },
  { id: '2', name: 'Human Resources', code: 'HRD', description: 'Talent management, recruitment, and employee relations', employeeCount: 2, managerName: 'David Mercer' },
  { id: '3', name: 'Sales & Marketing', code: 'S&M', description: 'Enterprise sales executive team and marketing strategies', employeeCount: 3, managerName: 'Amanda Collins' },
  { id: '4', name: 'Finance & Accounts', code: 'FIN', description: 'Payroll management, corporate finance, and accounting', employeeCount: 2, managerName: 'Robert Vance' },
  { id: '5', name: 'Product Management', code: 'PRD', description: 'Product design, specifications, and client delivery', employeeCount: 2, managerName: 'Diana Prince' }
];

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 'sarah.j@enterprise.com',
    phone: '+1 (555) 019-2834',
    departmentId: '1',
    departmentName: 'Engineering',
    designation: 'VP of Engineering',
    role: 'ADMIN',
    salary: 135000,
    joinDate: '2022-01-15',
    status: 'Active',
    gender: 'Female',
    dob: '1987-03-22',
    address: '422 Pine Ave, Seattle, WA'
  },
  {
    id: 'EMP-002',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    email: 'alex.r@enterprise.com',
    phone: '+1 (555) 018-9921',
    departmentId: '1',
    departmentName: 'Engineering',
    designation: 'Senior Developer',
    role: 'MANAGER',
    salary: 95000,
    joinDate: '2023-04-10',
    status: 'Active',
    gender: 'Male',
    dob: '1991-08-14',
    address: '711 Elm Road, Redmond, WA'
  },
  {
    id: 'EMP-003',
    firstName: 'Emma',
    lastName: 'Watson',
    email: 'emma.w@enterprise.com',
    phone: '+1 (555) 021-4822',
    departmentId: '1',
    departmentName: 'Engineering',
    designation: 'Frontend Engineer',
    role: 'EMPLOYEE',
    salary: 78000,
    joinDate: '2024-02-01',
    status: 'Active',
    gender: 'Female',
    dob: '1995-11-30',
    address: '89 Main St, Bellevue, WA'
  },
  {
    id: 'EMP-004',
    firstName: 'David',
    lastName: 'Mercer',
    email: 'david.m@enterprise.com',
    phone: '+1 (555) 017-3841',
    departmentId: '2',
    departmentName: 'Human Resources',
    designation: 'HR Director',
    role: 'MANAGER',
    salary: 82000,
    joinDate: '2021-06-20',
    status: 'Active',
    gender: 'Male',
    dob: '1984-05-09',
    address: '155 Oak Boulevard, Seattle, WA'
  },
  {
    id: 'EMP-005',
    firstName: 'Clara',
    lastName: 'Oswald',
    email: 'clara.o@enterprise.com',
    phone: '+1 (555) 022-5591',
    departmentId: '2',
    departmentName: 'Human Resources',
    designation: 'HR Coordinator',
    role: 'EMPLOYEE',
    salary: 54000,
    joinDate: '2023-09-12',
    status: 'Active',
    gender: 'Female',
    dob: '1997-02-18',
    address: '47 Maple Ln, Seattle, WA'
  },
  {
    id: 'EMP-006',
    firstName: 'Amanda',
    lastName: 'Collins',
    email: 'amanda.c@enterprise.com',
    phone: '+1 (555) 015-2831',
    departmentId: '3',
    departmentName: 'Sales & Marketing',
    designation: 'Sales Director',
    role: 'MANAGER',
    salary: 90000,
    joinDate: '2022-11-01',
    status: 'Active',
    gender: 'Female',
    dob: '1989-10-05',
    address: '29 Sea Breeze Ave, Tacoma, WA'
  },
  {
    id: 'EMP-007',
    firstName: 'Marcus',
    lastName: 'Aurelius',
    email: 'marcus.a@enterprise.com',
    phone: '+1 (555) 024-4411',
    departmentId: '3',
    departmentName: 'Sales & Marketing',
    designation: 'Senior Account Executive',
    role: 'EMPLOYEE',
    salary: 72000,
    joinDate: '2023-02-15',
    status: 'On Leave',
    gender: 'Male',
    dob: '1985-04-26',
    address: '188 Forum Way, Lynnwood, WA'
  },
  {
    id: 'EMP-008',
    firstName: 'Diana',
    lastName: 'Prince',
    email: 'diana.p@enterprise.com',
    phone: '+1 (555) 013-1122',
    departmentId: '5',
    departmentName: 'Product Management',
    designation: 'Product Lead',
    role: 'MANAGER',
    salary: 110000,
    joinDate: '2022-08-10',
    status: 'Active',
    gender: 'Female',
    dob: '1988-01-20',
    address: '99 Themis Cove, Seattle, WA'
  },
  {
    id: 'EMP-009',
    firstName: 'Robert',
    lastName: 'Vance',
    email: 'robert.v@enterprise.com',
    phone: '+1 (555) 011-9231',
    departmentId: '4',
    departmentName: 'Finance & Accounts',
    designation: 'Chief Treasurer',
    role: 'MANAGER',
    salary: 115000,
    joinDate: '2020-03-01',
    status: 'Active',
    gender: 'Male',
    dob: '1979-07-16',
    address: '88 Refrigeration Dr, Scranton, PA'
  },
  {
    id: 'EMP-010',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@enterprise.com',
    phone: '+1 (555) 039-4822',
    departmentId: '1',
    departmentName: 'Engineering',
    designation: 'Junior Developer',
    role: 'EMPLOYEE',
    salary: 58000,
    joinDate: '2025-01-10',
    status: 'Active',
    gender: 'Male',
    dob: '1999-12-05',
    address: '500 Cascade Ave, Seattle, WA'
  }
];

// Initialize attendance for current and past 3 days for employees
const generateInitialAttendance = (): Attendance[] => {
  const dates = ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04'];
  const attendanceList: Attendance[] = [];
  let idCounter = 1;

  DEFAULT_EMPLOYEES.forEach((emp) => {
    dates.forEach((date) => {
      // emp 7 is 'On Leave'
      if (emp.id === 'EMP-007') {
        attendanceList.push({
          id: `ATT-${idCounter++}`,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          date,
          status: 'Absent',
          workHours: 0
        });
        return;
      }

      // Random status
      const rand = Math.random();
      let status: 'Present' | 'Late' | 'Half-Day' | 'Absent' = 'Present';
      let checkIn = '09:00';
      let checkOut = '17:30';
      let workHours = 8.5;

      if (rand < 0.8) {
        status = 'Present';
        const minute = Math.floor(Math.random() * 15);
        checkIn = `08:${minute > 9 ? minute : '0' + minute}`;
      } else if (rand < 0.9) {
        status = 'Late';
        const minute = 15 + Math.floor(Math.random() * 40);
        checkIn = `09:${minute}`;
        workHours = 7.5;
      } else if (rand < 0.95) {
        status = 'Half-Day';
        checkIn = '13:00';
        workHours = 4.0;
      } else {
        status = 'Absent';
        checkIn = '';
        checkOut = '';
        workHours = 0;
      }

      attendanceList.push({
        id: `ATT-${idCounter++}`,
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        date,
        checkIn: status !== 'Absent' ? checkIn : undefined,
        checkOut: status !== 'Absent' ? checkOut : undefined,
        status,
        workHours
      });
    });
  });

  return attendanceList;
};

const DEFAULT_LEAVES: LeaveRequest[] = [
  {
    id: 'LV-1001',
    employeeId: 'EMP-007',
    employeeName: 'Marcus Aurelius',
    departmentName: 'Sales & Marketing',
    leaveType: 'Annual',
    startDate: '2026-06-01',
    endDate: '2026-06-08',
    durationDays: 6,
    reason: 'Philosophy meditation and spiritual recharge',
    status: 'Approved',
    appliedDate: '2026-05-20',
    approvedBy: 'EMP-006',
    remarks: 'Approved. Enjoy the wellness break'
  },
  {
    id: 'LV-1002',
    employeeId: 'EMP-003',
    employeeName: 'Emma Watson',
    departmentName: 'Engineering',
    leaveType: 'Sick',
    startDate: '2026-06-05',
    endDate: '2026-06-06',
    durationDays: 2,
    reason: 'Dental appointment and recovery wisdom tooth removal',
    status: 'Pending',
    appliedDate: '2026-06-03'
  },
  {
    id: 'LV-1003',
    employeeId: 'EMP-005',
    employeeName: 'Clara Oswald',
    departmentName: 'Human Resources',
    leaveType: 'Casual',
    startDate: '2026-06-12',
    endDate: '2026-06-14',
    durationDays: 2,
    reason: 'Family gathering event out of state',
    status: 'Pending',
    appliedDate: '2026-06-01'
  },
  {
    id: 'LV-1004',
    employeeId: 'EMP-010',
    employeeName: 'John Doe',
    departmentName: 'Engineering',
    leaveType: 'Unpaid',
    startDate: '2026-05-10',
    endDate: '2026-05-12',
    durationDays: 3,
    reason: 'Moving to a new apartment downtown',
    status: 'Rejected',
    appliedDate: '2026-05-05',
    approvedBy: 'EMP-001',
    remarks: 'Denied due to scheduled high deployment sprints. Moved to next month instead.'
  }
];

const DEFAULT_PAYROLL: Payroll[] = [
  { id: 'PAY-2001', employeeId: 'EMP-001', employeeName: 'Sarah Jenkins', departmentName: 'Engineering', designation: 'VP of Engineering', month: 'May', year: 2026, baseSalary: 11250, allowances: 1200, deductions: 650, netSalary: 11800, status: 'Paid', paymentDate: '2026-05-28' },
  { id: 'PAY-2002', employeeId: 'EMP-002', employeeName: 'Alex Rodriguez', departmentName: 'Engineering', designation: 'Senior Developer', month: 'May', year: 2026, baseSalary: 7916, allowances: 500, deductions: 416, netSalary: 8000, status: 'Paid', paymentDate: '2026-05-28' },
  { id: 'PAY-2003', employeeId: 'EMP-003', employeeName: 'Emma Watson', departmentName: 'Engineering', designation: 'Frontend Engineer', month: 'May', year: 2026, baseSalary: 6500, allowances: 400, deductions: 350, netSalary: 6550, status: 'Paid', paymentDate: '2026-05-28' },
  { id: 'PAY-2004', employeeId: 'EMP-004', employeeName: 'David Mercer', departmentName: 'Human Resources', designation: 'HR Director', month: 'May', year: 2026, baseSalary: 6833, allowances: 400, deductions: 350, netSalary: 6883, status: 'Paid', paymentDate: '2026-05-28' },
  { id: 'PAY-2005', employeeId: 'EMP-005', employeeName: 'Clara Oswald', departmentName: 'Human Resources', designation: 'HR Coordinator', month: 'May', year: 2026, baseSalary: 4500, allowances: 250, deductions: 220, netSalary: 4530, status: 'Processing' },
  { id: 'PAY-2006', employeeId: 'EMP-006', employeeName: 'Amanda Collins', departmentName: 'Sales & Marketing', designation: 'Sales Director', month: 'May', year: 2026, baseSalary: 7500, allowances: 800, deductions: 450, netSalary: 7850, status: 'Paid', paymentDate: '2026-05-28' },
  { id: 'PAY-2007', employeeId: 'EMP-007', employeeName: 'Marcus Aurelius', departmentName: 'Sales & Marketing', designation: 'Senior Account Executive', month: 'May', year: 2026, baseSalary: 6000, allowances: 500, deductions: 350, netSalary: 6150, status: 'Unpaid' }
];

const DEFAULT_ACTIVITIES: RecentActivity[] = [
  { id: 'ACT-001', type: 'leave', title: 'Leave Applied', description: 'Emma Watson applied for Sick Leave (2 days)', timestamp: '1 hour ago', user: 'Emma Watson' },
  { id: 'ACT-002', type: 'employee', title: 'New Onboarding', description: 'John Doe was onboarded to the Engineering division', timestamp: 'Yesterday', user: 'Admin Jenkins' },
  { id: 'ACT-003', type: 'leave', title: 'Leave Approved', description: 'Marcus Aurelius leave request was approved by Sarah Jenkins', timestamp: '2 days ago', user: 'Sarah Jenkins' },
  { id: 'ACT-004', type: 'payroll', title: 'May Salaries Disbursed', description: 'Salary disbursements marked complete for 5 administrative users', timestamp: '5 days ago', user: 'Robert Vance' },
  { id: 'ACT-005', type: 'attendance', title: 'Overtime Notification', description: 'Alex Rodriguez recorded over 10 working hours', timestamp: '2026-06-03', user: 'System Agent' }
];

// Localstorage helper wrapper
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  return JSON.parse(data) as T;
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export class MockDb {
  static getEmployees(): Employee[] {
    return getStorageItem<Employee[]>('ems_employees', DEFAULT_EMPLOYEES);
  }

  static saveEmployees(employees: Employee[]) {
    setStorageItem('ems_employees', employees);
  }

  static getDepartments(): Department[] {
    return getStorageItem<Department[]>('ems_departments', DEFAULT_DEPARTMENTS);
  }

  static saveDepartments(departments: Department[]) {
    setStorageItem('ems_departments', departments);
  }

  static getAttendance(): Attendance[] {
    return getStorageItem<Attendance[]>('ems_attendance', generateInitialAttendance());
  }

  static saveAttendance(attendance: Attendance[]) {
    setStorageItem('ems_attendance', attendance);
  }

  static getLeaves(): LeaveRequest[] {
    return getStorageItem<LeaveRequest[]>('ems_leaves', DEFAULT_LEAVES);
  }

  static saveLeaves(leaves: LeaveRequest[]) {
    setStorageItem('ems_leaves', leaves);
  }

  static getPayroll(): Payroll[] {
    return getStorageItem<Payroll[]>('ems_payroll', DEFAULT_PAYROLL);
  }

  static savePayroll(payroll: Payroll[]) {
    setStorageItem('ems_payroll', payroll);
  }

  static getActivities(): RecentActivity[] {
    return getStorageItem<RecentActivity[]>('ems_activities', DEFAULT_ACTIVITIES);
  }

  static saveActivities(activities: RecentActivity[]) {
    setStorageItem('ems_activities', activities);
  }

  static logActivity(type: RecentActivity['type'], title: string, description: string, user: string) {
    const activities = this.getActivities();
    const newActivity: RecentActivity = {
      id: `ACT-${Date.now()}`,
      type,
      title,
      description,
      timestamp: 'Just now',
      user
    };
    this.saveActivities([newActivity, ...activities.slice(0, 49)]);
  }
}
