export const getInvoiceDisplayStatus = (invoice) => {
  if (!invoice || invoice.status !== 'SENT' || !invoice.dueDate) return invoice?.status || 'DRAFT';

  const dueDate = new Date(invoice.dueDate);
  if (Number.isNaN(dueDate.getTime())) return invoice.status;

  const today = new Date();
  const dueDay = Date.UTC(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  const todayDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return dueDay < todayDay ? 'OVERDUE' : invoice.status;
};
