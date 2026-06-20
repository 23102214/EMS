/**
 * Highly polished toast notification context for crisp success, warning, and error banners.
 */

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `TOAST-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto erase toast after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((msg: string) => toast(msg, 'success'), [toast]);
  const error = useCallback((msg: string) => toast(msg, 'error'), [toast]);
  const warning = useCallback((msg: string) => toast(msg, 'warning'), [toast]);
  const info = useCallback((msg: string) => toast(msg, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      
      {/* Toast Render Node Overlay */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full" id="toast-overlay-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            id={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md animate-slide-in duration-300 transition-all ${
              t.type === 'success'
                ? 'border-emerald-100 bg-emerald-50/90 text-emerald-900 shadow-emerald-100/30'
                : t.type === 'error'
                ? 'border-rose-100 bg-rose-50/90 text-rose-900 shadow-rose-100/30'
                : t.type === 'warning'
                ? 'border-amber-100 bg-amber-50/90 text-amber-900 shadow-amber-100/30'
                : 'border-blue-100 bg-blue-50/90 text-blue-900 shadow-blue-100/30'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
              {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
              {t.type === 'info' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
            </div>
            
            <div className="flex-1 text-sm font-sans font-medium">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="flex-shrink-0 p-0.5 rounded-md hover:bg-black/5 opacity-60 hover:opacity-100 transition-colors"
              id={`close-${t.id}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be called inside ToastProvider bounds');
  }
  return context;
}
