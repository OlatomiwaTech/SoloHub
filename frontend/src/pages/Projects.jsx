import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, FolderOpen, Link } from 'lucide-react';
import { projectsAPI, clientsAPI } from '../services/api';
import { Button } from '@/components/ui/button';
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
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
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

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      toast.success('Project deleted successfully!');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete project';
      toast.error(message);
      console.error('Delete project error:', error);
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

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {searchTerm ? 'No projects match your search' : 'No projects yet'}
            </p>
            <Button
              onClick={() => handleOpenModal()}
              variant="outline"
              className="mt-3 bg-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first project
            </Button>
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
                          onClick={() => handleDelete(project.id, project.name)}
                          className="h-8 w-8 p-0 hover:bg-red-50"
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
    </div>
  );
};

export default Projects;