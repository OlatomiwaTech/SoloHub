import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: 2,
    borderBottomColor: '#059669',
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 11,
    color: '#1E293B',
    fontWeight: 'bold',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  col1: { flex: 3 },
  col2: { flex: 2, textAlign: 'right' },
  col3: { flex: 2, textAlign: 'right' },
  total: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    marginRight: 20,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    color: '#94A3B8',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 15,
  },
  status: {
    padding: 6,
    borderRadius: 20,
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
  },
  statusPaid: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  statusDraft: {
    backgroundColor: '#F1F5F9',
    color: '#475569',
  },
  statusSent: {
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
  },
  statusOverdue: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
});

const InvoicePDF = ({ invoice }) => {
  // Safe data extraction with fallbacks
  const clientName = invoice?.project?.client?.name || invoice?.client?.name || 'N/A';
  const clientEmail = invoice?.project?.client?.email || invoice?.client?.email || 'N/A';
  const projectName = invoice?.project?.name || 'N/A';
  const userName = invoice?.user?.fullName || 'SoloHub User';
  const userEmail = invoice?.user?.email || 'user@example.com';

  const getStatusStyle = (status) => {
    const statusMap = {
      PAID: styles.statusPaid,
      DRAFT: styles.statusDraft,
      SENT: styles.statusSent,
      OVERDUE: styles.statusOverdue,
    };
    return [styles.status, statusMap[status] || styles.statusDraft];
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'NGN 0';
    return `NGN ${Number(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>SoloHub</Text>
            <Text style={styles.subtitle}>Freelance Command Center</Text>
          </View>
          <View>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subtitle}>#{invoice?.number || 'N/A'}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Text style={getStatusStyle(invoice?.status)}>{invoice?.status || 'DRAFT'}</Text>
        </View>

        {/* From/To */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>{userName}</Text>
            <Text style={styles.value}>{userEmail}</Text>
          </View>
          <View>
            <Text style={styles.label}>Bill To</Text>
            <Text style={styles.value}>{clientName}</Text>
            <Text style={styles.value}>{clientEmail}</Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={{ marginBottom: 20 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date</Text>
            <Text style={styles.value}>{formatDate(invoice?.issueDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Due Date</Text>
            <Text style={styles.value}>{formatDate(invoice?.dueDate)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Project</Text>
            <Text style={styles.value}>{projectName}</Text>
          </View>
        </View>

        {/* Description */}
        {invoice?.description && (
          <View style={{ marginBottom: 20, backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8 }}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.value}>{invoice.description}</Text>
          </View>
        )}

        {/* Amount Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.value, styles.col1]}>Description</Text>
            <Text style={[styles.value, styles.col2]}>Qty</Text>
            <Text style={[styles.value, styles.col3]}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>{invoice?.description || 'Service'}</Text>
            <Text style={styles.col2}>1</Text>
            <Text style={styles.col3}>{formatCurrency(invoice?.amount)}</Text>
          </View>
        </View>

        {/* Total */}
        <View style={styles.total}>
          <Text style={styles.totalLabel}>Total Due</Text>
          <Text style={styles.totalAmount}>{formatCurrency(invoice?.amount)}</Text>
        </View>

        {/* Notes */}
        {invoice?.notes && (
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Notes</Text>
            <Text style={styles.value}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for your business!</Text>
          <Text>Made in Nigeria</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;