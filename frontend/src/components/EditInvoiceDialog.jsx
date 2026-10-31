import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { invoicesAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const EditInvoiceDialog = ({ invoice, open, onOpenChange, onUpdated }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open || !invoice) return;
    setAmount(String(Number(invoice.amount) || ''));
    setDescription(invoice.description || '');
    setDueDate(invoice.dueDate ? new Date(invoice.dueDate).toISOString().slice(0, 10) : '');
  }, [open, invoice]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 99999999.99) {
      toast.error('Enter an amount between ₦0.01 and ₦99,999,999.99');
      return;
    }
    if (description.trim().length < 3) {
      toast.error('Description must be at least 3 characters');
      return;
    }
    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      toast.error('Choose a valid due date');
      return;
    }

    setIsSaving(true);
    try {
      await invoicesAPI.update(invoice.id, {
        amount: numericAmount,
        description: description.trim(),
        dueDate,
      });
      toast.success(`Invoice ${invoice.number} updated`);
      onUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update invoice');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSaving && onOpenChange(nextOpen)}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit invoice {invoice?.number}</DialogTitle>
          <DialogDescription>
            Update the amount, work description, or due date.
          </DialogDescription>
        </DialogHeader>

        {invoice && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {['SENT', 'OVERDUE'].includes(invoice.status) && (
              <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-amber-900">
                The client’s existing invoice won’t change automatically. After saving, prepare an updated email from the invoice actions.
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-invoice-amount">Amount (₦)</Label>
              <Input
                id="edit-invoice-amount"
                type="number"
                min="0.01"
                max="99999999.99"
                step="0.01"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-invoice-description">Description of work</Label>
              <Input
                id="edit-invoice-description"
                minLength={3}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-invoice-due-date">Due date</Label>
              <Input
                id="edit-invoice-due-date"
                type="date"
                required
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 text-white hover:bg-emerald-700" disabled={isSaving}>
                {isSaving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceDialog;
