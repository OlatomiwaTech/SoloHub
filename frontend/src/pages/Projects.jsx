import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, FolderOpen, Link, FilePlus } from 'lucide-react';
import { projectsAPI, clientsAPI } from '../services/api';
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

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    rate: '',
    clientId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInvoiceWizardOpen, setIsInvoiceWizardOpen] = useState(false);
  const [invoiceProjectId, setInvoiceProjectId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, clientsRes] = await Promise.all([
        projectsAPI.getAll(),
        clientsAPI.getAll(),
      ]);
      setProjects(projectsRes.data.data || []);
      setClients(clientsRes.data.data || []);
    } catch (error) {
      toast.error('Failed to load data');
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects and clients on mount
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const [projectsRes, clientsRes] = await Promise.all([
          projectsAPI.getAll(),
          clientsAPI.getAll(),
        ]);
        if (!cancelled) {
          setProjects(projectsRes.data.data || []);
          setClients(clientsRes.data.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error('Failed to load data');
          console.error('Fetch data error:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'ACTIVE',
        rate: project.rate ? String(project.rate) : '',
        clientId: project.clientId || '',
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        status: 'ACTIVE',
        rate: '',
        clientId: '',
      });
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (searchParams.get('new') !== '1') return;
    setEditingProject(null);
    setFormData({ name: '', description: '', status: 'ACTIVE', rate: '', clientId: '' });
    setIsModalOpen(true);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('new');
      return next;
    }, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      status: 'ACTIVE',
      rate: '',
      clientId: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        ...formData,
        rate: formData.rate ? parseFloat(formData.rate) : null,
      };

      if (editingProject) {
        await projectsAPI.update(editingProject.id, data);
        toast.success('Project updated successfully!');
      } else {
        await projectsAPI.create(data);
        toast.success('Project created successfully!');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
      console.error('Submit project error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    const invoiceCount = project._count?.invoices || 0;
    if (invoiceCount > 0) {
      toast.warning(`Delete or move this project's ${invoiceCount} ${invoiceCount === 1 ? 'invoice' : 'invoices'} before deleting the project.`);
      return;
    }

    setDeleteTarget(project);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await projectsAPI.delete(deleteTarget.id);
      toast.success('Project deleted successfully!');
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      console.error('Delete project error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-emerald-100 text-emerald-700',
      ON_HOLD: 'bg-amber-100 text-amber-700',
      COMPLETED: 'bg-blue-100 text-blue-700',
      CANCELLED: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusLabel = (status) => {
    const labels = {
      ACTIVE: 'Active',
      ON_HOLD: 'On Hold',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
    };
    return labels[status] || status;
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter;
    const matchesSearch = !normalizedSearch ||
      project.name.toLowerCase().includes(normalizedSearch) ||
      project.client?.name?.toLowerCase().includes(normalizedSearch);
    return matchesStatus && matchesSearch;
  });
  const hasActiveFilters = Boolean(normalizedSearch) || statusFilter !== 'ALL';
  const projectStatusFilters = [
    { value: 'ALL', label: 'All projects', count: projects.length },
    ...['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map((status) => ({
      value: status,
      label: getStatusLabel(status),
      count: projects.filter((project) => project.status === status).length,
    })),
  ];
  const formatProjectCurrency = (amount) => `₦${Number(amount || 0).toLocaleString('en-NG', { maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div className="bg-white">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2 bg-white">
            <FolderOpen className="h-8 w-8 text-emerald-600" />
            Projects
          </h1>
          <p className="text-slate-500 bg-white">Manage your projects and track progress</p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search projects by name or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by status">
        {projectStatusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={statusFilter === filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 ${statusFilter === filter.value ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-300'}`}
          >
            {filter.label}<span className="text-[11px] opacity-70">{filter.count}</span>
          </button>
        ))}
        {!loading && projects.length > 0 && (
          <span className="ml-auto text-xs text-slate-500" aria-live="polite">
            Showing {filteredProjects.length} of {projects.length}
          </span>
        )}
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center bg-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="text-slate-500 mt-2">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-8 text-center bg-white">
            <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 bg-white">
              {hasActiveFilters ? 'No projects match these filters' : 'No projects yet'}
            </p>
            {hasActiveFilters ? (
              <Button
                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                variant="outline"
                className="mt-3 bg-white"
              >
                Clear filters
              </Button>
            ) : (
              <Button onClick={() => handleOpenModal()} variant="outline" className="mt-3 bg-white">
                <Plus className="mr-2 h-4 w-4" /> Add your first project
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Invoices</TableHead>
                  <TableHead>Invoiced</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const projectInvoices = project.invoices || [];
                  const invoicedTotal = projectInvoices
                    .filter((invoice) => ['SENT', 'OVERDUE', 'PAID'].includes(invoice.status))
                    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);
                  const outstandingTotal = projectInvoices
                    .filter((invoice) => ['SENT', 'OVERDUE'].includes(invoice.status))
                    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

                  return (
                  <TableRow key={project.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      {project.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-slate-700">
                        <Link className="h-3 w-3" />
                        {project.client?.name || 'No client'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {project.rate ? `₦${Number(project.rate).toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {project._count?.invoices || 0} invoices
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">{formatProjectCurrency(invoicedTotal)}</TableCell>
                    <TableCell className={outstandingTotal > 0 ? 'font-medium text-amber-700' : 'text-slate-500'}>
                      {formatProjectCurrency(outstandingTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setInvoiceProjectId(project.id);
                            setIsInvoiceWizardOpen(true);
                          }}
                          className="h-8 w-8 p-0 hover:bg-emerald-50"
                          aria-label={`Create invoice for ${project.name}`}
                          title={`Create invoice for ${project.name}`}
                        >
                          <FilePlus className="h-4 w-4 text-emerald-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenModal(project)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(project)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                          aria-label={`Delete ${project.name}`}
                          title={project._count?.invoices ? 'Delete or move this project’s invoices first' : `Delete ${project.name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
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

      {/* Add/Edit Project Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-125 bg-white">
          <DialogHeader className="bg-white">
            <DialogTitle className="text-xl font-bold text-slate-900 bg-white">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
            <DialogDescription className="bg-white text-slate-500">
              {editingProject
                ? 'Update the project information below.'
                : 'Enter the project details below.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white">
            <div className="space-y-2 bg-white">
              <Label htmlFor="name" className="text-slate-700 bg-white">
                Project Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="E-commerce Website"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="space-y-2 bg-white">
              <Label htmlFor="clientId" className="text-slate-700 bg-white">
                Client <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                  <SelectValue placeholder="Select a client..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {clients.length === 0 ? (
                    <div className="p-2 text-sm text-slate-500">
                      No clients found. Add a client first.
                    </div>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {!formData.clientId && (
                <p className="text-xs text-slate-500">Select a client for this project</p>
              )}
            </div>

            <div className="space-y-2 bg-white">
              <Label htmlFor="description" className="text-slate-700 bg-white">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Brief description of the project"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 bg-white">
              <div className="space-y-2 bg-white">
                <Label htmlFor="status" className="text-slate-700 bg-white">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="bg-white border-slate-300 focus:border-emerald-500 focus:ring-emerald-500">
                    <SelectValue placeholder="Select status..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 bg-white">
                <Label htmlFor="rate" className="text-slate-700 bg-white">
                  Rate (₦)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  placeholder="250000"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                className="flex-1 bg-white"
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
                  editingProject ? 'Update Project' : 'Add Project'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        title={`Delete ${deleteTarget?.name || 'project'}?`}
        description="This permanently removes the project record. This action cannot be undone."
        onConfirm={confirmDelete}
        isPending={isDeleting}
      />
      <InvoiceWizard
        isOpen={isInvoiceWizardOpen}
        initialProjectId={invoiceProjectId}
        onClose={() => {
          setIsInvoiceWizardOpen(false);
          setInvoiceProjectId(null);
          fetchData();
        }}
      />
    </div>
  );
};

export default Projects;
