import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CheckCircle, FileText, FolderOpen, Sparkles, Users } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';

const capabilities = [
  { icon: Users, eyebrow: 'CLIENTS', title: 'Keep client details close.', description: 'Find contact information and project history together, without searching through scattered notes.' },
  { icon: FolderOpen, eyebrow: 'PROJECTS', title: 'Know where work stands.', description: 'See active, paused, and completed projects connected to the clients behind them.' },
  { icon: FileText, eyebrow: 'INVOICES', title: 'Make billing feel simple.', description: 'Create an invoice, download a clear PDF, and keep its status up to date.' },
  { icon: BarChart3, eyebrow: 'OVERVIEW', title: 'Get a grounded view.', description: 'Review collected revenue, unpaid invoices, active projects, and recent activity.' },
];

const Landing = () => (
  <PublicLayout>
    <main>
      <section id="home" className="relative isolate overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute -right-48 -top-56 h-[620px] w-[620px] rounded-full border border-emerald-900/[0.06]" />
        <div className="pointer-events-none absolute left-[38%] top-24 h-[520px] w-[520px] rounded-full bg-emerald-200/35 blur-[120px]" />
        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-medium tracking-wide text-emerald-800 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> MADE FOR INDEPENDENT WORK
            </div>
            <h1 className="max-w-[650px] text-[clamp(3.35rem,7vw,6.2rem)] font-semibold leading-[0.96] tracking-[-0.065em]">
              Make good work <span className="font-serif font-normal italic text-emerald-600">easier</span> to run.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              The client notes, project updates, and invoices behind your freelance work—together in one calm workspace.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/register" className="inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-700">
                Create your workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700">
                See how it works <span aria-hidden="true">↓</span>
              </Link>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600" /> Clients</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1.5"><FolderOpen className="h-3.5 w-3.5 text-emerald-600" /> Projects</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-emerald-600" /> Invoices & PDFs</span>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-[620px] animate-float motion-reduce:animate-none lg:ml-auto">
            <div className="absolute -inset-7 rounded-[40px] bg-emerald-200/50 blur-3xl" />
            <div className="relative overflow-hidden rounded-[28px] border-[8px] border-white bg-white shadow-[0_35px_80px_rgba(15,23,42,0.18)] sm:border-[10px]">
              <img
                src="https://images.pexels.com/photos/35372208/pexels-photo-35372208.jpeg?auto=compress&cs=tinysrgb&w=1400"
                alt="Freelancer working at a laptop in a bright studio"
                className="aspect-[4/3] w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
              <figcaption className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] text-slate-600 backdrop-blur">
                Photo by <a href="https://www.pexels.com/photo/african-man-working-on-laptop-in-modern-setting-35372208/" target="_blank" rel="noreferrer" className="underline underline-offset-2">Zeal Creative Studios / Pexels</a>
              </figcaption>
            </div>
            <div className="absolute -bottom-5 -left-2 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3.5 py-3 text-xs font-medium text-slate-700 shadow-xl sm:-left-8">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle className="h-4 w-4" /></span>
              Less admin in your head
            </div>
          </figure>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">A SIMPLE FLOW</p>
            <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">More flow.<br /><span className="font-serif font-normal italic text-emerald-600">Less juggling.</span></h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-600">SoloHub brings the small but important parts of running a freelance business into one place.</p>
            <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:gap-3">See the three steps <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {[
              ['01', Users, 'Keep client details close', 'Save contact details and see each project connected to its client.'],
              ['02', FolderOpen, 'Know where work stands', 'Group work by client and keep active, paused, and completed projects clear.'],
              ['03', FileText, 'Make billing feel simple', 'Create a polished invoice, download a PDF, and keep its status up to date.'],
            ].map(([number, Icon, title, description]) => (
              <article key={number} className="grid gap-4 py-6 sm:grid-cols-[48px_44px_1fr] sm:items-start sm:gap-5 sm:py-7">
                <span className="pt-1 font-mono text-xs text-slate-400">{number}</span>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span>
                <div><h3 className="text-lg font-semibold tracking-tight">{title}</h3><p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-600">{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-16 sm:flex-row sm:items-end">
            <div className="max-w-2xl"><p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">ONE WORKSPACE, LESS SCATTER</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">The moving parts, <span className="font-serif font-normal italic text-emerald-600">in view.</span></h2></div>
            <Link to="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Explore all features <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, eyebrow, title, description }, index) => (
              <article key={eyebrow} className="group relative min-h-[230px] overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8">
                <div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span><span className="font-mono text-[10px] tracking-[0.16em] text-slate-500">{eyebrow}</span></div>
                <div className="mt-8 max-w-sm"><h3 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></div>
                <span className="absolute bottom-5 right-7 font-serif text-5xl text-emerald-900/10">0{index + 1}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-emerald-700 px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/15" />
          <div className="relative flex flex-col justify-between gap-9 md:flex-row md:items-end">
            <div className="max-w-2xl"><p className="text-xs font-semibold tracking-[0.18em] text-emerald-100">YOUR WORK, WITH ROOM TO GROW</p><h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Make space for the work you do best.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">Bring your clients, projects, and invoices into one workspace and spend less time keeping track of everything.</p></div>
            <Link to="/register" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50">Get started <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>
    </main>
  </PublicLayout>
);

export default Landing;
