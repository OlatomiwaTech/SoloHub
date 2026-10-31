import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InvoicePDF from './InvoicePDF';

const InvoicePDFDownloadLink = ({ invoice, fullWidth = false }) => (
  <PDFDownloadLink
    document={<InvoicePDF invoice={invoice} />}
    fileName={`Invoice-${invoice.number}.pdf`}
  >
    {({ loading }) => (
      <Button
        type="button"
        variant={fullWidth ? 'default' : 'ghost'}
        size={fullWidth ? 'default' : 'sm'}
        className={fullWidth ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'h-8 w-8 p-0 hover:bg-emerald-50'}
        disabled={loading}
        title={loading ? 'Generating invoice PDF' : 'Download invoice PDF'}
        aria-label={loading ? 'Generating invoice PDF' : `Download PDF for invoice ${invoice.number}`}
      >
        {loading
          ? <LoaderCircle className="h-4 w-4 animate-spin" />
          : <Download className={fullWidth ? 'mr-2 h-4 w-4' : 'h-4 w-4 text-emerald-600'} />}
        {fullWidth && (loading ? 'Generating…' : 'Download PDF')}
      </Button>
    )}
  </PDFDownloadLink>
);

export default InvoicePDFDownloadLink;
