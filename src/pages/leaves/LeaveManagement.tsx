/**
 * Corporate Leave Management Console.
 * Implements leave balances, request review, and filing forms with instant approval handlers.
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LeaveService, EmployeeService } from '../../services/api';
import { LeaveRequest, Employee, LeaveType } from '../../types';
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  FilePlus2,
  ListTodo,
  Smile,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Plus
} from 'lucide-react';

export default function LeaveManagement() {
  const { user } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');

  // New Application Drawer / Accordion
  const [isApplyDrawerOpen, setIsApplyDrawerOpen] = useState(false);

  // Apply Form Inputs
  const [applyEmpId, setApplyEmpId] = useState('');
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Process Requests Modal/Action
  const [processingLeaveId, setProcessingLeaveId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<'Approved' | 'Rejected'>('Approved');
  const [remarks, setRemarks] = useState('');

  // Sample static leave balances for demonstration
  const leaveBalances = {
    Annual: 18,
    Sick: 12,
    Casual: 10,
    CasualUsed: 3,
    AnnualUsed: 6,
    SickUsed: 1
  };

  const loadLeavesData = async () => {
    try {
      const [lData, eData] = await Promise.all([
        LeaveService.getAll(),
        EmployeeService.getAll()
      ]);
      setLeaves(lData);
      setEmployees(eData);
    } catch (err) {
      toastError('Failed to fetch corporate leave applications.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeavesData();
  }, [toastError]);

  // Handle new leave application
  const handleApplyLeave = async (e: FormEvent) => {
    e.preventDefault();
    if (!applyEmpId || !startDate || !endDate || !reason) {
      toastError('Please fulfill all required attributes.');
      return;
    }

    const employeeObj = employees.find(emp => emp.id === applyEmpId);
    if (!employeeObj) {
      toastError('Invalid employee target code selected.');
      return;
    }

    // Compute Duration Days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    if (durationMs < 0) {
      toastError('End Date cannot occur prior to Start Date.');
      return;
    }
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24)) + 1;

    try {
      setIsLoading(true);
      const newLeavePayload = {
        employeeId: applyEmpId,
        employeeName: `${employeeObj.firstName} ${employeeObj.lastName}`,
        departmentName: employeeObj.departmentName,
        leaveType,
        startDate,
        endDate,
        durationDays,
        reason
      };

      await LeaveService.apply(newLeavePayload);
      success('Leave application registered in queue pending review.');
      
      // Clear forms
      setApplyEmpId('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setIsApplyDrawerOpen(false);
      
      await loadLeavesData();
    } catch (err: any) {
      toastError(err.message || 'Error executing leave transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  // Process approval / rejection action modal submission
  const openProcessAction = (id: string, action: 'Approved' | 'Rejected') => {
    setProcessingLeaveId(id);
    setProcessingAction(action);
    setRemarks('');
  };

  const handleProcessSubmit = async () => {
    if (!processingLeaveId) return;
    try {
      setIsLoading(true);
      const managerName = user ? `${user.firstName} ${user.lastName}` : 'HR Director';
      await LeaveService.processRequest(processingLeaveId, processingAction, remarks, managerName);
      
      success(`Leave filing is marked ${processingAction.toUpperCase()}.`);
      setProcessingLeaveId(null);
      await loadLeavesData();
    } catch (err: any) {
      toastError(err.message || 'Error processing queue ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter computations
  const filteredLeaves = useMemo(() => {
    let result = [...leaves];
    if (filterStatus !== 'ALL') {
      result = result.filter(l => l.status === filterStatus);
    }
    return result;
  }, [leaves, filterStatus]);

  if (isLoading) {
    return (
      <div className="space-y-6" id="leave-skeleton">
        <div className="h-16 bg-white border animate-pulse rounded-2xl"></div>
        <div className="h-96 bg-white border animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="leaves-root">
      {/* Header with trigger drawer toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="leaves-header">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">Time Off Registry</h2>
          <p className="text-sm font-sans text-neutral-500">
            Audit absence records, sign approvals, and monitor remaining leave budgets.
          </p>
        </div>
        <button
          onClick={() => setIsApplyDrawerOpen(!isApplyDrawerOpen)}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          id="btn-toggle-apply-drawer"
        >
          {isApplyDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isApplyDrawerOpen ? 'Collapse Form' : 'File Leave Claim'}</span>
        </button>
      </div>

      {/* Leave balance grids */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="leave-balances-grid">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm" id="balance-annual">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Annual Vacation Budget</h4>
            <CalendarDays className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-sans text-neutral-800">{leaveBalances.Annual} days</span>
            <span className="text-xs text-neutral-400 font-medium">({leaveBalances.AnnualUsed} used)</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm" id="balance-sick">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Sick Absence Leave</h4>
            <Smile className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-sans text-neutral-800">{leaveBalances.Sick} days</span>
            <span className="text-xs text-neutral-400 font-medium">({leaveBalances.SickUsed} used)</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm" id="balance-casual">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Casual Personal Leave</h4>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold font-sans text-neutral-800">{leaveBalances.Casual} days</span>
            <span className="text-xs text-neutral-400 font-medium font-medium">({leaveBalances.CasualUsed} used)</span>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE DRAWER: Create / Apply for Leave Form with full validation */}
      {isApplyDrawerOpen && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-md transition-all animate-slide-in" id="apply-leave-drawer">
          <div className="flex items-center justify-between mb-5 border-b border-slate-15 pb-3">
            <h3 className="font-bold text-base text-neutral-900 flex items-center gap-1.5">
              <Plus className="w-5 h-5 text-emerald-600" />
              Submit Time-Off Request
            </h3>
            <button
              onClick={() => setIsApplyDrawerOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-800 rounded-md hover:bg-neutral-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleApplyLeave} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans" id="form-apply">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-600 uppercase">Employee Target Code *</label>
              <select
                required
                value={applyEmpId}
                onChange={(e) => setApplyEmpId(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-55 text-sm"
              >
                <option value="">-- Choose Beneficiary --</option>
                {employees.map(e => (
                  <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.departmentName})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-600 uppercase">Leave Domain Category *</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl text-sm"
              >
                <option value="Annual">Annual Vacation</option>
                <option value="Sick">Sick Recuperation</option>
                <option value="Casual">Casual General</option>
                <option value="Unpaid">Unpaid Personal</option>
                <option value="Maternity">Maternity Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Start Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-1.5 border border-neutral-200 rounded-xl text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">End Date *</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-1.5 border border-neutral-200 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-neutral-600 uppercase">Absence Justification and Details *</label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex. Scheduled medical procedure or family engagement..."
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none text-sm"
              />
            </div>

            <div className="lg:col-span-3 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsApplyDrawerOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-850"
              >
                Dismiss Form
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer"
              >
                File Claim
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests table with status Filter Tabs */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden" id="leave-table-container">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200/80 px-6 py-4 bg-neutral-50 font-sans" id="tab-headers">
          {(['ALL', 'Pending', 'Approved', 'Rejected'] as const).map((statusVal) => (
            <button
              key={statusVal}
              onClick={() => setFilterStatus(statusVal)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                filterStatus === statusVal
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-550 hover:bg-neutral-100'
              }`}
            >
              {statusVal} Requests
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-neutral-500">
            <thead className="bg-neutral-50 text-neutral-700 text-xs font-mono uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-4 px-6">Beneficiary</th>
                <th className="py-4 px-6">Leave Category / Reason</th>
                <th className="py-4 px-6">Calendar Dates</th>
                <th className="py-4 px-6">Filing Span</th>
                <th className="py-4 px-6">Review Status</th>
                <th className="py-4 px-6 text-right font-mono">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans" id="leaves-list-tbody">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans">
                    No active leave filings matches status tab <strong>{filterStatus}</strong>.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-neutral-50/70 transition-all font-sans" id={`leave-row-${req.id}`}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-neutral-900 leading-none">{req.employeeName}</p>
                        <p className="text-xs text-neutral-450 mt-0.5">{req.departmentName}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-neutral-100 text-neutral-800">
                          {req.leaveType}
                        </span>
                        <p className="text-xs text-slate-500 truncate mt-1" title={req.reason}>{req.reason}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-700">
                      {req.startDate} to {req.endDate}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-800 font-semibold">
                      {req.durationDays} working days
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : req.status === 'Pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-100'
                          : 'bg-rose-50 text-rose-800 border-rose-100'
                      }`}>
                        {req.status === 'Approved' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                        {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                        {req.status === 'Pending' && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                        <span>{req.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-1.5" id={`leave-actions-${req.id}`}>
                          <button
                            onClick={() => openProcessAction(req.id, 'Approved')}
                            className="text-xs px-2.5 py-1.5 bg-emerald-65/50 border border-emerald-200 text-emerald-900 font-bold hover:bg-emerald-600 hover:text-white rounded-lg transition-colors pointer-events-auto cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openProcessAction(req.id, 'Rejected')}
                            className="text-xs px-2.5 py-1.5 bg-rose-65/50 border border-rose-200 text-rose-900 font-bold hover:bg-rose-600 hover:text-white rounded-lg transition-colors pointer-events-auto cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-xs text-neutral-450 italic leading-none">by {req.approvedBy || 'Admin'}</p>
                          {req.remarks && <p className="text-[10px] text-neutral-400 mt-1 truncate max-w-[120px] ml-auto">"{req.remarks}"</p>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE ACTION APPROVAL/REJECTION DIALOG MODAL */}
      {processingLeaveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" id="leave-process-modal">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 font-sans" id="leave-action-dialog">
            <h3 className="font-bold text-lg text-neutral-900 leading-tight">
              {processingAction === 'Approved' ? 'Authorise Leave Filing' : 'Decline Leave Filing'}
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              Submit review comments regarding ticket <strong>{processingLeaveId}</strong> to notify the beneficiary.
            </p>

            <div className="mt-4 space-y-1.5 text-left">
              <label className="text-xs font-semibold text-neutral-600 uppercase">Reviewers Remarks and Feedback</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-700 text-sm"
                placeholder="Ex. Approved. Transition your deliverables to Alex..."
              ></textarea>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 -mx-6 -mb-6 p-6 bg-slate-50 rounded-b-2xl">
              <button
                onClick={() => setProcessingLeaveId(null)}
                className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-850"
              >
                Dismiss
              </button>
              <button
                onClick={handleProcessSubmit}
                className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md cursor-pointer ${
                  processingAction === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                }`}
              >
                Commit Review ({processingAction})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
