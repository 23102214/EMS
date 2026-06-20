/**
 * Centralized Axios integration and Service Layer for Spring Boot Backend.
 * Automatically performs REST standard calls or shifts to persistent MockDb simulations in preview contexts.
 */

import axios, { AxiosError } from 'axios';
import { MockDb } from './mockDb';
import { Employee, Department, Attendance, LeaveRequest, Payroll, RecentActivity } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';

// Create Centralized Axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios Request Interceptor - Inject JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ems_jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios Response Interceptor - Authentication & Error Handler
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Trigger session clearance on authentication failure
      localStorage.removeItem('ems_jwt_token');
      localStorage.removeItem('ems_current_user');
      window.dispatchEvent(new Event('auth-expired'));
    }
    return Promise.reject(error);
  }
);

// Delay helper to emulate network roundtrips for spinners
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Service Layer - Consuming REST endpoints with adaptive Mock fallback
 */

// Helper to check if we are using the live backend (can be toggled)
const isLiveBackendWorking = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_BASE_URL}/health`, { timeout: 1500 });
    return true;
  } catch (err) {
    return false;
  }
};

export const EmployeeService = {
  async getAll(): Promise<Employee[]> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.get<Employee[]>('/employees');
      return resp.data;
    }
    await delay(600);
    return MockDb.getEmployees();
  },

  async getById(id: string): Promise<Employee> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.get<Employee>(`/employees/${id}`);
      return resp.data;
    }
    await delay(300);
    const emp = MockDb.getEmployees().find(e => e.id === id);
    if (!emp) throw new Error('Employee not found');
    return emp;
  },

  async create(employee: Omit<Employee, 'id'>): Promise<Employee> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<Employee>('/employees', employee);
      return resp.data;
    }
    await delay(700);
    const list = MockDb.getEmployees();
    const prefix = 'EMP-';
    const nextNum = Math.floor(Math.random() * 900) + 100;
    const newId = `${prefix}${nextNum}`;
    const mapped: Employee = { ...employee, id: newId };
    
    // Add corresponding department employeeCount
    const deps = MockDb.getDepartments();
    const updatedDeps = deps.map(d => {
      if (d.id === employee.departmentId) {
        return { ...d, employeeCount: d.employeeCount + 1 };
      }
      return d;
    });
    MockDb.saveDepartments(updatedDeps);

    MockDb.saveEmployees([...list, mapped]);
    MockDb.logActivity('employee', 'Employee Hired', `Successfully onboarded ${mapped.firstName} ${mapped.lastName} as ${mapped.designation}`, 'Admin');
    return mapped;
  },

  async update(id: string, employee: Employee): Promise<Employee> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.put<Employee>(`/employees/${id}`, employee);
      return resp.data;
    }
    await delay(700);
    const list = MockDb.getEmployees();
    const index = list.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    
    const previous = list[index];
    list[index] = employee;
    
    // If department has changed, adjust department employee counts
    if (previous.departmentId !== employee.departmentId) {
      const deps = MockDb.getDepartments();
      const updatedDeps = deps.map(d => {
        if (d.id === previous.departmentId) return { ...d, employeeCount: Math.max(0, d.employeeCount - 1) };
        if (d.id === employee.departmentId) return { ...d, employeeCount: d.employeeCount + 1 };
        return d;
      });
      MockDb.saveDepartments(updatedDeps);
    }
    
    MockDb.saveEmployees(list);
    MockDb.logActivity('employee', 'Employee Updated', `Updated core credentials of ${employee.firstName} ${employee.lastName}`, 'Admin');
    return employee;
  },

  async delete(id: string): Promise<void> {
    if (await isLiveBackendWorking()) {
      await apiClient.delete(`/employees/${id}`);
      return;
    }
    await delay(600);
    const list = MockDb.getEmployees();
    const target = list.find(e => e.id === id);
    if (!target) throw new Error('Employee not found');
    
    // Subtract department count
    const deps = MockDb.getDepartments();
    const updatedDeps = deps.map(d => {
      if (d.id === target.departmentId) return { ...d, employeeCount: Math.max(0, d.employeeCount - 1) };
      return d;
    });
    MockDb.saveDepartments(updatedDeps);

    MockDb.saveEmployees(list.filter(e => e.id !== id));
    MockDb.logActivity('employee', 'Employee Terminated', `Terminated corporate access key for ${target.firstName} ${target.lastName}`, 'Admin');
  }
};

export const DepartmentService = {
  async getAll(): Promise<Department[]> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.get<Department[]>('/departments');
      return resp.data;
    }
    await delay(500);
    return MockDb.getDepartments();
  },

  async create(dep: Omit<Department, 'id' | 'employeeCount'>): Promise<Department> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<Department>('/departments', dep);
      return resp.data;
    }
    await delay(600);
    const list = MockDb.getDepartments();
    const newDep: Department = {
      ...dep,
      id: String(list.length + 1),
      employeeCount: 0
    };
    MockDb.saveDepartments([...list, newDep]);
    MockDb.logActivity('employee', 'Department Created', `Set up new division: ${newDep.name} (${newDep.code})`, 'Admin');
    return newDep;
  },

  async update(id: string, dep: Department): Promise<Department> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.put<Department>(`/departments/${id}`, dep);
      return resp.data;
    }
    await delay(600);
    const list = MockDb.getDepartments();
    const index = list.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Department not found');
    list[index] = dep;
    MockDb.saveDepartments(list);
    MockDb.logActivity('employee', 'Department Edited', `Updated specifications for division ${dep.name}`, 'Admin');
    return dep;
  },

  async delete(id: string): Promise<void> {
    if (await isLiveBackendWorking()) {
      await apiClient.delete(`/departments/${id}`);
      return;
    }
    await delay(500);
    const list = MockDb.getDepartments();
    const target = list.find(d => d.id === id);
    if (!target) throw new Error('Department not found');
    if (target.employeeCount > 0) {
      throw new Error(`Cannot delete: ${target.name} has active assigned employees.`);
    }
    MockDb.saveDepartments(list.filter(d => d.id !== id));
    MockDb.logActivity('employee', 'Department Disbanded', `Disbanded vacant division ${target.name}`, 'Admin');
  }
};

export const AttendanceService = {
  async getAll(): Promise<Attendance[]> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.get<Attendance[]>('/attendance');
      return resp.data;
    }
    await delay(550);
    return MockDb.getAttendance();
  },

  async clockIn(employeeId: string): Promise<Attendance> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<Attendance>(`/attendance/clock-in/${employeeId}`);
      return resp.data;
    }
    await delay(600);
    const employees = MockDb.getEmployees();
    const emp = employees.find(e => e.id === employeeId);
    if (!emp) throw new Error('Employee not found');

    const list = MockDb.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check if duplicate today
    const existingIndex = list.findIndex(a => a.employeeId === employeeId && a.date === todayStr);
    
    const timeNow = new Date();
    const hh = String(timeNow.getHours()).padStart(2, '0');
    const mm = String(timeNow.getMinutes()).padStart(2, '0');
    const clockTime = `${hh}:${mm}`;

    // Compute status. Work starts at 09:00. If after 09:15 -> Late
    const isLate = timeNow.getHours() > 9 || (timeNow.getHours() === 9 && timeNow.getMinutes() > 15);
    const status = isLate ? 'Late' : 'Present';

    let updatedAttendance: Attendance;

    if (existingIndex !== -1) {
      // Override today's clock in
      list[existingIndex] = {
        ...list[existingIndex],
        checkIn: clockTime,
        status,
        workHours: 8.0
      };
      updatedAttendance = list[existingIndex];
    } else {
      updatedAttendance = {
        id: `ATT-${Date.now()}`,
        employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        date: todayStr,
        checkIn: clockTime,
        status,
        workHours: 8.0
      };
      list.push(updatedAttendance);
    }

    MockDb.saveAttendance(list);
    MockDb.logActivity('attendance', 'Clock In Recorded', `${emp.firstName} logged attendance check-in at ${clockTime}`, `${emp.firstName} ${emp.lastName}`);
    return updatedAttendance;
  },

  async clockOut(employeeId: string): Promise<Attendance> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<Attendance>(`/attendance/clock-out/${employeeId}`);
      return resp.data;
    }
    await delay(650);
    const list = MockDb.getAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const index = list.findIndex(a => a.employeeId === employeeId && a.date === todayStr);
    if (index === -1) throw new Error('No clock-in record found for today.');

    const timeNow = new Date();
    const hh = String(timeNow.getHours()).padStart(2, '0');
    const mm = String(timeNow.getMinutes()).padStart(2, '0');
    const clockTime = `${hh}:${mm}`;

    const record = list[index];
    let hoursWorked = 8.0;
    if (record.checkIn) {
      const [sh, sm] = record.checkIn.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin = timeNow.getHours() * 60 + timeNow.getMinutes();
      hoursWorked = Number(((endMin - startMin) / 60).toFixed(1));
    }

    const updated: Attendance = {
      ...record,
      checkOut: clockTime,
      workHours: hoursWorked > 0 ? hoursWorked : 8.0
    };

    list[index] = updated;
    MockDb.saveAttendance(list);
    MockDb.logActivity('attendance', 'Clock Out Recorded', `${record.employeeName} completed work cycle. Logged check-out at ${clockTime}`, record.employeeName);
    return updated;
  }
};

export const LeaveService = {
  async getAll(): Promise<LeaveRequest[]> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.get<LeaveRequest[]>('/leaves');
      return resp.data;
    }
    await delay(500);
    return MockDb.getLeaves();
  },

  async apply(leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>): Promise<LeaveRequest> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<LeaveRequest>('/leaves', leave);
      return resp.data;
    }
    await delay(700);
    const list = MockDb.getLeaves();
    const applied: LeaveRequest = {
      ...leave,
      id: `LV-${Math.floor(Math.random() * 9000) + 1000}`,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };
    MockDb.saveLeaves([applied, ...list]);
    MockDb.logActivity('leave', 'Leave Application Raised', `${applied.employeeName} submitted a ${applied.leaveType} leave request`, applied.employeeName);
    return applied;
  },

  async processRequest(id: string, status: 'Approved' | 'Rejected', remarks?: string, managerName?: string): Promise<LeaveRequest> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<LeaveRequest>(`/leaves/${id}/process`, { status, remarks });
      return resp.data;
    }
    await delay(600);
    const list = MockDb.getLeaves();
    const index = list.findIndex(l => l.id === id);
    if (index === -1) throw new Error('Leave record not found');
    
    const request = list[index];
    request.status = status;
    request.remarks = remarks;
    request.approvedBy = managerName || 'HR Admin';
    
    // If approved, update employee status to 'On Leave' if active today
    if (status === 'Approved') {
      const employees = MockDb.getEmployees();
      const empIndex = employees.findIndex(e => e.id === request.employeeId);
      if (empIndex !== -1) {
        employees[empIndex].status = 'On Leave';
        MockDb.saveEmployees(employees);
      }
    }

    list[index] = request;
    MockDb.saveLeaves(list);
    MockDb.logActivity('leave', `Leave ${status}`, `Leave request from ${request.employeeName} was ${status.toLowerCase()}`, managerName || 'HR Admin');
    return request;
  }
};

export const PayrollService = {
  async getAll(): Promise<Payroll[]> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.get<Payroll[]>('/payroll');
      return resp.data;
    }
    await delay(550);
    return MockDb.getPayroll();
  },

  async create(record: Omit<Payroll, 'id'>): Promise<Payroll> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.post<Payroll>('/payroll', record);
      return resp.data;
    }
    await delay(600);
    const list = MockDb.getPayroll();
    const newRecord: Payroll = {
      ...record,
      id: `PAY-${Math.floor(Math.random() * 9000) + 1000}`
    };
    MockDb.savePayroll([newRecord, ...list]);
    MockDb.logActivity('payroll', 'Payroll Record Formed', `Salary computed for ${newRecord.employeeName} (${newRecord.month})`, 'Finance Treasury');
    return newRecord;
  },

  async updateStatus(id: string, status: 'Paid' | 'Processing' | 'Unpaid'): Promise<Payroll> {
    if (await isLiveBackendWorking()) {
      const resp = await apiClient.put<Payroll>(`/payroll/${id}/status`, { status });
      return resp.data;
    }
    await delay(500);
    const list = MockDb.getPayroll();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payroll record not found');
    
    list[index].status = status;
    if (status === 'Paid') {
      list[index].paymentDate = new Date().toISOString().split('T')[0];
    }
    
    MockDb.savePayroll(list);
    MockDb.logActivity('payroll', 'Salary Disbursed', `Salary status for ${list[index].employeeName} updated to ${status}`, 'Finance Desk');
    return list[index];
  }
};
