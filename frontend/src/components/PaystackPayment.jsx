import { useState } from 'react';
import PaystackPop from '@paystack/inline-js';
import { Button } from './ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { invoicesAPI } from '../services/api';

const PaystackPayment = ({ invoice, onPaymentSuccess, onClose, compact = false }) => {
  const [isInitializing, setIsInitializing] = useState(false);

  // Get client email
  const clientEmail = invoice?.project?.client?.email || invoice?.client?.email || 'client@example.com';

  const handleSuccess = async () => {
    try {
      // Update invoice status to PAID
      await invoicesAPI.updateStatus(invoice.id, 'PAID');
      toast.success('Payment successful! 🎉 Invoice marked as PAID');
      onPaymentSuccess?.();
      onClose?.();
    } catch (error) {
      console.error('Payment success handler error:', error);
      toast.error('Payment successful but failed to update invoice. Please contact support.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleClose = () => {
    setIsInitializing(false);
    toast.info('Payment cancelled');
    onClose?.();
  };

  const handlePayment = () => {
    const amount = Number(invoice?.amount);
    if (!amount || !clientEmail) {
      toast.error('Invalid invoice amount');
      return;
    }

    setIsInitializing(true);
    const paystack = new PaystackPop();
    paystack.newTransaction({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      reference: `SOLO-${invoice?.number || Date.now()}-${Date.now()}`,
      email: clientEmail,
      amount: Math.round(amount * 100),
      currency: 'NGN',
      metadata: {
        invoice_number: invoice?.number || '',
        invoice_id: invoice?.id || '',
      },
      onLoad: () => setIsInitializing(false),
      onSuccess: handleSuccess,
      onCancel: handleClose,
      onError: (error) => {
        setIsInitializing(false);
        toast.error(error?.message || 'Unable to initialize Paystack payment');
      },
    });
  };

  return (
    <Button
      onClick={handlePayment}
      className={compact
        ? 'h-8 w-8 bg-emerald-600 p-0 text-white hover:bg-emerald-700'
        : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all'}
      disabled={isInitializing}
      title="Pay with Paystack"
    >
      {isInitializing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          {!compact && 'Pay Now with Paystack'}
        </>
      )}
    </Button>
  );
};

export default PaystackPayment;