import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  FileText,
  FolderOpen,
  Sparkles,
  Users,
} from 'lucide-react';

const workflow = [
  {
    number: '01',
    icon: Users,
    title: 'Keep client details close',
    description: 'Save contact details and see every project connected to each client.',
  },
  {
    number: '02',
    icon: FolderOpen,
    title: 'Know where work stands',
    description: 'Group work by client and keep active, paused, and completed projects clear.',
  },
  {
    number: '03',
    icon: FileText,
    title: 'Make billing feel simple',
    description: 'Create a polished invoice, download a PDF, and keep its status up to date.',
  },
];

const capabilities = [
  {
    icon: Users,
    eyebrow: 'CLIENTS',
    title: 'A little context goes a long way.',
    description: 'Keep contact information and project history together, so the details you need are easy to find.',
    surface: 'bg-white',
  },
  {
    icon: FolderOpen,
    eyebrow: 'PROJECTS',
    title: 'See the shape of your workload.',
    description: 'Know what is active, on hold, completed, or cancelled without maintaining another spreadsheet.',
    surface: 'bg-[#f0fdf4]',
  },
  {
    icon: FileText,
    eyebrow: 'INVOICES',
    title: 'Turn finished work into a clear next step.',
    description: 'Create invoices with due dates, descriptions, and downloadable PDFs your clients can understand.',
    surface: 'bg-white',
  },
  {
    icon: BarChart3,
    eyebrow: 'OVERVIEW',
    title: 'Get a grounded view of the business.',
    description: 'Review collected revenue, unpaid invoices, active projects, and your latest invoice activity.',
    surface: 'bg-[#ecfdf5]',
  },
];

