import { useState } from 'react';
import { Button } from './ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { paymentsAPI } from '../services/api';

const PaystackPayment = ({ invoice, compact = false }) => {
  const [isInitializing, setIsInitializing] = useState(false);

  const handlePayment = async () => {
    setIsInitializing(true);
    try {
      const response = await paymentsAPI.initialize(invoice.id);
      const checkoutUrl = response.data?.data?.authorizationUrl;
      if (!checkoutUrl) throw new Error('Paystack did not return a checkout link');
      window.location.assign(checkoutUrl);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to start payment');
      setIsInitializing(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={handlePayment}
      className={compact
        ? 'h-8 w-8 bg-emerald-600 p-0 text-white hover:bg-emerald-700'
        : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all'}
      disabled={isInitializing}
      title="Pay with Paystack"
      aria-label={compact ? `Pay invoice ${invoice?.number} with Paystack` : undefined}
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
