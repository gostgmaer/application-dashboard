import { Invoice, Customer } from '@/types/invoice';

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}-${random}`;
}

export function generateAutoInvoice(customer?: Partial<Customer>): Partial<Invoice> {
  const issueDate = new Date();
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    invoiceNumber: generateInvoiceNumber(),
    status: 'draft',
    issueDate: issueDate.toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    customer: customer ? {
      id: customer.id || 'temp',
      name: customer.name || '',
      email: customer.email || '',
      address: customer.address || '',
      phone: customer.phone || '',
    } : {
      id: 'temp',
      name: '',
      email: '',
      address: '',
      phone: '',
    },
    items: [
      {
        id: `temp-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 0,
        total: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: 'Thank you for your business!',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
