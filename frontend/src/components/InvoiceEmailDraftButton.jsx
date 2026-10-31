import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatAmount = (amount) => new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 2,
}).format(Number(amount) || 0);

const InvoiceEmailDraftButton = ({ invoice, fullWidth = false }) => {
  const client = invoice.project?.client;
  const email = client?.email?.trim();

  if (!email) {
    return (
      <Button
        type="button"
        variant={fullWidth ? 'outline' : 'ghost'}
        size={fullWidth ? 'default' : 'sm'}
        className={fullWidth ? '' : 'h-8 w-8 p-0'}
        disabled
        title="Add an email address to this client to draft an email"
        aria-label="Client email address is missing"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        {fullWidth && <span className="ml-2">Email draft</span>}
      </Button>
    );
  }

  const projectName = invoice.project?.name || 'your project';
  const dueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Not specified';
  const subject = `Invoice ${invoice.number} — ${projectName}`;
  const body = [
    `Hello ${client.name || 'there'},`,
    '',
    `Here are the details for invoice ${invoice.number}:`,
    '',
    `Project: ${projectName}`,
    `Amount: ${formatAmount(invoice.amount)}`,
    `Due date: ${dueDate}`,
    ...(invoice.description ? [`Description: ${invoice.description}`] : []),
    '',
    'Please let me know if you have any questions.',
  ].join('\n');
  const href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <Button
      asChild
      variant={fullWidth ? 'outline' : 'ghost'}
      size={fullWidth ? 'default' : 'sm'}
      className={fullWidth ? '' : 'h-8 w-8 p-0 hover:bg-emerald-50'}
    >
      <a
        href={href}
        title="Opens an email draft. Attach the invoice PDF before sending."
        aria-label={`Draft invoice ${invoice.number} email to ${client.name || email}`}
      >
        <Mail className={`h-4 w-4 ${fullWidth ? '' : 'text-emerald-600'}`} aria-hidden="true" />
        {fullWidth && <span className="ml-2">Email draft</span>}
      </a>
    </Button>
  );
};

export default InvoiceEmailDraftButton;
