import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, LoaderCircle } from 'lucide-react';
import InvoicePDF from './InvoicePDF';

const InvoicePDFDownloadLink = ({ invoice, fullWidth = false }) => (
  <PDFDownloadLink
    document={<InvoicePDF invoice={invoice} />}
    fileName={`Invoice-${invoice.number}.pdf`}
    aria-label={`Download PDF for invoice ${invoice.number}`}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
      fullWidth
        ? 'min-h-10 bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700'
        : 'h-8 w-8 text-emerald-600 hover:bg-emerald-50'
    }`}
  >
    {({ loading }) => (
      <span className="inline-flex items-center justify-center" title={loading ? 'Generating invoice PDF' : 'Download invoice PDF'}>
        {loading
          ? <LoaderCircle className="h-4 w-4 animate-spin" />
          : <Download className={fullWidth ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />}
        {fullWidth && (loading ? 'Generating…' : 'Download PDF')}
      </span>
    )}
  </PDFDownloadLink>
);

export default InvoicePDFDownloadLink;
