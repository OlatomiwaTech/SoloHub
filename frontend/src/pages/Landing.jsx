import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDown, ArrowRight, BarChart3, BriefcaseBusiness, Check, CheckCircle2,
  CircleDollarSign, Clock3, FileText, FolderKanban, LayoutDashboard,
  Plus, Search, Sparkles, Users,
} from 'lucide-react';
import PublicLayout from '../components/PublicLayout';

const demoInvoices = [
  { number: 'INV-024', client: 'Northstar Studio', project: 'Brand identity', amount: '₦420,000', status: 'PAID' },
  { number: 'INV-023', client: 'Morrow Coffee', project: 'Website refresh', amount: '₦285,000', status: 'SENT' },
  { number: 'INV-022', client: 'Fieldwork Co.', project: 'Campaign assets', amount: '₦160,000', status: 'OVERDUE' },
];

const demoClients = [
  { initials: 'NS', name: 'Northstar Studio', email: 'hello@northstar.studio', projects: '2 projects' },
  { initials: 'MC', name: 'Morrow Coffee', email: 'team@morrow.coffee', projects: '1 project' },
  { initials: 'FC', name: 'Fieldwork Co.', email: 'studio@fieldwork.co', projects: '3 projects' },
];

const viewTabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'invoices', label: 'Invoices', icon: FileText },
];

