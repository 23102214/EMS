/**
 * Corporate Payroll & Salaries Ledger module.
 * Displays salary calculations and net pay, with fast disbursement triggers.
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { PayrollService, EmployeeService } from '../../services/api';
import { Payroll, Employee } from '../../types';
import {
  Banknote,
  CheckCircle,
  Clock,
  Plus,
  TrendingDown,
  Info,
  CreditCard,
  User,
  Calculator,
  ChevronDown,
  X
} from 'lucide-react';

export default function PayrollManagement() {
  const { success, error: toastError, info } = useToast();

  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedMonth, setSelectedMonth] = useState('May');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Paid' | 'Processing' | 'Unpaid'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // New Record Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calcEmpId, setCalcEmpId] = useState('');
  const [allowances, setAllowances] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);

  const loadPayrollLogs = async () => {
    try {
      const [pData, eData] = await Promise.all([
        PayrollService.getAll(),
        EmployeeService.getAll()
      ]);
      setPayroll(pData);
      setEmployees(eData);
    } catch (err) {
      toastError('Failed to fetch corporate payroll disbursement logs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayrollLogs();
  }, [toastError]);

  // Handle manual salary calculation for an employee
  const handleCalculatePayroll = async (e: FormEvent) => {
    e.preventDefault();
    if (!calcEmpId) {
      toastError('Please choose target employee.');
      return;
    }

    const empObj = employees.find(emp => emp.id === calcEmpId);
    if (!empObj) {
      toastError('Invalid employee reference.');
      return;
    }

    // Check if payroll already created for this month + employee
    const duplicate = payroll.find(p => p.employeeId === calcEmpId && p.month === selectedMonth);
    if (duplicate) {
      toastError(`Payroll ledger of ${selectedMonth} already filed for this recipient.`);
      return;
    }

    // Compute month base salary segment (Base / 12)
    const baseSalary = Math.round(empObj.salary / 12);
    const netSalary = baseSalary + allowances - deductions;

    try {
      setIsLoading(true);
      await PayrollService.create({
        employeeId: calcEmpId,
        employeeName: `${empObj.firstName} ${empObj.lastName}`,
        departmentName: empObj.departmentName,
        designation: empObj.designation,
        month: selectedMonth,
        year: 2026,
        baseSalary,
        allowances,
        deductions,
        netSalary,
        status: 'Unpaid'
      });

      success('Payroll ledger drafted in transaction logs.');
      setCalcEmpId('');
      setAllowances(0);
      setDeductions(0);
      setIsModalOpen(false);
      await loadPayrollLogs();
    } catch (err: any) {
      toastError(err.message || 'Error executing ledgers filing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Immediate disburse triggers (High Craft instant action simulation)
  const executeDisburseSalary = async (id: string) => {
    try {
      setIsLoading(true);
      await PayrollService.updateStatus(id, 'Paid');
      success('Net salaries disbursed and bank clearing code recorded.');
      await loadPayrollLogs();
    } catch (err: any) {
      toastError(err.message || 'Error executing digital clearance.');
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized overall indicators computations
  const metrics = useMemo(() => {
    const totalDisbursed = payroll
      .filter(p => p.status === 'Paid')
      .reduce((sum, curr) => sum + curr.netSalary, 0);

    const pendingReviewVolume = payroll
      .filter(p => p.status === 'Processing' || p.status === 'Unpaid')
      .reduce((sum, curr) => sum + curr.netSalary, 0);

    const paidCount = payroll.filter(p => p.status === 'Paid').length;
    const unpaidCount = payroll.filter(p => p.status === 'Unpaid' || p.status === 'Processing').length;

    return { totalDisbursed, pendingReviewVolume, paidCount, unpaidCount };
  }, [payroll]);

  // Filter compilations
  const filteredLedgers = useMemo(() => {
    let result = [...payroll].filter(p => p.month === selectedMonth);

    // Apply quick search query matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.employeeName.toLowerCase().includes(q));
    }

    // Apply status filtering
    if (filterStatus !== 'ALL') {
      result = result.filter(p => p.status === filterStatus);
    }

    return result;
  }, [payroll, selectedMonth, searchQuery, filterStatus]);

  if (isLoading) {
    return (
      <div className="space-y-6" id="payroll-skeleton">
        <div className="h-16 bg-white border animate-pulse rounded-2xl"></div>
        <div className="h-96 bg-white border animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="payroll-root">
      {/* Header with trigger button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="payroll-header">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">Financial Treasury Ledgers</h2>
          <p className="text-sm font-sans text-neutral-500">
            Reconcile staff annual gross rates, approve custom allowances or deductions, and release payments.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/15 cursor-pointer"
          id="btn-trigger-payroll-calculator"
        >
          <Plus className="w-4 h-4" />
          <span>Draft Payroll Sheet</span>
        </button>
      </div>

      {/* Summary card segments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="payroll-ledger-grids">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="disbursement-sum">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total May Disbursed</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-emerald-800">${metrics.totalDisbursed.toLocaleString()}</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">Net cleared payouts</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="pending-sum">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Total Draft Backlog</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-neutral-800">${metrics.pendingReviewVolume.toLocaleString()}</span>
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">Awaiting clearance</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="cleared-count">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Paid Ledgers Count</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-slate-800">{metrics.paidCount} records</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">Reconciled successfully</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="pending-count">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-401 text-rose-700">Awaiting Dispatch</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-rose-700">{metrics.unpaidCount} records</span>
            <CreditCard className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block leading-none uppercase">Action Awaited</span>
        </div>
      </div>

      {/* Selector and Filter group */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 font-sans" id="payroll-fiters-toolbox">
        <div className="relative w-full md:max-w-md flex items-center bg-neutral-50 border border-neutral-200 rounded-xl focus-within:border-emerald-500 transition-colors">
          <User className="absolute left-4 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search matching employee payroll records..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent border-none focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0" id="month-and-status-filters">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none cursor-pointer focus:border-emerald-500 transition-colors"
          >
            <option value="May">May 2026</option>
            <option value="January">January 2026</option>
            <option value="February">February 2026</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none cursor-pointer focus:border-emerald-500 transition-colors"
          >
            <option value="ALL">Show All Statuses</option>
            <option value="Paid">Paid Out</option>
            <option value="Processing">Processing</option>
            <option value="Unpaid">Unpaid / Draft</option>
          </select>
        </div>
      </div>

      {/* Main ledger Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden" id="payroll-table-box">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-neutral-500">
            <thead className="bg-neutral-50 text-neutral-700 text-xs font-mono uppercase tracking-wider border-b border-neutral-100">
              <tr>
                <th className="py-4 px-6">Assigned Beneficiary</th>
                <th className="py-4 px-6">Salary Term</th>
                <th className="py-4 px-6">Base Salary</th>
                <th className="py-4 px-6">Allowance Credits</th>
                <th className="py-4 px-6">Deductions Debit</th>
                <th className="py-4 px-6">Net Clear Paid</th>
                <th className="py-4 px-6 text-center">Receipt Status</th>
                <th className="py-4 px-6 text-right font-mono">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans" id="payroll-list-tbody">
              {filteredLedgers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No payroll summaries filed under month term <strong>{selectedMonth}</strong> matches filters.
                  </td>
                </tr>
              ) : (
                filteredLedgers.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50/70 transition-all font-sans" id={`pay-row-${pay.id}`}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-neutral-900 leading-none">{pay.employeeName}</p>
                        <p className="text-xs text-neutral-450 mt-0.5">{pay.departmentName} ({pay.designation})</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-700">
                      {pay.month} {pay.year}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-800">
                      ${pay.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-emerald-700 font-medium">
                      +${pay.allowances.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-rose-600 font-medium">
                      -${pay.deductions.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 font-mono text-sm font-bold text-neutral-900">
                      ${pay.netSalary.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        pay.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : pay.status === 'Processing'
                          ? 'bg-amber-50 text-amber-800 border-amber-100 animate-pulse'
                          : 'bg-rose-50 text-rose-800 border-rose-100'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {pay.status !== 'Paid' ? (
                        <button
                          onClick={() => executeDisburseSalary(pay.id)}
                          className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
                          id={`disburse-${pay.id}`}
                        >
                          Disburse
                        </button>
                      ) : (
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-medium text-slate-400 uppercase block">Reconciled</span>
                          {pay.paymentDate && <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">{pay.paymentDate}</span>}
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

      {/* STYLISH MODAL DIALOG: Draft Payroll Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" id="payroll-draft-modal-overlay">
          <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col border border-neutral-100 font-sans animate-slide-in" id="payroll-form-modal">
            <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-neutral-900 text-white">
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  <Calculator className="w-5 h-5 text-emerald-500" />
                  Draft Monthly Payslip
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">Draft salaries computations, calculate allowances & tax bands.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCalculatePayroll} className="p-6 space-y-4" id="payroll-calculator-form">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Target Recipient *</label>
                <select
                  required
                  value={calcEmpId}
                  onChange={(e) => setCalcEmpId(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none text-sm cursor-pointer bg-neutral-50"
                >
                  <option value="">-- Choose Recipient Profile --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} (${e.salary.toLocaleString()}/yr)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Allowance ($)</label>
                  <input
                    type="number"
                    value={allowances}
                    onChange={(e) => setAllowances(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-55 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Deduction Tax ($)</label>
                  <input
                    type="number"
                    value={deductions}
                    onChange={(e) => setDeductions(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-55 text-sm"
                  />
                </div>
              </div>

              <div className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl flex items-start gap-2 text-xs text-neutral-500 leading-normal" id="payroll-warn">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Default Base Salary calculates as raw pro-rated segment of annual contract packages (Base / 12 months) before allowances.</span>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 bg-neutral-50 -mx-6 -mb-6 p-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-850"
                >
                  Dismiss Form
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer animate-pulse-once"
                >
                  Verify Calculations & Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