const Landing = () => (
  <main className="min-h-screen overflow-hidden bg-white text-slate-900">
    <header className="absolute inset-x-0 top-0 z-20 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12" aria-label="Main navigation">
        <a href="#home" className="flex items-center gap-2.5" aria-label="SoloHub home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-lg font-black text-white">S</span>
          <span className="text-xl font-bold tracking-tight text-slate-900">SoloHub</span>
        </a>
        <div className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          <a className="transition hover:text-emerald-700" href="#how-it-works">How it works</a>
          <a className="transition hover:text-emerald-700" href="#features">What you can manage</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700">Log in</Link>
          <Link to="/register" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>
    </header>

    <section id="home" className="relative isolate overflow-hidden bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -right-48 -top-56 h-[620px] w-[620px] rounded-full border border-emerald-900/[0.06]" />
      <div className="pointer-events-none absolute -right-24 -top-32 h-[440px] w-[440px] rounded-full border border-emerald-900/[0.08]" />
      <div className="pointer-events-none absolute left-[38%] top-24 h-[520px] w-[520px] rounded-full bg-emerald-200/35 blur-[120px]" />

      <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:pb-24 lg:pt-36">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-medium tracking-wide text-emerald-800 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            MADE FOR INDEPENDENT WORK
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
            <a href="#how-it-works" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600" /> Clients</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1.5"><FolderOpen className="h-3.5 w-3.5 text-emerald-600" /> Projects</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-emerald-600" /> Invoices & PDFs</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[620px] animate-float motion-reduce:animate-none lg:ml-auto">
          <div className="absolute -inset-10 rounded-[40px] bg-emerald-200/35 blur-3xl" />
          <div className="relative rotate-[1deg] rounded-[26px] border border-slate-200 bg-white p-2.5 shadow-[0_35px_80px_rgba(15,23,42,0.16)] sm:p-3.5">
            <div className="overflow-hidden rounded-[18px] bg-[#f8f8f4] text-[#1c2a23]">
              <div className="flex items-center justify-between border-b border-[#e7e8e0] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef9587]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#e9c76f]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#9cc78a]" />
                </div>
                <span className="text-[10px] font-medium tracking-wide text-[#849087]">SAMPLE WORKSPACE</span>
                <div className="h-6 w-6 rounded-full bg-[#dce9d8]" />
              </div>
              <div className="grid sm:grid-cols-[118px_1fr]">
                <aside className="hidden border-r border-[#e7e8e0] bg-[#f1f2ec] p-3 sm:block">
                  <div className="mb-7 flex items-center gap-2 px-1">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-[#1d3b2c] text-[10px] font-bold text-[#d7f36a]">S</span>
                    <span className="text-[11px] font-bold">SoloHub</span>
                  </div>
                  <div className="space-y-1 text-[10px] font-medium text-[#78847b]">
                    <div className="rounded-lg bg-[#dfe8d9] px-2.5 py-2 text-[#244632]">Overview</div>
                    <div className="px-2.5 py-2">Clients</div>
                    <div className="px-2.5 py-2">Projects</div>
                    <div className="px-2.5 py-2">Invoices</div>
                  </div>
                  <div className="mt-16 rounded-xl bg-[#e5e9df] p-2.5">
                    <div className="mb-2 h-1.5 w-10 rounded bg-[#c2ccbd]" />
                    <div className="h-1.5 w-14 rounded bg-[#c2ccbd]" />
                  </div>
                </aside>
                <div className="min-w-0 p-4 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-medium text-[#849087]">YOUR BUSINESS AT A GLANCE</p>
                      <h2 className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">A clearer week starts here.</h2>
                    </div>
                    <span className="rounded-lg bg-[#1d3b2c] px-3 py-2 text-[9px] font-semibold text-white">+ New invoice</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="rounded-xl border border-[#e5e8df] bg-white p-3 sm:p-4">
                      <p className="text-[10px] text-[#879188]">Collected</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight sm:text-2xl">₦840,000</p>
                      <p className="mt-1 text-[9px] text-[#538261]">Paid invoices</p>
                    </div>
                    <div className="rounded-xl border border-[#e5e8df] bg-white p-3 sm:p-4">
                      <p className="text-[10px] text-[#879188]">To follow up</p>
                      <p className="mt-1 text-lg font-semibold tracking-tight sm:text-2xl">₦215,000</p>
                      <p className="mt-1 text-[9px] text-[#b28345]">Unpaid invoices</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-[#e5e8df] bg-white p-3 sm:p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold">Recent activity</p>
                        <p className="text-[9px] text-[#929a91]">Projects and invoices, together</p>
                      </div>
                      <BarChart3 className="h-4 w-4 text-[#6b8c68]" />
                    </div>
                    <svg viewBox="0 0 440 92" className="h-[84px] w-full" role="img" aria-label="Illustrative revenue trend">
                      <path d="M0 72 C42 69 43 48 87 54 S137 72 177 45 S230 38 263 42 S318 56 352 29 S402 26 440 9" fill="none" stroke="#678e6a" strokeWidth="3" strokeLinecap="round" />
                      <path d="M0 72 C42 69 43 48 87 54 S137 72 177 45 S230 38 263 42 S318 56 352 29 S402 26 440 9 V92 H0Z" fill="url(#revenueFill)" />
                      <defs><linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#a9c6a2" stopOpacity=".35" /><stop offset="1" stopColor="#a9c6a2" stopOpacity="0" /></linearGradient></defs>
                      {[0, 110, 220, 330, 440].map((x) => <line key={x} x1={x} x2={x} y1="4" y2="88" stroke="#edf0e9" strokeDasharray="3 5" />)}
                    </svg>
                    <div className="flex justify-between text-[8px] text-[#a1a89f]"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span></div>
                  </div>

                  <div className="mt-3 flex items-center justify-between rounded-xl border border-[#e5e8df] bg-white px-3 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f1eee3]"><FileText className="h-4 w-4 text-[#987c4f]" /></span>
                      <div className="min-w-0"><p className="truncate text-[10px] font-semibold">Brand refresh</p><p className="text-[9px] text-[#929a91]">Invoice · due soon</p></div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#faf0da] px-2 py-1 text-[8px] font-semibold text-[#9a7136]">SENT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-2 flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3.5 py-3 text-xs font-medium text-slate-700 shadow-xl sm:-left-8">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle className="h-4 w-4" /></span>
            Less admin in your head
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
    </section>

    <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">A SIMPLE FLOW</p>
          <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">More flow.<br /><span className="font-serif font-normal italic text-emerald-600">Less juggling.</span></h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-slate-600">SoloHub brings the small but important parts of running a freelance business into one place.</p>
          <Link to="/register" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:gap-3">
            Start with your clients <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {workflow.map(({ number, icon: Icon, title, description }) => (
            <article key={number} className="grid gap-4 py-6 sm:grid-cols-[48px_44px_1fr] sm:items-start sm:gap-5 sm:py-7">
              <span className="pt-1 font-mono text-xs text-slate-400">{number}</span>
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span>
              <div><h3 className="text-lg font-semibold tracking-tight">{title}</h3><p className="mt-1.5 max-w-lg text-sm leading-6 text-slate-600">{description}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="features" className="bg-slate-50 py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:mb-16 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">ONE WORKSPACE, LESS SCATTER</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">The moving parts, <span className="font-serif font-normal italic text-emerald-600">in view.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-slate-600">Start with the tools you need today. Keep the details connected as the work grows.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map(({ icon: Icon, eyebrow, title, description, surface }, index) => (
            <article key={eyebrow} className={`${surface} group relative min-h-[245px] overflow-hidden rounded-[22px] border border-slate-200/80 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:p-8`}>
              <div className="flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span>
                <span className="font-mono text-[10px] tracking-[0.16em] text-slate-500">{eyebrow}</span>
              </div>
              <div className="mt-8 max-w-sm">
                <h3 className="text-xl font-semibold leading-snug tracking-tight sm:text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
              </div>
              <div className="pointer-events-none absolute -bottom-12 -right-8 h-36 w-36 rounded-full border border-emerald-900/10 transition-transform duration-500 group-hover:scale-125" />
              <div className="pointer-events-none absolute -bottom-6 -right-2 h-24 w-24 rounded-full border border-emerald-900/10" />
              <span className="absolute bottom-6 right-7 font-serif text-5xl text-emerald-900/10">0{index + 1}</span>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="px-5 py-24 sm:px-8 sm:py-28 lg:px-12">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-emerald-700 px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
        <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/15" />
        <div className="pointer-events-none absolute -right-6 -top-16 h-52 w-52 rounded-full border border-white/15" />
        <div className="relative flex flex-col justify-between gap-9 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-100">YOUR WORK, WITH ROOM TO GROW</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.045em] sm:text-5xl">Make space for the work you do best.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">Bring your clients, projects, and invoices into one workspace and spend less time keeping track of everything.</p>
          </div>
          <Link to="/register" className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 font-semibold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>

    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <a href="#home" className="flex items-center gap-2 font-bold tracking-tight"><span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-xs text-white">S</span> SoloHub</a>
        <p className="text-xs text-slate-500">A clearer home for your independent work.</p>
        <div className="flex items-center gap-5 text-xs text-slate-600">
          <a href="#features" className="transition hover:text-emerald-700">Features</a>
          <Link to="/login" className="transition hover:text-emerald-700">Log in</Link>
          <Link to="/register" className="font-semibold text-emerald-700 transition hover:text-emerald-800">Create account</Link>
        </div>
      </div>
    </footer>
  </main>
);

export default Landing;
