import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, Users, X, Eye, FilePlus } from 'lucide-react';
import { clientsAPI } from '../services/api';
import InvoiceWizard from '../components/InvoiceWizard';
import { Button } from '@/components/ui/button';
import ConfirmDeleteDialog from '../components/ConfirmDeleteDialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Clients = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingClient, setViewingClient] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [isInvoiceWizardOpen, setIsInvoiceWizardOpen] = useState(false);
  const [invoiceProjectId, setInvoiceProjectId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientsAPI.getAll();
      setClients(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load clients');
      console.error('Fetch clients error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients on mount
  useEffect(() => {
    let cancelled = false;

    const loadClients = async () => {
      try {
        const response = await clientsAPI.getAll();
        if (!cancelled) {
          setClients(response.data.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error('Failed to load clients');
          console.error('Fetch clients error:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadClients();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get('new') !== '1') return;
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', address: '' });
    setIsModalOpen(true);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('new');
      return next;
    }, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleOpenModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address || '',
      });
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingClient) {
        // Update existing client
        await clientsAPI.update(editingClient.id, formData);
        toast.success('Client updated successfully!');
      } else {
        // Create new client
        await clientsAPI.create(formData);
        toast.success('Client created successfully!');
      }
      handleCloseModal();
      fetchClients();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
      console.error('Submit client error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (client) => {
    const projectCount = client._count?.projects || 0;
    if (projectCount > 0) {
      toast.warning(`Delete or move this client's ${projectCount} ${projectCount === 1 ? 'project' : 'projects'} before deleting the client.`);
      return;
    }

    setDeleteTarget(client);
  };

  const handleViewClient = async (client) => {
    setViewingClient(client);
    setDetailsError('');
    setIsDetailsOpen(true);
    setIsDetailsLoading(true);
    try {
      const response = await clientsAPI.getById(client.id);
      setViewingClient(response.data.data);
    } catch (error) {
      setDetailsError(error.response?.data?.message || 'Could not load this client’s work history.');
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const startInvoiceForProject = (projectId) => {
    setIsDetailsOpen(false);
    setInvoiceProjectId(projectId);
    setIsInvoiceWizardOpen(true);
  };

  const clientProjects = viewingClient?.projects || [];
  const clientInvoices = clientProjects.flatMap((project) => project.invoices || []);
  const billedTotal = clientInvoices
    .filter((invoice) => invoice.status !== 'CANCELLED')
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const collectedTotal = clientInvoices
    .filter((invoice) => invoice.status === 'PAID')
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const outstandingTotal = clientInvoices
    .filter((invoice) => ['DRAFT', 'SENT', 'OVERDUE'].includes(invoice.status))
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
  const formatClientCurrency = (amount) => new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(amount || 0);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await clientsAPI.delete(deleteTarget.id);
      toast.success('Client deleted successfully!');
      setDeleteTarget(null);
      fetchClients();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete client';
      toast.error(message);
      console.error('Delete client error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter clients by search term
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredClients = clients.filter((client) =>
    [client.name, client.email, client.phone]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-emerald-600" />
            Clients
          </h1>
          <p className="text-slate-500">Manage your clients and their projects</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search clients by name, email, or phone..."
          aria-label="Search clients by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Clear client search"
            onClick={() => setSearchTerm('')}
            className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!loading && clients.length > 0 && (
        <p className="-mt-4 text-sm text-slate-500" aria-live="polite">
          Showing {filteredClients.length} of {clients.length} {clients.length === 1 ? 'client' : 'clients'}
        </p>
      )}

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-slate-500 mt-2">Loading clients...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">
              {normalizedSearch ? 'No clients match your search' : 'No clients yet'}
            </p>
            {normalizedSearch ? (
              <Button
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="mt-3"
              >
                Clear search
              </Button>
            ) : (
              <Button
                onClick={() => handleOpenModal()}
                variant="outline"
                className="mt-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add your first client
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone || '-'}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {client._count?.projects || 0} projects
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewClient(client)}
                          className="h-8 w-8 p-0 hover:bg-emerald-50"
                          aria-label={`View ${client.name} overview`}
                          title={`View ${client.name} overview`}
                        >
                          <Eye className="h-4 w-4 text-emerald-700" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(client)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          aria-label={`Delete ${client.name}`}
                          title={client._count?.projects ? 'Delete or move this client’s projects first' : `Delete ${client.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add/Edit Client Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </DialogTitle>
            <DialogDescription>
              {editingClient
                ? 'Update the client information below.'
                : 'Enter the client details below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Lagos, Nigeria"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="focus:border-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  editingClient ? 'Update Client' : 'Add Client'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingClient?.name || 'Client overview'}</DialogTitle>
            <DialogDescription>
              {viewingClient?.email || viewingClient?.phone || 'Client activity and billing history'}
            </DialogDescription>
          </DialogHeader>

          {isDetailsLoading ? (
            <div className="grid min-h-40 place-items-center text-sm text-slate-500" role="status">
              Loading client activity…
            </div>
          ) : detailsError ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="alert">
              {detailsError}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">Billed</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">{formatClientCurrency(billedTotal)}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-medium text-emerald-700">Collected</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-800">{formatClientCurrency(collectedTotal)}</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-medium text-amber-700">Outstanding</p>
                  <p className="mt-1 text-lg font-semibold text-amber-800">{formatClientCurrency(outstandingTotal)}</p>
                </div>
              </div>

              <section aria-labelledby="client-projects-title">
                <h3 id="client-projects-title" className="text-sm font-semibold text-slate-900">Projects</h3>
                {clientProjects.length ? (
                  <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {clientProjects.map((project) => {
                      const invoicesForProject = project.invoices || [];
                      const projectBilled = invoicesForProject
                        .filter((invoice) => invoice.status !== 'CANCELLED')
                        .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
                      return (
                        <li key={project.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900">{project.name}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {project.status.replaceAll('_', ' ')} · {invoicesForProject.length} {invoicesForProject.length === 1 ? 'invoice' : 'invoices'} · {formatClientCurrency(projectBilled)} billed
                            </p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => startInvoiceForProject(project.id)}>
                            <FilePlus className="mr-2 h-4 w-4" /> Create invoice
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="mt-2 rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    This client has no projects yet. Add a project before creating an invoice.
                  </div>
                )}
              </section>

              <section aria-labelledby="client-invoices-title">
                <div className="flex items-center justify-between gap-3">
                  <h3 id="client-invoices-title" className="text-sm font-semibold text-slate-900">Recent invoices</h3>
                  <span className="text-xs text-slate-500">{clientInvoices.length} total</span>
                </div>
                {clientInvoices.length ? (
                  <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
                    {clientProjects.flatMap((project) => (project.invoices || []).map((invoice) => ({ ...invoice, projectName: project.name })))
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((invoice) => (
                        <li key={invoice.id} className="flex items-center justify-between gap-3 p-3 text-sm">
                          <span className="min-w-0 truncate text-slate-700">{invoice.number} · {invoice.projectName}</span>
                          <span className="shrink-0 text-right">
                            <span className="block font-medium text-slate-900">{formatClientCurrency(Number(invoice.amount))}</span>
                            <span className="text-xs text-slate-500">{invoice.status}</span>
                          </span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No invoices for this client yet.</p>
                )}
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Delete ${deleteTarget?.name || 'client'}?`}
        description="This permanently removes the client record. This action cannot be undone."
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
      <InvoiceWizard
        isOpen={isInvoiceWizardOpen}
        initialProjectId={invoiceProjectId}
        onClose={() => {
          setIsInvoiceWizardOpen(false);
          setInvoiceProjectId(null);
          fetchClients();
        }}
      />
    </div>
  );
};

export default Clients;
