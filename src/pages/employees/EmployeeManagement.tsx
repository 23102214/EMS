/**
 * Professional Talent Roster Management.
 * Implements filtering, sorting, pagination, profile drawers, and onboard/edit forms.
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { EmployeeService, DepartmentService } from '../../services/api';
import { Employee, Department, UserRole } from '../../types';
import {
  Plus,
  Search,
  Building,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  X,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  MapPin
} from 'lucide-react';

export default function EmployeeManagement() {
  const { success, error: toastError } = useToast();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters, search, pagination, and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptId, setSelectedDeptId] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'id' | 'name' | 'salary' | 'joinDate'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 5;

  // Form / Slide-over and Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [profileViewEmployee, setProfileViewEmployee] = useState<Employee | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Field States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deptId, setDeptId] = useState('');
  const [designation, setDesignation] = useState('');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [salary, setSalary] = useState<number>(50000);
  const [joinDate, setJoinDate] = useState('');
  const [status, setStatus] = useState<Employee['status']>('Active');
  const [gender, setGender] = useState<Employee['gender']>('Male');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  // Loaded callback
  useEffect(() => {
    async function loadData() {
      try {
        const [empData, depData] = await Promise.all([
          EmployeeService.getAll(),
          DepartmentService.getAll()
        ]);
        setEmployees(empData);
        setDepartments(depData);
        if (depData.length > 0) {
          setDeptId(depData[0].id);
        }
      } catch (err: any) {
        toastError('Failed to load payroll roster profiles.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toastError]);

  // Handle setting edit form fields
  const openEditForm = (emp: Employee) => {
    setSelectedEmployee(emp);
    setFirstName(emp.firstName);
    setLastName(emp.lastName);
    setEmail(emp.email);
    setPhone(emp.phone);
    setDeptId(emp.departmentId);
    setDesignation(emp.designation);
    setRole(emp.role);
    setSalary(emp.salary);
    setJoinDate(emp.joinDate);
    setStatus(emp.status);
    setGender(emp.gender);
    setDob(emp.dob);
    setAddress(emp.address);

    setFormMode('EDIT');
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setSelectedEmployee(null);
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    if (departments.length > 0) setDeptId(departments[0].id);
    setDesignation('');
    setRole('EMPLOYEE');
    setSalary(60000);
    setJoinDate(new Date().toISOString().split('T')[0]);
    setStatus('Active');
    setGender('Male');
    setDob('1995-01-01');
    setAddress('');

    setFormMode('ADD');
    setIsFormOpen(true);
  };

  // Submit Handler
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !designation || !joinDate) {
      toastError('Please fill out all mandatory credentials.');
      return;
    }

    const deptObj = departments.find(d => d.id === deptId);
    const departmentName = deptObj ? deptObj.name : 'Unassigned';

    try {
      if (formMode === 'ADD') {
        const newEmpPayload: Omit<Employee, 'id'> = {
          firstName,
          lastName,
          email,
          phone,
          departmentId: deptId,
          departmentName,
          designation,
          role,
          salary,
          joinDate,
          status,
          gender,
          dob,
          address
        };
        const created = await EmployeeService.create(newEmpPayload);
        setEmployees(prev => [...prev, created]);
        success(`Successfully onboarding ${firstName} ${lastName} into ${departmentName}.`);
      } else {
        if (!selectedEmployee) return;
        const updatedPayload: Employee = {
          ...selectedEmployee,
          firstName,
          lastName,
          email,
          phone,
          departmentId: deptId,
          departmentName,
          designation,
          role,
          salary,
          joinDate,
          status,
          gender,
          dob,
          address
        };
        const updated = await EmployeeService.update(selectedEmployee.id, updatedPayload);
        setEmployees(prev => prev.map(e => e.id === selectedEmployee.id ? updated : e));
        success(`Successfully modified security signature of ${firstName} ${lastName}.`);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toastError(err.message || 'Error executing employee mutations.');
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;
    try {
      await EmployeeService.delete(deleteConfirmId);
      setEmployees(prev => prev.filter(e => e.id !== deleteConfirmId));
      success('Employee profile removed successfully from core repositories.');
      setDeleteConfirmId(null);
    } catch (err: any) {
      toastError(err.message || 'Error purging employee credential maps.');
    }
  };

  // Sorting columns triggers
  const handleSort = (field: 'id' | 'name' | 'salary' | 'joinDate') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Memoized query calculations
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Search Box query matches
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        e =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q)
      );
    }

    // Select Department drop
    if (selectedDeptId !== 'ALL') {
      result = result.filter(e => e.departmentId === selectedDeptId);
    }

    // Sort mappings
    result.sort((a, b) => {
      let aVal: any = a[sortField];
      let bVal: any = b[sortField];

      if (sortField === 'name') {
        aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
        bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [employees, searchTerm, selectedDeptId, sortField, sortOrder]);

  // Page sliced variables
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredEmployees.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredEmployees, currentPage]);

  if (isLoading) {
    return (
      <div className="space-y-6" id="emp-skeletons">
        <div className="h-20 bg-white border rounded-2xl animate-pulse"></div>
        <div className="h-96 bg-white border rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="employees-viewport-root">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="employees-header">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">Personnel Directory</h2>
          <p className="text-sm font-sans text-neutral-500">
            Configure dynamic department placement, sign payroll brackets, and manage roster profiles.
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/15 cursor-pointer"
          id="btn-add-employee"
        >
          <Plus className="w-4 h-4" />
          <span>Hire New Candidate</span>
        </button>
      </div>

      {/* Filter and Query Toolbox */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between" id="employees-search-toolbox">
        <div className="relative w-full md:max-w-md flex items-center bg-neutral-50 border border-neutral-200 rounded-xl focus-within:border-emerald-500 transition-all">
          <Search className="absolute left-4 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search employees by key (ID, metadata or matching name)..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent border-none focus:outline-none font-sans"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0" id="filter-wrapper">
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-sans text-neutral-600">
            <Filter className="w-3.5 h-3.5" />
            <span>Division Filter</span>
          </div>
          <select
            value={selectedDeptId}
            onChange={(e) => {
              setSelectedDeptId(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none tracking-tight cursor-pointer focus:border-emerald-500 transition-colors"
          >
            <option value="ALL">Show All Divisions</option>
            {departments.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Roster Data Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden" id="employees-table-container">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-neutral-500">
            <thead className="bg-neutral-50 text-neutral-700 text-xs font-mono uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-4 px-6 cursor-pointer hover:bg-neutral-100" onClick={() => handleSort('id')}>
                  <div className="flex items-center gap-1.5">
                    <span>ID Code</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${sortField === 'id' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-neutral-100" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Employee</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${sortField === 'name' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </div>
                </th>
                <th className="py-4 px-6">Division & Role</th>
                <th className="py-4 px-6 cursor-pointer hover:bg-neutral-100" onClick={() => handleSort('joinDate')}>
                  <div className="flex items-center gap-1.5">
                    <span>Onboard Date</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${sortField === 'joinDate' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                  </div>
                </th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans" id="employees-list-tbody">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No active personnel recorded matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-neutral-50/70 transition-colors" id={`row-${emp.id}`}>
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-neutral-800">{emp.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-sm border border-emerald-100">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 leading-tight">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-neutral-400 font-mono mt-0.5">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-neutral-800 leading-tight flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-neutral-400" />
                          {emp.departmentName}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">{emp.designation}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-neutral-600 font-mono">
                      {new Date(emp.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        emp.status === 'Active'
                          ? 'bg-emerald-55/60 text-emerald-900 border border-emerald-100'
                          : emp.status === 'On Leave'
                          ? 'bg-amber-55/60 text-amber-900 border border-amber-100'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5" id={`actions-${emp.id}`}>
                        <button
                          onClick={() => setProfileViewEmployee(emp)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
                          title="View complete resume profiles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditForm(emp)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors pointer-events-auto"
                          title="Edit corporate assignments"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(emp.id)}
                          className="p-1.5 rounded-lg text-rose-450 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Revoke access authorizations"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paging Actions */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-t border-neutral-100 text-sm" id="roster-paging-section">
            <span className="text-neutral-500 text-xs">
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 transition-colors flex items-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:bg-neutral-50 disabled:opacity-50 transition-colors flex items-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* SLIDE-OVER DRAWER OVERLAY: Add / Edit Employee (Built with high design) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity" id="emp-form-overlay">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-slide-in" id="emp-drawer">
            {/* Form Drawer Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
              <div>
                <h3 className="font-sans font-bold text-lg">{formMode === 'ADD' ? 'Onboard New Candidate' : 'Modify Credentials'}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">Define core department assignments and payment values.</p>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Form Fields */}
            <form onSubmit={handleFormSubmit} className="flex-1 p-6 space-y-5" id="emp-form-element">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="E.g., Emma"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="E.g., Watson"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Enterprise Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="emma.w@enterprise.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Department Assignment *</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Roster Designation *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    placeholder="E.g., Lead Specialist"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">System Clearance *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    <option value="EMPLOYEE">EMPLOYEE (Staff Portal)</option>
                    <option value="MANAGER">MANAGER (Review/Verify)</option>
                    <option value="ADMIN">ADMIN (Full Console Control)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Base Annual Gross ($) *</label>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Onboard Date *</label>
                  <input
                    type="date"
                    required
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Employment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Employee['status'])}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-55"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Gender Identity</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Employee['gender'])}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Birthdate</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Registered Physical Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  placeholder="E.g., 47 maple road..."
                ></textarea>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex items-center justify-end gap-3 bg-neutral-50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-850"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer"
                >
                  {formMode === 'ADD' ? 'Sign & Onboard' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: Individual Details Profile View */}
      {profileViewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" id="emp-profile-view">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col border border-neutral-100" id="profile-card">
            <div className="bg-neutral-900 p-6 text-white flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg text-emerald-400 border border-white/15">
                  {profileViewEmployee.firstName[0]}{profileViewEmployee.lastName[0]}
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg leading-tight">
                    {profileViewEmployee.firstName} {profileViewEmployee.lastName}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-0.5 uppercase tracking-wide">{profileViewEmployee.id}</p>
                </div>
              </div>
              <button onClick={() => setProfileViewEmployee(null)} className="p-1 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 select-none text-sm text-neutral-600" id="profile-fields">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100" id="profile-department-badge">
                <div>
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5" />
                    Assigned Division
                  </p>
                  <p className="font-bold text-neutral-800 mt-1">{profileViewEmployee.departmentName}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" />
                    Corporative Designation
                  </p>
                  <p className="font-bold text-neutral-800 mt-1">{profileViewEmployee.designation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Contact Email
                  </p>
                  <p className="font-medium text-neutral-800">{profileViewEmployee.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Telephone
                  </p>
                  <p className="font-medium text-neutral-800">{profileViewEmployee.phone || 'Not Shared'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Onboard Date
                  </p>
                  <p className="font-medium text-neutral-800">
                    {new Date(profileViewEmployee.joinDate).toDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Gross Remuneration
                  </p>
                  <p className="font-bold text-neutral-800">${profileViewEmployee.salary.toLocaleString()}/year</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-neutral-100">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Gender & DOB
                  </p>
                  <p className="font-medium text-neutral-800">
                    {profileViewEmployee.gender} (DOB: {profileViewEmployee.dob})
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400">Security Access</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100 uppercase mt-1">
                    {profileViewEmployee.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-neutral-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> Registered Address
                </p>
                <p className="text-neutral-700 leading-relaxed font-medium">{profileViewEmployee.address || 'Unregistered Address Mapping'}</p>
              </div>
            </div>

            <div className="bg-neutral-50 px-6 py-4 flex items-center justify-end">
              <button
                onClick={() => setProfileViewEmployee(null)}
                className="px-5 py-2 text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: Destructive actions like Delete Employee */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" id="emp-delete-confirm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 text-center" id="delete-alert-box">
            <h3 className="font-sans font-bold text-lg text-neutral-900 leading-tight">Revoke Account Access</h3>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
              Are you absolute certain you want to purge employee ID <strong>{deleteConfirmId}</strong> from core indices? This action is irreversible and halts security tokens.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-850"
              >
                Dismiss
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md cursor-pointer"
              >
                Revoke & Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
