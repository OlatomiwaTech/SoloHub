import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, FileText, FolderOpen, Users } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';

const features = [
  { icon: Users, title: 'Client records', copy: 'Keep names, email, phone, and address in one place. See how each client connects to your projects.' },
  { icon: FolderOpen, title: 'Project tracking', copy: 'Organize projects by client and update their status as work moves from active to complete.' },
  { icon: FileText, title: 'Invoices and PDFs', copy: 'Create invoices with a description, amount, and due date, then download a shareable PDF.' },
  { icon: BarChart3, title: 'Business overview', copy: 'See collected revenue, unpaid invoices, active projects, and recent invoices on one dashboard.' },
];

const Features = () => (
  <PublicLayout>
    <main>
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">A WORKSPACE BUILT AROUND YOUR WORK</p>
            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-[-0.05em] sm:text-5xl">The essentials for running a freelance business.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Keep client details, project status, and invoice records connected—without spreading the admin across a stack of tools.</p>
            <Link to="/register" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
              Create your workspace <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <figure className="relative">
            <img
              src="https://images.pexels.com/photos/9429554/pexels-photo-9429554.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Freelancer planning work beside a laptop and notebook"
              className="aspect-[4/3] w-full rounded-[26px] object-cover shadow-xl shadow-slate-900/10"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="mt-2 text-right text-xs text-slate-500">
              Photo by <a className="underline decoration-slate-300 underline-offset-2 hover:text-emerald-700" href="https://www.pexels.com/photo/crop-unrecognizable-black-woman-using-laptop-and-writing-notes-9429554/" target="_blank" rel="noreferrer">Monstera Production on Pexels</a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">WHAT YOU CAN DO</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">One clear place for the moving parts.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-7">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></span>
              <h3 className="mt-5 text-lg font-semibold">{title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  </PublicLayout>
);

export default Features;
