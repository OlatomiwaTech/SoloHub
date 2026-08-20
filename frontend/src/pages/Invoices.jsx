import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  FileText, 
  Plus, 
  Eye, 
  Trash2, 
  Search, 
  Download,
  Send,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { invoicesAPI } from '../services/api';
import InvoiceWizard from '../components/InvoiceWizard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../components/InvoicePDF';

const Invoices = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [totals, setTotals] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    overdue: 0,
  });

  useEffect(() => {
    let cancelled = false;

    const loadInvoices = async () => {
      try {
        const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
        const response = await invoicesAPI.getAll(params);
        if (!cancelled) {
          setInvoices(response.data.data || []);
          setTotals(response.data.totals || {
            total: 0,
            paid: 0,
            pending: 0,
            overdue: 0,
          });
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error('Failed to load invoices');
          console.error('Fetch invoices error:', error);
          setLoading(false);
        }
      }
    };

    loadInvoices();

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {};
      const response = await invoicesAPI.getAll(params);
      setInvoices(response.data.data || []);
      setTotals(response.data.totals || {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0,
      });
    } catch (error) {
      toast.error('Failed to load invoices');
      console.error('Fetch invoices error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, number) => {
    if (!confirm(`Are you sure you want to delete invoice ${number}?`)) {
      return;
    }

    try {
      await invoicesAPI.delete(id);
      toast.success('Invoice deleted successfully!');
      fetchInvoices();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete invoice';
      toast.error(message);
      console.error('Delete invoice error:', error);
    }
  };

  const handleView = (invoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await invoicesAPI.updateStatus(id, status);
      toast.success(`Invoice marked as ${status}`);
      fetchInvoices();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      console.error('Update status error:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      DRAFT: { color: 'bg-slate-100 text-slate-700', icon: FileText, label: 'Draft' },
      SENT: { color: 'bg-blue-100 text-blue-700', icon: Send, label: 'Sent' },
      PAID: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle, label: 'Paid' },
      OVERDUE: { color: 'bg-red-100 text-red-700', icon: AlertCircle, label: 'Overdue' },
      CANCELLED: { color: 'bg-gray-100 text-gray-700', icon: XCircle, label: 'Cancelled' },
    };
    return configs[status] || configs.DRAFT;
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.project?.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.project?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div className="bg-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 bg-white">
            <FileText className="h-8 w-8 text-emerald-600" />
            Invoices
          </h1>
          <p className="text-slate-500 bg-white">Manage and track all your invoices</p>
        </div>
        <Button
          onClick={() => setIsWizardOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="text-xl font-bold text-slate-900">{formatCurrency(totals.total)}</p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <p className="text-sm text-emerald-600">Paid</p>
          <p className="text-xl font-bold text-emerald-700">{formatCurrency(totals.paid)}</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
          <p className="text-sm text-amber-600">Pending</p>
          <p className="text-xl font-bold text-amber-700">{formatCurrency(totals.pending)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
          <p className="text-sm text-red-600">Overdue</p>
          <p className="text-xl font-bold text-red-700">{formatCurrency(totals.overdue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search invoices by number, client, or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full bg-white border-slate-200 sm:w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="SENT">Sent</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-slate-500 mt-2">Loading invoices...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-8 text-center bg-white">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 bg-white">
              {searchTerm ? 'No invoices match your search' : 'No invoices yet'}
            </p>
            <Button
              variant="outline"
              className="mt-3 bg-white"
              onClick={() => setIsWizardOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create your first invoice
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const statusConfig = getStatusConfig(invoice.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <TableRow key={invoice.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">
                        {invoice.number}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {invoice.project?.client?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {invoice.project?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {formatCurrency(invoice.amount)}
                      </TableCell>
                      <TableCell className={`text-sm ${
                        invoice.status === 'OVERDUE' 
                          ? 'text-red-600 font-medium' 
                          : 'text-slate-500'
                      }`}>
                        {formatDate(invoice.dueDate)}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusConfig.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* ✅ PDF Download Button - Table Actions */}
                          <PDFDownloadLink
                            document={<InvoicePDF invoice={invoice} />}
                            fileName={`Invoice-${invoice.number}.pdf`}
                          >
                            {() => (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-emerald-50"
                                title="Download PDF"
                              >
                                <Download className="h-4 w-4 text-emerald-600" />
                              </Button>
                            )}
                          </PDFDownloadLink>

                          {/* View Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(invoice)}
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>

                          {/* Draft actions */}
                          {invoice.status === 'DRAFT' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(invoice.id, 'SENT')}
                                className="h-8 w-8 p-0 hover:bg-emerald-50"
                                title="Mark as Sent"
                              >
                                <Send className="h-4 w-4 text-emerald-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(invoice.id, invoice.number)}
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}

                          {/* Sent actions */}
                          {invoice.status === 'SENT' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(invoice.id, 'PAID')}
                              className="h-8 w-8 p-0 hover:bg-emerald-50"
                              title="Mark as Paid"
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Invoice Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="bg-white sm:max-w-150">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-xl font-bold text-slate-900 bg-white">
              Invoice {selectedInvoice?.number}
            </DialogTitle>
            <DialogDescription className="bg-white">
              View invoice details
            </DialogDescription>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4 bg-white">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Client</p>
                  <p className="font-semibold text-slate-900">{selectedInvoice.project?.client?.name}</p>
                  <p className="text-sm text-slate-500">{selectedInvoice.project?.client?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Project</p>
                  <p className="font-semibold text-slate-900">{selectedInvoice.project?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Amount</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(selectedInvoice.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                    getStatusConfig(selectedInvoice.status).color
                  }`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">Issue Date</p>
                  <p className="text-slate-900">{formatDate(selectedInvoice.issueDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Due Date</p>
                  <p className={`text-slate-900 ${
                    selectedInvoice.status === 'OVERDUE' ? 'text-red-600 font-medium' : ''
                  }`}>
                    {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
              </div>

              {selectedInvoice.description && (
                <div>
                  <p className="text-sm text-slate-500">Description</p>
                  <p className="text-slate-900">{selectedInvoice.description}</p>
                </div>
              )}

              {selectedInvoice.notes && (
                <div>
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="text-slate-900">{selectedInvoice.notes}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Close
                </Button>

                {/* ✅ PDF Download Button - View Modal */}
                <PDFDownloadLink
                  document={<InvoicePDF invoice={selectedInvoice} />}
                  fileName={`Invoice-${selectedInvoice.number}.pdf`}
                >
                  {({ loading }) => (
                    <Button 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={loading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {loading ? 'Generating...' : 'Download PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Wizard */}
      <InvoiceWizard
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          fetchInvoices();
        }}
      />
    </div>
  );
};

export default Invoices;