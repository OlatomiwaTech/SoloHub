import { Link } from 'react-router-dom';
import { ArrowRight, FileText, FolderOpen, Users } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';

const steps = [
  { icon: Users, number: '01', title: 'Add your clients', copy: 'Start with the people you work with. Save their contact details so you can connect projects and invoices to the right client.' },
  { icon: FolderOpen, number: '02', title: 'Set up projects', copy: 'Create a project for each piece of work, attach it to a client, and update its status as things change.' },
  { icon: FileText, number: '03', title: 'Create an invoice', copy: 'Choose the client and project, add the work description, amount, and due date, then download the PDF.' },
];

const HowItWorks = () => (
  <PublicLayout>
    <main>
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">HOW IT WORKS</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-6xl">A simpler rhythm for the business around your craft.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Build a connected record of who you work with, what you’re working on, and what needs to be invoiced.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map(({ icon: Icon, number, title, copy }) => (
            <article key={number} className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span>
                <span className="font-mono text-sm text-emerald-700">{number}</span>
              </div>
              <h2 className="mt-7 text-xl font-semibold">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-slate-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Then keep the details close.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Your dashboard summarizes paid and unpaid invoices, active projects, clients, and recent activity. Invoice email delivery is not available yet, so PDFs can be downloaded and shared manually.</p>
          <Link to="/features" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">Explore the features <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </main>
  </PublicLayout>
);

export default HowItWorks;
