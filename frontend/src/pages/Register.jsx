import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (event) => {
  event.preventDefault();
  setSubmitting(true);
  try {
    const result = await register(form);
    if (result.success) {
      toast.success('Account created! 🎉');
      navigate('/dashboard', { replace: true });
    } else {
      toast.error(result.message || 'Unable to create account');
    }
  } finally {
    setSubmitting(false);
  }
};

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <div>
          <img src="/logo.jpeg" alt="SoloHub" className="mx-auto mb-6 h-24 w-full object-contain" />
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-slate-500">Start managing your freelance work with SoloHub.</p>
        </div>
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-slate-700">Full name</label>
          <input
            id="register-name"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="text"
            autoComplete="name"
            maxLength={120}
            required
            value={form.fullName}
            onChange={(event) => setForm({ ...form, fullName: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-slate-700">Email</label>
          <input
            id="register-email"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </div>
        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative mt-1">
            <input
              id="register-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-12"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              minLength={8}
              required
              aria-describedby="password-requirement"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-slate-500 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
          <p id="password-requirement" className="mt-1.5 text-xs text-slate-500">Use at least 8 characters.</p>
        </div>
        <button 
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60" 
          disabled={submitting}
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already registered? <Link className="text-emerald-600 hover:underline" to="/login">Sign in</Link>
        </p>
      </form>
    </main>
  );
}
