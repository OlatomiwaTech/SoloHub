import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Send, X, Eye } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';
import { invoicesAPI } from '../services/api';
import { toast } from 'sonner';

const InvoicePreview = ({ invoice, isOpen, onClose, onSend }) => {
  const handleSend = async () => {
    try {
      await invoicesAPI.updateStatus(invoice.id, 'SENT');
      toast.success('Invoice sent successfully!');
      onSend?.();
      onClose();
    } catch (error) {
      toast.error('Failed to send invoice');
      console.error('Send invoice error:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Invoice Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Preview Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-slate-500">Invoice #{invoice.number}</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(invoice.amount)}
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                {invoice.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Client</p>
                <p className="font-medium text-slate-900">{invoice.client?.name}</p>
                <p className="text-slate-500">{invoice.client?.email}</p>
              </div>
              <div>
                <p className="text-slate-500">Project</p>
                <p className="font-medium text-slate-900">{invoice.project?.name}</p>
              </div>
            </div>

            {invoice.description && (
              <div className="mt-4">
                <p className="text-sm text-slate-500">Description</p>
                <p className="text-sm text-slate-700">{invoice.description}</p>
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-slate-500">Due Date:</span>
              <span className="font-medium text-slate-900">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} />}
              fileName={`Invoice-${invoice.number}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outline" className="flex-1" disabled={loading}>
                  <Download className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>

            <Button 
              onClick={handleSend}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreview;