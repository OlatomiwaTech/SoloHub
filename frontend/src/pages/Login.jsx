import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to log in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <div>
          <img src="/logo.jpeg" alt="SoloHub" className="mx-auto mb-6 h-24 w-full object-contain" />
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-slate-500">Sign in to your SoloHub account.</p>
        </div>
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-slate-700">Email</label>
          <input
            id="login-email"
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
          <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">Password</label>
          <div className="relative mt-1">
            <input
              id="login-password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-12"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
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
        </div>
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-slate-500">No account? <Link className="text-emerald-600 hover:underline" to="/register">Create one</Link></p>
      </form>
    </main>
  );
}
