import { lazy, Suspense, useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InvoicePDFDownloadLink = lazy(() => import('./InvoicePDFDownloadLink'));

const InvoicePDFDownloadButton = ({ invoice, fullWidth = false }) => {
  const [isPreparing, setIsPreparing] = useState(false);
  const buttonClass = fullWidth
    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
    : 'h-8 w-8 p-0 hover:bg-emerald-50';

  if (!isPreparing) {
    return (
      <Button
        type="button"
        variant={fullWidth ? 'default' : 'ghost'}
        size={fullWidth ? 'default' : 'sm'}
        className={buttonClass}
        title="Prepare invoice PDF"
        aria-label={`Prepare PDF for invoice ${invoice.number}`}
        onClick={() => setIsPreparing(true)}
      >
        <Download className={fullWidth ? 'mr-2 h-4 w-4' : 'h-4 w-4 text-emerald-600'} />
        {fullWidth && 'Prepare PDF'}
      </Button>
    );
  }

  return (
    <Suspense
      fallback={(
        <Button type="button" size={fullWidth ? 'default' : 'sm'} className={buttonClass} disabled>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          {fullWidth && <span className="ml-2">Loading PDF tools…</span>}
        </Button>
      )}
    >
      <InvoicePDFDownloadLink invoice={invoice} fullWidth={fullWidth} />
    </Suspense>
  );
};

export default InvoicePDFDownloadButton;