function ProductPreview({ initialView = 'overview' }) {
  const [activeView, setActiveView] = useState(initialView);

  return (
    <div className="relative mx-auto w-full max-w-[760px] lg:ml-auto">
      <div className="absolute -inset-8 rounded-[40px] bg-emerald-300/30 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.19)] sm:rounded-[22px]">
        <div className="flex h-10 items-center gap-1.5 border-b border-slate-200 bg-white px-4 sm:h-12 sm:px-5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" /><span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <div className="mx-auto hidden w-1/2 rounded-md bg-slate-100 px-4 py-1 text-center text-[9px] text-slate-400 sm:block">app.solohub.work</div>
          <span className="ml-auto rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-semibold tracking-wide text-emerald-800 sm:text-[9px]">SAMPLE WORKSPACE</span>
        </div>
        <div className="flex min-h-[360px] sm:min-h-[440px]">
          <aside className="hidden w-[150px] shrink-0 flex-col bg-slate-950 px-3 py-4 text-white sm:flex lg:w-[170px] lg:px-4">
            <div className="mb-8 flex items-center gap-2 px-1"><span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500 text-xs font-black">S</span><span className="text-xs font-bold">SoloHub</span></div>
            <p className="mb-2 px-2 text-[8px] font-semibold uppercase tracking-[.14em] text-slate-500">Workspace</p>
            <div className="space-y-1">
              {viewTabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setActiveView(id)} className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[10px] transition ${activeView === id ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}><Icon className="h-3.5 w-3.5" />{label}</button>)}
              <div className="flex items-center gap-2 rounded-lg px-2 py-2 text-[10px] text-slate-400"><FolderKanban className="h-3.5 w-3.5" />Projects</div>
            </div>
            <div className="mt-auto flex items-center gap-2 border-t border-slate-800 pt-4"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-900 text-[9px] font-semibold text-emerald-200">JD</span><span className="truncate text-[9px] text-slate-300">Jamie Designer</span></div>
          </aside>

          <div className="min-w-0 flex-1 bg-slate-50 p-3 sm:p-5 lg:p-6">
            <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
              <div><p className="text-[9px] font-medium text-slate-400 sm:text-[10px]">WORKSPACE / {activeView.toUpperCase()}</p><h2 className="mt-1 text-sm font-semibold tracking-tight text-slate-900 sm:text-lg">{activeView === 'overview' ? 'Good morning, Jamie' : activeView === 'clients' ? 'Your clients' : 'Your invoices'}</h2></div>
              <button className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-2 text-[9px] font-semibold text-white shadow-sm sm:px-3 sm:text-[10px]"><Plus className="h-3 w-3" />{activeView === 'clients' ? 'Add client' : 'New invoice'}</button>
            </div>

            {activeView === 'overview' && <>
              <div className="mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:grid-cols-4 sm:gap-2.5">
                {[
                  ['Revenue collected', '₦840,000', CircleDollarSign, 'bg-emerald-50 text-emerald-700'],
                  ['Unpaid invoices', '₦215,000', Clock3, 'bg-amber-50 text-amber-700'],
                  ['Active projects', '4', BriefcaseBusiness, 'bg-blue-50 text-blue-700'],
                  ['Total clients', '12', Users, 'bg-violet-50 text-violet-700'],
                ].map(([label, value, Icon, color]) => <div key={label} className="rounded-lg border border-slate-200 bg-white p-2.5 sm:rounded-xl sm:p-3"><div className="mb-2 flex items-center justify-between gap-1"><span className="text-[8px] leading-tight text-slate-500 sm:text-[9px]">{label}</span><span className={`grid h-6 w-6 place-items-center rounded-md ${color}`}><Icon className="h-3 w-3" /></span></div><p className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">{value}</p></div>)}
              </div>
              <div className="mb-3 rounded-lg border border-slate-200 bg-white p-3 sm:mb-4 sm:rounded-xl sm:p-4">
                <div className="flex items-center justify-between"><div><h3 className="text-[10px] font-semibold text-slate-800 sm:text-xs">Revenue trend</h3><p className="mt-0.5 text-[8px] text-slate-400 sm:text-[9px]">Paid invoices · last 6 months</p></div><button className="rounded-md border border-slate-200 px-2 py-1 text-[8px] text-slate-500">6 months⌄</button></div>
                <div className="mt-2 h-[100px] w-full sm:h-[128px]">
                  <svg viewBox="0 0 600 135" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="Example revenue trend rising over six months">
                    {[25, 55, 85, 115].map((y) => <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="#edf1f2" strokeDasharray="4 5" />)}
                    <path d="M0 105 C52 98 65 85 112 91 S174 103 222 74 S291 85 337 61 S397 71 447 42 S523 53 600 19 L600 130 L0 130Z" fill="url(#areaFill)" />
                    <path d="M0 105 C52 98 65 85 112 91 S174 103 222 74 S291 85 337 61 S397 71 447 42 S523 53 600 19" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                    <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#10b981" stopOpacity=".2" /><stop offset="1" stopColor="#10b981" stopOpacity="0" /></linearGradient></defs>
                  </svg>
                  <div className="flex justify-between text-[7px] text-slate-400 sm:text-[8px]"><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span></div>
                </div>
              </div>
              <InvoiceTable compact />
            </>}

            {activeView === 'invoices' && <>
              <div className="mb-3 grid grid-cols-3 gap-2 sm:mb-4"><MiniStat label="All invoices" value="24" /><MiniStat label="Paid" value="18" /><MiniStat label="Awaiting payment" value="6" /></div>
              <InvoiceTable />
              <p className="mt-2 text-[8px] text-slate-400">Example records for preview only.</p>
            </>}

            {activeView === 'clients' && <>
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[9px] text-slate-400"><Search className="h-3 w-3" />Search clients</div>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="grid grid-cols-[1fr_auto] border-b border-slate-100 px-3 py-2 text-[8px] font-medium uppercase tracking-wide text-slate-400"><span>Client</span><span>Projects</span></div>
                {demoClients.map(({ initials, name, email, projects }, index) => <div key={name} className={`grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-3 ${index < demoClients.length - 1 ? 'border-b border-slate-100' : ''}`}><div className="flex min-w-0 items-center gap-2"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-[8px] font-semibold text-emerald-700">{initials}</span><span className="min-w-0"><span className="block truncate text-[9px] font-semibold text-slate-700">{name}</span><span className="block truncate text-[8px] text-slate-400">{email}</span></span></div><span className="text-[8px] text-slate-500">{projects}</span></div>)}
              </div>
              <div className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50/70 p-3"><p className="text-[9px] font-semibold text-emerald-900">Client details, connected to the work</p><p className="mt-1 text-[8px] leading-4 text-emerald-900/70">Open a client record to see the projects and invoices linked to that relationship.</p></div>
            </>}
            <p className="mt-3 text-center text-[8px] text-slate-400">Illustrative preview · sample workspace</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-medium text-slate-700 shadow-lg sm:-left-6"><span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-3.5 w-3.5" /></span>Less admin scattered across tools</div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3"><p className="text-[8px] text-slate-400">{label}</p><p className="mt-1 text-sm font-bold text-slate-900">{value}</p></div>;
}

function Reveal({ children, delay = 0, className = '' }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={elementRef} className={`reveal-on-scroll ${visible ? 'is-visible' : ''} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function InvoiceTable({ compact = false }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white sm:rounded-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2.5"><h3 className="text-[9px] font-semibold text-slate-800 sm:text-[10px]">Recent invoices</h3><span className="text-[8px] font-medium text-emerald-700">View all →</span></div>
      <div className="divide-y divide-slate-100">
        {demoInvoices.slice(0, compact ? 2 : 3).map((invoice) => <div key={invoice.number} className="grid grid-cols-[1fr_auto] items-center gap-2 px-3 py-2.5">
          <div className="min-w-0"><p className="truncate text-[9px] font-semibold text-slate-700">{invoice.client}</p><p className="mt-0.5 truncate text-[8px] text-slate-400">{invoice.number} · {invoice.project}</p></div>
          <div className="text-right"><p className="text-[9px] font-semibold text-slate-700">{invoice.amount}</p><span className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${invoice.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' : invoice.status === 'OVERDUE' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700'}`}>{invoice.status}</span></div>
        </div>)}
      </div>
    </div>
  );
}

