/**
 * Corporate Attendance tracking sheets with filters, stats card, and simulated clock interactions.
 */

import { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { AttendanceService, EmployeeService } from '../../services/api';
import { Attendance, Employee } from '../../types';
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Coffee,
  XCircle,
  TrendingUp,
  LogIn,
  LogOut,
  CalendarDays
} from 'lucide-react';

export default function AttendanceManagement() {
  const { success, error: toastError, info } = useToast();

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [selectedDate, setSelectedDate] = useState('2026-06-04'); // default latest mock date
  const [searchEmployeeName, setSearchEmployeeName] = useState('');

  // Clock Actions State
  const [clockActionEmployeeId, setClockActionEmployeeId] = useState('');

  // Load records
  const loadAttendanceData = async () => {
    try {
      const [attData, empData] = await Promise.all([
        AttendanceService.getAll(),
        EmployeeService.getAll()
      ]);
      setAttendance(attData);
      setEmployees(empData);
    } catch (err) {
      toastError('Failed to fetch attendance calendar records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [toastError]);

  // Intercepting manually clock in / clock out for testing (High Craft prototyping)
  const handleClockIn = async () => {
    if (!clockActionEmployeeId) {
      toastError('Please select an employee to clock in.');
      return;
    }
    try {
      setIsLoading(true);
      await AttendanceService.clockIn(clockActionEmployeeId);
      success('System clock-in timestamped successfully.');
      setClockActionEmployeeId('');
      await loadAttendanceData();
    } catch (err: any) {
      toastError(err.message || 'Error executing digital clock cycle.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async (empId: string) => {
    try {
      setIsLoading(true);
      await AttendanceService.clockOut(empId);
      success('System clock-out timestamped successfully.');
      await loadAttendanceData();
    } catch (err: any) {
      toastError(err.message || 'Error executing digital clock cycle.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered attendance based on query parameters
  const filteredRecords = useMemo(() => {
    let result = [...attendance];

    // Filter by date
    if (selectedDate) {
      result = result.filter(a => a.date === selectedDate);
    }

    // Filter by name query
    if (searchEmployeeName.trim()) {
      const q = searchEmployeeName.toLowerCase();
      result = result.filter(a => a.employeeName.toLowerCase().includes(q));
    }

    return result;
  }, [attendance, selectedDate, searchEmployeeName]);

  // Stats for the SELECTED DATE
  const stats = useMemo(() => {
    const records = attendance.filter(a => a.date === selectedDate);
    const total = records.length;
    
    const present = records.filter(a => a.status === 'Present').length;
    const late = records.filter(a => a.status === 'Late').length;
    const halfDay = records.filter(a => a.status === 'Half-Day').length;
    const absent = records.filter(a => a.status === 'Absent').length;

    const rate = total > 0 ? Math.round(((present + late + halfDay) / total) * 100) : 100;

    return { total, present, late, halfDay, absent, rate };
  }, [attendance, selectedDate]);

  if (isLoading) {
    return (
      <div className="space-y-6" id="att-skeletons">
        <div className="h-16 bg-white border animate-pulse rounded-2xl"></div>
        <div className="h-96 bg-white border animate-pulse rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="attendance-root">
      {/* Header section with fast actions */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4" id="attendance-header">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">Active Duty Sign-ins</h2>
          <p className="text-sm font-sans text-neutral-500">
            Monitor daily clock timing logs, verify work durations, and register overtime credits.
          </p>
        </div>

        {/* Dynamic Action Trigger Panel for Interactive Simulation (High Craft) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white border border-neutral-200/80 p-2.5 rounded-2xl shadow-sm w-full xl:w-auto" id="simulation-clock-card">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans text-neutral-500">
            <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span className="font-semibold uppercase font-mono tracking-wider">Fast Clock Actions:</span>
          </div>
          
          <select
            value={clockActionEmployeeId}
            onChange={(e) => setClockActionEmployeeId(e.target.value)}
            className="px-3 py-1.5 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500 bg-neutral-50"
            id="sim-emp-select"
          >
            <option value="">-- Choose Employee --</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.id})</option>
            ))}
          </select>

          <button
            onClick={handleClockIn}
            className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all cursor-pointer"
            id="btn-trigger-clockin"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Clock In</span>
          </button>
        </div>
      </div>

      {/* Analytics widgets for currently selected date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="duty-stats-grid">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="stat-att-rate">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Sign-In Level</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-slate-800">{stats.rate}%</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">For {selectedDate}</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="stat-att-present">
          <p className="text-[10px] uppercase font-mono tracking-wider text-emerald-700">Present Shifts</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-emerald-800">{stats.present}</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">On Schedule</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="stat-att-late">
          <p className="text-[10px] uppercase font-mono tracking-wider text-amber-700">Late Arrivals</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-amber-800">{stats.late}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">After 09:15 AM</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="stat-att-half">
          <p className="text-[10px] uppercase font-mono tracking-wider text-blue-700">Half-Day Leaves</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-blue-800">{stats.halfDay}</span>
            <Coffee className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block leading-none">Shifts Sliced</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm" id="stat-att-absent">
          <p className="text-[10px] uppercase font-mono tracking-wider text-rose-700">Unexcused Absents</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-sans text-rose-600">{stats.absent}</span>
            <XCircle className="w-4 h-4 text-rose-450" />
          </div>
          <span className="text-[10px] text-rose-600 font-semibold mt-0.5 block leading-none animate-pulse-once">Action Required</span>
        </div>
      </div>

      {/* Date filter & Search panel */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4" id="attendance-filters">
        <div className="relative w-full md:max-w-md flex items-center bg-neutral-50 border border-neutral-200 rounded-xl focus-within:border-emerald-500 transition-colors">
          <User className="absolute left-4 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchEmployeeName}
            onChange={(e) => setSearchEmployeeName(e.target.value)}
            placeholder="Search matching employee in list..."
            className="w-full pl-11 pr-4 py-2.5 text-sm bg-transparent border-none focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto" id="date-select-wrapper">
          <div className="flex items-center gap-1.5 bg-neutral-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans text-slate-600">
            <CalendarDays className="w-4 h-4" />
            <span>Select Calendar Date</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              if (e.target.value) {
                setSelectedDate(e.target.value);
              }
            }}
            className="bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-mono font-bold focus:outline-none cursor-pointer focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Daily Sign-In Sheet Table */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm overflow-hidden" id="attendance-table-hull">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-neutral-500">
            <thead className="bg-neutral-50 text-neutral-700 text-xs font-mono uppercase tracking-wider border-b border-neutral-200">
              <tr>
                <th className="py-4 px-6">Employee ID / Name</th>
                <th className="py-4 px-6">Calendar Date</th>
                <th className="py-4 px-6">Digital Clock-In</th>
                <th className="py-4 px-6">Digital Clock-Out</th>
                <th className="py-4 px-6">Work Cycle Duration</th>
                <th className="py-4 px-6">Status Tag</th>
                <th className="py-4 px-6 text-right">Force Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-sans" id="attendance-list-tbody">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No active attendance sheets stored for the date <strong>{selectedDate}</strong>.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-50/70 transition-all font-sans" id={`attendance-row-${rec.id}`}>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-neutral-900 leading-none">{rec.employeeName}</p>
                        <p className="text-xs text-neutral-400 font-mono mt-0.5">{rec.employeeId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-700">{rec.date}</td>
                    <td className="py-4 px-6">
                      <span className={`font-mono text-xs font-medium ${rec.checkIn ? 'text-slate-800' : 'text-slate-400'}`}>
                        {rec.checkIn || '---'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-mono text-xs font-medium ${rec.checkOut ? 'text-slate-800' : 'text-slate-400'}`}>
                        {rec.checkOut || '---'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-neutral-700">
                      {rec.workHours ? `${rec.workHours} hours` : '---'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        rec.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                          : rec.status === 'Late'
                          ? 'bg-amber-50 text-amber-800 border-amber-100'
                          : rec.status === 'Half-Day'
                          ? 'bg-blue-50 text-blue-800 border-blue-100'
                          : 'bg-rose-50 text-rose-800 border-rose-100'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {rec.checkIn && !rec.checkOut ? (
                        <button
                          onClick={() => handleClockOut(rec.employeeId)}
                          className="flex items-center gap-1 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-[10px] uppercase font-mono px-2.5 py-1 rounded-md transition-all ml-auto pointer-events-auto cursor-pointer"
                          title="Register shift conclusion"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Clock Out</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">- Completed -</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
