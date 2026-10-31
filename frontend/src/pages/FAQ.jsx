import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '../components/PublicLayout';

const questions = [
  {
    question: 'What can I manage in SoloHub?',
    answer: 'You can keep client records, track projects, create invoices, download invoice PDFs, and review a summary of your business activity.',
  },
  {
    question: 'Can I send invoices directly from SoloHub?',
    answer: 'Invoice email delivery is not available yet. You can download the invoice PDF and share it with your client yourself.',
  },
  {
    question: 'Can clients pay invoices online?',
    answer: 'SoloHub records invoice status and payments. A client-facing invoice portal or public checkout flow is not currently available.',
  },
  {
    question: 'Which currency does SoloHub use?',
    answer: 'Invoice amounts and payment records currently use Nigerian naira (NGN). Multi-currency invoicing is not available.',
  },
  {
    question: 'Does SoloHub have paid plans?',
    answer: 'Subscription billing and paid plans are not currently configured in the product.',
  },
];

const FAQ = () => (
  <PublicLayout>
    <main>
      <section className="bg-emerald-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">GOOD TO KNOW</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Frequently asked questions.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">A clear picture of what SoloHub can do today, including a few current limitations.</p>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-slate-900 marker:hidden [&::-webkit-details-marker]:hidden">
                {question}
                <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-lg font-normal text-emerald-700 transition group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-2xl pr-10 pt-3 text-sm leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-slate-600">Need help with something else? <Link to="/register" className="font-semibold text-emerald-700 underline underline-offset-4">Create an account</Link> or take a look at the <Link to="/features" className="font-semibold text-emerald-700 underline underline-offset-4">features</Link>.</p>
        <Link to="/how-it-works" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800">How it works <ArrowRight className="h-4 w-4" /></Link>
      </section>
    </main>
  </PublicLayout>
);

export default FAQ;