const capabilities = [
  { icon: Users, eyebrow: 'CLIENTS', title: 'Remember the relationship, not another spreadsheet.', description: 'Keep the details you need close to the projects and invoices they belong to.', image: 'https://images.pexels.com/photos/9429554/pexels-photo-9429554.jpeg?auto=compress&cs=tinysrgb&w=1000', alt: 'Freelancer planning work beside a laptop and notebook', credit: 'Monstera Production', photo: 'https://www.pexels.com/photo/crop-unrecognizable-black-woman-using-laptop-and-writing-notes-9429554/' },
  { icon: FolderKanban, eyebrow: 'PROJECTS', title: 'Know what is moving and what is waiting.', description: 'Keep client work in view and update a project as its status changes.', image: 'https://images.pexels.com/photos/6393010/pexels-photo-6393010.jpeg?auto=compress&cs=tinysrgb&w=1000', alt: 'Freelancer working at a laptop in a bright workspace', credit: 'William Fortunato', photo: 'https://www.pexels.com/photo/entrepreneur-in-casual-clothes-typing-on-laptop-in-light-room-6393010/' },
  { icon: FileText, eyebrow: 'INVOICES', title: 'Make the next payment easier to track.', description: 'Create an invoice, download a PDF, and see which invoices are paid or still need follow-up.', image: 'https://images.pexels.com/photos/6779604/pexels-photo-6779604.jpeg?auto=compress&cs=tinysrgb&w=1000', alt: 'Independent worker focused on a laptop in a home workspace', credit: 'Artem Podrez', photo: 'https://www.pexels.com/photo/a-freelancer-working-6779604/' },
  { icon: BarChart3, eyebrow: 'OVERVIEW', title: 'See the shape of your workload.', description: 'Bring revenue collected, unpaid invoices, active projects, clients, and recent invoices together.', image: 'https://images.pexels.com/photos/35372208/pexels-photo-35372208.jpeg?auto=compress&cs=tinysrgb&w=1000', alt: 'Freelancer reviewing work on a laptop', credit: 'Zeal Creative Studios', photo: 'https://www.pexels.com/photo/african-man-working-on-laptop-in-modern-setting-35372208/' },
];

