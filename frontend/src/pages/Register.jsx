import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1 text-slate-500">Start managing your freelance work with SoloHub.</p>
        </div>
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="password" minLength="8" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </label>
        <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-60" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-center text-sm text-slate-500">Already registered? <Link className="text-emerald-600 hover:underline" to="/login">Sign in</Link></p>
      </form>
    </main>
  );
}
