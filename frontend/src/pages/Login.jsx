import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

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
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
        <p className="text-center text-sm text-slate-500">No account? <Link className="text-emerald-600 hover:underline" to="/register">Create one</Link></p>
      </form>
    </main>
  );
}