const questions = [
  ['What does SoloHub help me manage?', 'Client records, project status, invoices, invoice PDFs, and an overview of business activity.'],
  ['Can I send invoices directly from SoloHub?', 'Invoice email delivery is not available yet. You can download the invoice PDF and share it with your client yourself.'],
  ['Can clients pay invoices online?', 'SoloHub records invoice status and payments. A client-facing invoice portal or public checkout flow is not currently available.'],
  ['Which currency does SoloHub use?', 'Invoice amounts and payment records currently use Nigerian naira (NGN). Multi-currency invoicing is not available.'],
];

const pains = [
  { icon: Search, title: 'Details live in too many places', copy: 'Client contact info in messages. Project notes in a document. Invoice status in a spreadsheet.' },
  { icon: Clock3, title: 'Follow-up depends on memory', copy: 'When the admin is scattered, it is harder to spot which invoice still needs attention.' },
  { icon: CircleDollarSign, title: 'The business is hard to read at a glance', copy: 'You need a quick way to see what is paid, what is outstanding, and what work is active.' },
];

function Landing() {
  return (
    <PublicLayout>
      <main>
        <section id="home" className="scroll-mt-28 overflow-hidden bg-[radial-gradient(ellipse_at_80%_0%,rgba(16,185,129,0.13),transparent_36%),linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-24">
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-emerald-800 shadow-sm"><Sparkles className="h-3.5 w-3.5" /> Freelance business, in focus</div>
              <h1 className="text-[clamp(3rem,6.2vw,5.25rem)] font-semibold leading-[.99] tracking-[-.065em] text-slate-950">Less chasing admin.<br /><span className="font-serif font-normal italic text-emerald-600">More room to do.</span></h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">SoloHub connects your clients, projects, and invoices—so you can see what needs attention and keep the work moving.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Create your workspace <ArrowRight className="h-4 w-4" /></Link>
                <a href="#product" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white"><span>Explore the product</span><ArrowDown className="h-4 w-4" /></a>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Client records</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Project tracking</span><span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Invoice PDFs</span></div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-[.7fr_1.3fr] md:items-center lg:px-12">
            <div><p className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-700">The day-to-day friction</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">Freelance work is the job.<br />Admin should not be.</h2></div>
            <div className="grid gap-3 sm:grid-cols-3">
              {pains.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-xl bg-slate-50 p-4"><Icon className="h-4 w-4 text-emerald-700" /><h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3><p className="mt-1.5 text-xs leading-5 text-slate-600">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="product" className="scroll-mt-28 bg-slate-950 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-300">A closer look</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] sm:text-5xl">The detail behind<br className="hidden sm:block" /> every clear overview.</h2><p className="mt-4 text-sm leading-6 text-slate-300 sm:text-base">Keep client relationships and invoice follow-up in the same workspace as your dashboard.</p></div>
            <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-8"><div><ProductPreview initialView="clients" /><p className="mt-5 text-center text-sm font-medium text-slate-300">Client records</p></div><div><ProductPreview initialView="invoices" /><p className="mt-5 text-center text-sm font-medium text-slate-300">Invoice overview</p></div></div>
            <div className="mt-8 text-center"><p className="text-[11px] text-slate-400">Illustrative sample workspace. Your dashboard reflects your own records.</p></div>
          </div>
        </section>

        <section id="features" className="relative isolate scroll-mt-28 overflow-hidden bg-slate-50 py-20 sm:py-28">
          <img src="https://images.pexels.com/photos/35372208/pexels-photo-35372208.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-35" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-white/90 via-white/85 to-emerald-50/65" />
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
            <Reveal className="mb-11 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">Made for the work behind the work</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">Less switching.<br /><span className="font-serif font-normal italic text-emerald-700">More clarity.</span></h2></Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              {capabilities.map(({ icon: Icon, eyebrow, title, description, image, alt, credit, photo }, index) => (
                <Reveal key={eyebrow} delay={index * 110} className="h-full">
                  <article className="group h-full overflow-hidden rounded-2xl border border-white/80 bg-white/95 shadow-lg shadow-slate-900/[.06] backdrop-blur-sm transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-950/15">
                    <div className="relative h-48 overflow-hidden sm:h-56">
                      <img src={image} alt={alt} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                      <a href={photo} target="_blank" rel="noreferrer" className="absolute bottom-3 right-3 rounded-full border border-white/60 bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-white hover:text-emerald-800">Photo: {credit} / Pexels</a>
                    </div>
                    <div className="relative p-6 sm:p-8">
                      <div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700 transition duration-300 group-hover:bg-emerald-700 group-hover:text-white"><Icon className="h-5 w-5" /></span><span className="font-mono text-[10px] tracking-[.15em] text-slate-400">0{index + 1} / {eyebrow}</span></div>
                      <h3 className="mt-6 max-w-md text-xl font-semibold leading-snug tracking-tight text-slate-950 sm:text-2xl">{title}</h3>
                      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600">{description}</p>
                      <div className="mt-6 h-px w-full bg-slate-100 transition-colors group-hover:bg-emerald-100" />
                      <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-emerald-800"><Check className="h-3.5 w-3.5" /> Connected to your workspace</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
            <p className="mt-5 text-right text-[10px] text-slate-500">Section background photo: <a href="https://www.pexels.com/photo/african-man-working-on-laptop-in-modern-setting-35372208/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-800">Zeal Creative Studios on Pexels</a></p>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-28 bg-white py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20 lg:px-12">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">A simple rhythm</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.045em] text-slate-950 sm:text-5xl">Set it up once.<br /><span className="font-serif font-normal italic text-emerald-700">Keep it current.</span></h2><p className="mt-5 max-w-sm text-sm leading-6 text-slate-600">Start with the people you work with, then keep the project and billing details connected as you go.</p></div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {[
                [Users, 'Add a client', 'Keep their contact information in a client record.'],
                [BriefcaseBusiness, 'Track a project', 'Connect the work to a client and update the project status.'],
                [FileText, 'Create an invoice', 'Describe the work, set the amount and due date, then download a PDF to share.'],
              ].map(([Icon, title, copy], index) => <article key={title} className="grid grid-cols-[40px_1fr] gap-4 py-5 sm:grid-cols-[52px_1fr] sm:gap-5 sm:py-6"><span className="font-mono pt-1 text-xs text-slate-400">0{index + 1}</span><div className="flex gap-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-4 w-4" /></span><div><h3 className="font-semibold text-slate-900">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-600">{copy}</p></div></div></article>)}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-28 bg-slate-50 py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[.7fr_1.3fr] lg:gap-20 lg:px-12">
            <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-700">Before you get started</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Clear answers.<br />No surprises.</h2></div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">{questions.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-lg font-normal text-emerald-700 transition group-open:rotate-45">+</span></summary><p className="max-w-2xl pr-10 pt-3 text-sm leading-6 text-slate-600">{answer}</p></details>)}</div>
          </div>
        </section>

        <section id="get-started" className="scroll-mt-28 bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-emerald-950/10 bg-emerald-950 px-6 py-12 text-white shadow-2xl shadow-emerald-950/15 sm:px-12 sm:py-16 lg:px-16">
            <img src="https://images.pexels.com/photos/6779604/pexels-photo-6779604.jpeg?auto=compress&cs=tinysrgb&w=1800" alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,44,34,.95)_0%,rgba(2,44,34,.83)_48%,rgba(2,44,34,.46)_100%)]" />
            <div aria-hidden="true" className="absolute -right-12 -top-28 -z-10 h-80 w-80 rounded-full border border-white/20" />
            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-200">Your work, with room to grow</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">Bring the busywork into focus.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-emerald-50 sm:text-base">Start organizing your client work, project status, and invoices in one place.</p></div>
              <Link to="/register" aria-label="Get started with SoloHub" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl border-2 border-white bg-white px-6 py-3.5 font-semibold !text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:!text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"><span>Get started</span><ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-900" /></Link>
            </div>
            <p className="relative mt-8 text-[10px] text-white/80">Photo by <a href="https://www.pexels.com/photo/a-freelancer-working-6779604/" target="_blank" rel="noreferrer" className="font-medium underline underline-offset-2 hover:text-white">Artem Podrez on Pexels</a></p>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

export default Landing;
