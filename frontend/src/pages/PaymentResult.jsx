import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, CircleAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paymentsAPI } from '../services/api';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [state, setState] = useState({ loading: true, invoice: null, error: '' });

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      if (!reference) {
        setState({ loading: false, invoice: null, error: 'No payment reference was provided.' });
        return;
      }

      try {
        const response = await paymentsAPI.verify(reference);
        if (!cancelled) {
          setState({ loading: false, invoice: response.data?.data?.invoice || null, error: '' });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            loading: false,
            invoice: null,
            error: error.response?.data?.message || 'We could not verify this payment. Please try again from your invoices.',
          });
        }
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [reference]);

  const paid = state.invoice?.status === 'PAID';

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm" aria-live="polite">
        {state.loading ? (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
            <h1 className="mt-4 text-xl font-semibold text-slate-900">Verifying payment</h1>
            <p className="mt-2 text-slate-500">Please wait while we confirm the transaction with Paystack.</p>
          </>
        ) : paid ? (
          <>
            <CheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment confirmed</h1>
            <p className="mt-2 text-slate-600">Invoice {state.invoice.number} is marked as paid.</p>
          </>
        ) : (
          <>
            <CircleAlert className="mx-auto h-12 w-12 text-amber-600" />
            <h1 className="mt-4 text-2xl font-bold text-slate-900">Payment not confirmed</h1>
            <p className="mt-2 text-slate-600">{state.error || 'Paystack has not confirmed a successful payment for this invoice.'}</p>
          </>
        )}
        {!state.loading && (
          <Button asChild className="mt-6 bg-emerald-600 text-white hover:bg-emerald-700">
            <Link to="/invoices">Return to invoices</Link>
          </Button>
        )}
      </section>
    </main>
  );
};

export default PaymentResult;
