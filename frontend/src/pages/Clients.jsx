import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Search, Users } from 'lucide-react';
import { clientsAPI } from '../services/api';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Clients = () => {
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

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await clientsAPI.delete(id);
      toast.success('Client deleted successfully!');
      fetchClients();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete client';
      toast.error(message);
      console.error('Delete client error:', error);
    }
  };

  // Filter clients by search term
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
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
          placeholder="Search clients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
        />
      </div>

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
              {searchTerm ? 'No clients match your search' : 'No clients yet'}
            </p>
            <Button
              onClick={() => handleOpenModal()}
              variant="outline"
              className="mt-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add your first client
            </Button>
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
                          onClick={() => handleOpenModal(client)}
                          className="h-8 w-8 p-0 hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.id, client.name)}
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
    </div>
  );
};

export default Clients;