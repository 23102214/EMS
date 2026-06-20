/**
 * Personal profile dashboard for active user context.
 * Features info syncing update forms and credential security password changers.
 */

import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, User, Shield, KeyRound, CheckCircle, Smartphone } from 'lucide-react';

export default function UserProfile() {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState<'INFO' | 'SECURITY'>('INFO');

  // Biography Profile Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isUpdatingBio, setIsUpdatingBio] = useState(false);

  // Security Password Form Fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);

  // Propagate user details from context
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleBioSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toastError('Mandatory profile details cannot be empty.');
      return;
    }

    try {
      setIsUpdatingBio(true);
      await updateProfile({
        firstName,
        lastName,
        email,
        phone,
        address
      });
      success('Personal HR records synchronized successfully.');
    } catch (err: any) {
      toastError(err.message || 'Error executing records synchronization.');
    } finally {
      setIsUpdatingBio(false);
    }
  };

  const handleCredsSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toastError('All password input parameters are mandatory.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toastError('Confirm security key does not match New security key.');
      return;
    }

    try {
      setIsUpdatingCreds(true);
      await changePassword(oldPassword, newPassword);
      success('Auth credentials updated. New credentials enabled.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toastError(err.message || 'Error executing credentials modification.');
    } finally {
      setIsUpdatingCreds(false);
    }
  };

  if (!user) {
    return (
      <div className="py-12 text-center text-slate-500 font-sans" id="unauth-profile">
        Please sign in to configure personalized profile parameters.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans" id="profile-root">
      {/* Header Info Banner displaying status cards */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6" id="profile-headline-box">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'}
          referrerPolicy="no-referrer"
          alt="User avatar preview"
          className="w-24 h-24 rounded-2xl object-cover border border-neutral-200"
        />
        <div className="flex-1 text-center md:text-left space-y-1">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <h2 className="font-bold text-2xl text-slate-900 tracking-tight">{user.firstName} {user.lastName}</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-55 border border-emerald-100 uppercase text-emerald-900">
              {user.role} Authority
            </span>
          </div>
          <p className="text-sm text-neutral-500 font-medium">
            {user.designation || 'Staff Colleague'} • {user.department || 'Division Unassigned'}
          </p>
          <p className="text-xs font-mono text-neutral-400">Account ID: {user.id || 'N/A'}</p>
        </div>
      </div>

      {/* Tabs list structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start" id="profile-panes">
        {/* Tab Selector column */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-sm space-y-1 flex flex-row lg:flex-col overflow-x-auto pb-3 lg:pb-3" id="tab-nav">
          <button
            onClick={() => setActiveTab('INFO')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'INFO'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Information Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'SECURITY'
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Update Security Passkeys</span>
          </button>
        </div>

        {/* Form Container Column */}
        <div className="lg:col-span-3 bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm" id="tab-content-sheet">
          {activeTab === 'INFO' ? (
            <div className="space-y-6" id="personal-credentials-form">
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">Biography Records</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Edit biography details synchronizing automatically across personal directories.</p>
              </div>

              <form onSubmit={handleBioSubmit} className="space-y-5" id="form-bio-update">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-600 uppercase">First Name *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-700 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-600 uppercase">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-700 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-600 uppercase flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-neutral-255 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-700 transition-all font-mono font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-600 uppercase flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
                      Mobile Telephone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-700 transition-all font-mono font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-600 uppercase flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    Physical Registered Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex. 422 Pine Ave, Seattle, WA"
                    className="w-full px-4 py-2.5 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-75 transition-all font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingBio}
                    className="flex items-center gap-1 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-500/50 text-white font-bold text-xs uppercase tracking-wide rounded-xl shadow-lg shadow-emerald-600/10 transition-all cursor-pointer"
                    id="submit-bio-update-btn"
                  >
                    {isUpdatingBio ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Save Biography Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6" id="personal-security-form">
              <div>
                <h3 className="font-bold text-lg text-slate-900 leading-tight">Security Passkeys</h3>
                <p className="text-xs text-neutral-500 mt-0.5">Modify system security credentials to refresh dynamic session authentication.</p>
              </div>

              <form onSubmit={handleCredsSubmit} className="space-y-5 shadow-sm p-[1px]" id="form-security-update">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600 uppercase">Current Account Password *</label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 uppercase">New Security Passkey *</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600 uppercase">Confirm New Passkey *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 text-sm border border-neutral-250 bg-neutral-50 rounded-xl focus:bg-white focus:outline-none font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUpdatingCreds}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-80 shadow-md text-white font-bold text-xs uppercase tracking-wide rounded-xl cursor-pointer"
                    id="submit-security-btn"
                  >
                    {isUpdatingCreds ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>Update Security Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
