import { Invoice, InvoiceStats, PaginatedResponse } from '@/types/invoice';

export const dummyInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2025-001',
    customerId: 'c1',
    customer: {
      id: 'c1',
      name: 'Acme Corporation',
      email: 'billing@acme.com',
      address: '123 Business St, New York, NY 10001',
      phone: '+1 (555) 123-4567',
    },
    items: [
      {
        id: 'i1',
        description: 'Web Development Services',
        quantity: 40,
        unitPrice: 150,
        taxRate: 10,
        total: 6600,
      },
      {
        id: 'i2',
        description: 'UI/UX Design',
        quantity: 20,
        unitPrice: 120,
        taxRate: 10,
        total: 2640,
      },
    ],
    subtotal: 8400,
    tax: 840,
    total: 9240,
    status: 'paid',
    issueDate: '2025-09-01',
    dueDate: '2025-09-30',
    notes: 'Thank you for your business!',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-09-15T14:30:00Z',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2025-002',
    customerId: 'c2',
    customer: {
      id: 'c2',
      name: 'TechStart Inc',
      email: 'accounts@techstart.io',
      address: '456 Innovation Ave, San Francisco, CA 94102',
      phone: '+1 (555) 234-5678',
    },
    items: [
      {
        id: 'i3',
        description: 'Mobile App Development',
        quantity: 80,
        unitPrice: 180,
        taxRate: 8,
        total: 15552,
      },
    ],
    subtotal: 14400,
    tax: 1152,
    total: 15552,
    status: 'unpaid',
    issueDate: '2025-09-15',
    dueDate: '2025-10-15',
    notes: 'Payment terms: Net 30',
    createdAt: '2025-09-15T09:00:00Z',
    updatedAt: '2025-09-15T09:00:00Z',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2025-003',
    customerId: 'c3',
    customer: {
      id: 'c3',
      name: 'Global Solutions Ltd',
      email: 'finance@globalsolutions.com',
      address: '789 Enterprise Blvd, Chicago, IL 60601',
      phone: '+1 (555) 345-6789',
    },
    items: [
      {
        id: 'i4',
        description: 'Cloud Infrastructure Setup',
        quantity: 1,
        unitPrice: 5000,
        taxRate: 10,
        total: 5500,
      },
      {
        id: 'i5',
        description: 'Monthly Support & Maintenance',
        quantity: 3,
        unitPrice: 800,
        taxRate: 10,
        total: 2640,
      },
    ],
    subtotal: 7400,
    tax: 740,
    total: 8140,
    status: 'overdue',
    issueDate: '2025-08-01',
    dueDate: '2025-08-31',
    notes: 'Please contact us regarding payment.',
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2025-08-01T08:00:00Z',
  },
  {
    id: '4',
    invoiceNumber: 'INV-2025-004',
    customerId: 'c4',
    customer: {
      id: 'c4',
      name: 'Retail Masters Co',
      email: 'payments@retailmasters.com',
      address: '321 Commerce Way, Austin, TX 73301',
      phone: '+1 (555) 456-7890',
    },
    items: [
      {
        id: 'i6',
        description: 'E-commerce Platform Integration',
        quantity: 60,
        unitPrice: 160,
        taxRate: 8,
        total: 10368,
      },
    ],
    subtotal: 9600,
    tax: 768,
    total: 10368,
    status: 'unpaid',
    issueDate: '2025-09-20',
    dueDate: '2025-10-20',
    createdAt: '2025-09-20T11:00:00Z',
    updatedAt: '2025-09-20T11:00:00Z',
  },
  {
    id: '5',
    invoiceNumber: 'INV-2025-005',
    customerId: 'c5',
    customer: {
      id: 'c5',
      name: 'Digital Media Group',
      email: 'billing@digitalmedia.net',
      address: '654 Creative Lane, Los Angeles, CA 90001',
      phone: '+1 (555) 567-8901',
    },
    items: [
      {
        id: 'i7',
        description: 'Brand Identity Design',
        quantity: 1,
        unitPrice: 3500,
        taxRate: 10,
        total: 3850,
      },
      {
        id: 'i8',
        description: 'Marketing Collateral',
        quantity: 5,
        unitPrice: 400,
        taxRate: 10,
        total: 2200,
      },
    ],
    subtotal: 5500,
    tax: 550,
    total: 6050,
    status: 'paid',
    issueDate: '2025-09-10',
    dueDate: '2025-09-25',
    createdAt: '2025-09-10T15:00:00Z',
    updatedAt: '2025-09-24T10:00:00Z',
  },
];

export const dummyStats: InvoiceStats = {
  totalInvoices: 5,
  totalPaid: 2,
  totalUnpaid: 2,
  totalOverdue: 1,
  totalAmount: 49350,
  paidAmount: 15290,
  unpaidAmount: 25920,
  overdueAmount: 8140,
};

export function getDummyInvoices(filters: any = {}): PaginatedResponse<Invoice> {
  let filtered = [...dummyInvoices];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(search) ||
        inv.customer.name.toLowerCase().includes(search) ||
        inv.customer.email.toLowerCase().includes(search)
    );
  }

  if (filters.status) {
    filtered = filtered.filter((inv) => inv.status === filters.status);
  }

  if (filters.customerId) {
    filtered = filtered.filter((inv) => inv.customerId === filters.customerId);
  }

  if (filters.startDate) {
    filtered = filtered.filter((inv) => inv.issueDate >= filters.startDate);
  }

  if (filters.endDate) {
    filtered = filtered.filter((inv) => inv.issueDate <= filters.endDate);
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy as keyof Invoice];
      const bVal = b[filters.sortBy as keyof Invoice];

      if (!aVal || !bVal) return 0;
      if (aVal < bVal) return filters.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return filters.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}
