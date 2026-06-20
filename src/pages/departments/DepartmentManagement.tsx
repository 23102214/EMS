/**
 * Corporate Department and Organization Chart manager.
 */

import { useState, useEffect, FormEvent } from 'react';
import { useToast } from '../../context/ToastContext';
import { DepartmentService, EmployeeService } from '../../services/api';
import { Department, Employee } from '../../types';
import { Plus, Edit2, Trash2, Building, Users, User, Info, X } from 'lucide-react';

export default function DepartmentManagement() {
  const { success, error: toastError } = useToast();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Department Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [managerId, setManagerId] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const [deps, emps] = await Promise.all([
          DepartmentService.getAll(),
          EmployeeService.getAll()
        ]);
        setDepartments(deps);
        setEmployees(emps);
      } catch (err) {
        toastError('Failed to load corporate organizational parameters.');
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [toastError]);

  const openAddModal = () => {
    setSelectedDept(null);
    setName('');
    setCode('');
    setDescription('');
    setManagerId('');
    setModalMode('ADD');
    setIsModalOpen(true);
  };

  const openEditModal = (dept: Department) => {
    setSelectedDept(dept);
    setName(dept.name);
    setCode(dept.code);
    setDescription(dept.description);
    setManagerId(dept.managerId || '');
    setModalMode('EDIT');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code || !description) {
      toastError('Please fill out all department parameters.');
      return;
    }

    // Resolve Manager Name from managerId
    const managerObj = employees.find(e => e.id === managerId);
    const managerName = managerObj ? `${managerObj.firstName} ${managerObj.lastName}` : 'Unassigned';

    try {
      if (modalMode === 'ADD') {
        const payload = { name, code, description, managerId, managerName };
        const created = await DepartmentService.create(payload);
        setDepartments(prev => [...prev, created]);
        success(`Successfully designated the ${name} (${code}) department division.`);
      } else {
        if (!selectedDept) {
          toastError('No active target department detected.');
          return;
        }
        const payload: Department = {
          ...selectedDept,
          name,
          code,
          description,
          managerId,
          managerName
        };
        const updated = await DepartmentService.update(selectedDept.id, payload);
        setDepartments(prev => prev.map(d => d.id === selectedDept.id ? updated : d));
        success(`Successfully customized structural definitions for ${name}.`);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toastError(err.message || 'Error executing structural changes.');
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await DepartmentService.delete(deleteConfirmId);
      setDepartments(prev => prev.filter(d => d.id !== deleteConfirmId));
      success('Vacancy marked and department division disbanding was finalized.');
      setDeleteConfirmId(null);
    } catch (err: any) {
      toastError(err.message || 'Error processing department disbanding procedures.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6" id="dep-skeletons">
        <div className="h-16 bg-white border animate-pulse rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-white border animate-pulse rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="departments-viewport-root">
      {/* Header with quick creation access */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="departments-header">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">Organization Divisions</h2>
          <p className="text-sm font-sans text-neutral-500">
            Configure core specialized operational domains, delegate general managers, and check division headcounts.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/15 cursor-pointer"
          id="btn-add-dept"
        >
          <Plus className="w-4 h-4" />
          <span>Declare New Division</span>
        </button>
      </div>

      {/* Grid List representation of corporate divisions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans" id="departments-grid">
        {departments.map((dept) => {
          // Double verify dynamic count inside local state array
          const activeHeadcount = employees.filter(e => e.departmentId === dept.id).length;
          
          return (
            <div
              key={dept.id}
              id={`dept-card-${dept.id}`}
              className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Card Upper Segment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-lg">
                    <Building className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-mono font-bold text-slate-800 tracking-tight">{dept.code}</span>
                  </div>
                  
                  {/* Actions buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                      title="Edit division details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(dept.id)}
                      className="p-1 rounded-md text-slate-405 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Disband vacuumer department"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-neutral-900 text-base leading-tight">{dept.name}</h3>
                  <p className="text-xs text-neutral-500 leading-normal line-clamp-2 h-8">{dept.description}</p>
                </div>
              </div>

              {/* Card Lower Segment */}
              <div className="mt-5 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-xs text-neutral-600">
                <div className="flex items-center gap-1.5 leading-none">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="font-mono text-neutral-450 uppercase block text-[9px] leading-none">Headcount</span>
                    <strong className="text-neutral-850 block mt-1 leading-none text-sm">{activeHeadcount} Assigned</strong>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 leading-none">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="font-mono text-neutral-455 uppercase block text-[9px] leading-none">Leader</span>
                    <span className="text-neutral-800 block mt-1 leading-none truncate font-semibold w-24">
                      {dept.managerName || 'Hold Vacant'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STYLISH MODAL: Add / Edit Department */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" id="dept-modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col border border-neutral-100 font-sans" id="dept-form-box">
            <div className="p-6 border-b border-rose-100 flex items-center justify-between bg-neutral-900 text-white">
              <div>
                <h3 className="font-bold text-base">{modalMode === 'ADD' ? 'Declare New Division' : 'Customize Department'}</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">Define core specialty boundaries and hierarchy leaders.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4" id="dept-form">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Division Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Business Analytics"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Corporate Code (Unique Initials) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="E.g., BUA"
                  maxLength={5}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm font-mono font-bold"
                  disabled={modalMode === 'EDIT'} // Keep code immutable
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Leader Assignment / Manager</label>
                <select
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none text-sm cursor-pointer"
                >
                  <option value="">-- No Leader Delegated --</option>
                  {employees.map(e => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.designation})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase">Mission Statement & Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-neutral-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                  placeholder="Briefly state division functional targets..."
                ></textarea>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3 bg-neutral-50 -mx-6 -mb-6 p-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-850"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer"
                >
                  {modalMode === 'ADD' ? 'Validate & File' : 'Save Definition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISBAND CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4" id="dept-delete-overlay">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 text-center font-sans" id="dept-delete-box">
            <h3 className="font-bold text-lg text-neutral-900 leading-tight">Disband Corporate Division</h3>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
              Are you absolute certain you want to purge department code <strong>{deleteConfirmId}</strong>?
            </p>
            <div className="mt-2 text-xs text-slate-400 bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2 text-left leading-normal" id="rules-warn">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>Safety Rule: System prevents disbanding divisions that hold active assigned personnel headcount. Vaccinate divisions first.</span>
            </div>
            
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md cursor-pointer animate-pulse-once"
              >
                Disband
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
