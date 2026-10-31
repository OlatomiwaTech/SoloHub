import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-white text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5" aria-label="SoloHub home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">S</span>
          <span className="text-xl font-bold tracking-tight">SoloHub</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-slate-600 md:flex">
          <a className="transition hover:text-emerald-700" href="#features">Features</a>
          <a className="transition hover:text-emerald-700" href="#how-it-works">How it works</a>
          <a className="transition hover:text-emerald-700" href="#faq">FAQ</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700">Log in</Link>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>

    {children}

    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight"><span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-xs text-white">S</span> SoloHub</Link>
        <p className="text-xs text-slate-500">A clearer home for your independent work.</p>
        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
          <a href="#features" className="transition hover:text-emerald-700">Features</a>
          <a href="#how-it-works" className="transition hover:text-emerald-700">How it works</a>
          <a href="#faq" className="transition hover:text-emerald-700">FAQ</a>
          <Link to="/login" className="transition hover:text-emerald-700">Log in</Link>
        </div>
      </div>
    </footer>
  </div>
);

export default PublicLayout;
