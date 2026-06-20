/**
 * Corporate Employee sign-in card with validation states and quickfill presets.
 */

import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Extract return path or defaults to dashboard
  const from = location.state?.from?.pathname || '/';

  const validateForm = () => {
    let isValid = true;
    setEmailError('');

    if (!email) {
      setEmailError('Corporate Email Address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please key in a valid enterprise email format');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      success('Identification Verified. Loading secure session dashboard.');
      navigate(from, { replace: true });
    } catch (err: any) {
      toastError(err.message || 'Verification failure. Please check input parameters.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (roleEmail: string) => {
    setEmail(roleEmail);
    setPassword('admin123');
    setEmailError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4" id="login-layout-root">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md bg-slate-800/95 border border-slate-700/80 rounded-2xl p-8 shadow-2xl backdrop-blur-md" id="login-card-hull">
        {/* Header Branding */}
        <div className="text-center mb-8" id="login-header-group">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white font-bold text-3xl mb-4" id="logo-badge">
            E
          </div>
          <h1 className="font-sans font-bold text-2xl text-white tracking-tight">EMS Enterprise</h1>
          <p className="text-sm font-sans text-slate-400 mt-1">HR & Corporate Employee Information Desk</p>
        </div>

        {/* Corporate login form */}
        <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
          <div className="space-y-1.5">
            <label className="text-xs font-sans font-semibold text-slate-300 tracking-wider uppercase">Enterprise Email</label>
            <div className={`relative flex items-center bg-slate-900 border ${emailError ? 'border-rose-500' : 'border-slate-700'} rounded-xl transition-all focus-within:border-emerald-500`}>
              <Mail className="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                disabled={isSubmitting}
                placeholder="sarah.j@enterprise.com"
                className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm font-sans focus:outline-none rounded-xl"
              />
            </div>
            {emailError && (
              <p className="text-xs text-rose-400 ml-1 font-sans">{emailError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-sans font-semibold text-slate-300 tracking-wider uppercase">Security Key / Password</label>
            </div>
            <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl transition-all focus-within:border-emerald-500">
              <Lock className="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-transparent text-white placeholder-slate-500 text-sm font-sans focus:outline-none rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-600/50 text-white font-sans font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-emerald-600/10 cursor-pointer active:scale-[0.98] transition-all"
            id="login-submit-button"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            ) : (
              <>
                <span>Access Management Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Fill Assist (Aesthetic and Functional UX) */}
        <div className="mt-8 pt-6 border-t border-slate-700/60" id="quick-fill-panel">
          <p className="text-[10px] uppercase font-mono font-semibold tracking-wider text-slate-500 flex items-center gap-1.5 mb-3 justify-center">
            <ShieldCheck className="w-4 h-4 text-slate-500" />
            Prototype Quick Access Fast-Fill
          </p>
          <div className="grid grid-cols-2 gap-2" id="quick-buttons-row">
            <button
              onClick={() => handleQuickFill('admin@enterprise.com')}
              className="px-3 py-2 text-xs font-sans font-medium text-slate-300 bg-slate-950/40 border border-slate-700 hover:border-emerald-500 rounded-lg text-center transition-colors hover:text-white cursor-pointer"
            >
              VP (Admin)
            </button>
            <button
              onClick={() => handleQuickFill('sarah.j@enterprise.com')}
              className="px-3 py-2 text-xs font-sans font-medium text-slate-300 bg-slate-950/40 border border-slate-700 hover:border-emerald-500 rounded-lg text-center transition-colors hover:text-white cursor-pointer"
            >
              Sarah (Admin)
            </button>
            <button
              onClick={() => handleQuickFill('david.m@enterprise.com')}
              className="px-3 py-2 text-xs font-sans font-medium text-slate-300 bg-slate-950/40 border border-slate-700 hover:border-emerald-500 rounded-lg text-center transition-colors hover:text-white cursor-pointer col-span-2"
            >
              David Mercer (HR Manager)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
