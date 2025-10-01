'use client';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Download } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Invoice, InvoiceFilters, InvoiceStats } from '@/types/invoice';
import { dummyStats, getDummyInvoices } from './dummy-data';
import { generateAutoInvoice } from '@/lib/utils/invoice-utils';
import { InvoiceStatsCards } from './invoices/invoice-stats';
import { InvoiceTable } from './invoices/invoice-table';
import { InvoicePagination } from './invoices/invoice-pagination';
import { InvoicePreviewModal } from './invoices/invoice-preview-modal';
import { InvoiceFormModal } from './invoices/invoice-form-modal';
import { InvoiceFilters as FilterComponent } from './invoices/invoice-filters';

export default function InvoiceDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats>(dummyStats);
  const [filters, setFilters] = useState<InvoiceFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, [filters]);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const result = getDummyInvoices(filters);
      setInvoices(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.total);
    } catch (error) {
      toast.error('Failed to fetch invoices');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedInvoice(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleAutoGenerate = () => {
    const autoInvoice = generateAutoInvoice();
    setSelectedInvoice(autoInvoice as Invoice);
    setFormMode('create');
    setFormOpen(true);
    toast.success('Invoice template generated! Please fill in the details.');
  };

  const handleSave = async (invoiceData: Partial<Invoice>) => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (formMode === 'create') {
        toast.success('Invoice created successfully!');
      } else {
        toast.success('Invoice updated successfully!');
      }

      setFormOpen(false);
      fetchInvoices();
    } catch (error) {
      toast.error(`Failed to ${formMode === 'create' ? 'create' : 'update'} invoice`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invoiceToDelete) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Invoice deleted successfully!');
      setDeleteDialogOpen(false);
      setInvoiceToDelete(null);
      fetchInvoices();
    } catch (error) {
      toast.error('Failed to delete invoice');
      console.error(error);
    }
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    try {
      toast.info('Generating PDF...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download PDF');
      console.error(error);
    }
  };

  const handleFiltersChange = (newFilters: InvoiceFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: filters.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handlePageSizeChange = (limit: number) => {
    setFilters({ ...filters, limit, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className=" px-2 py-8 ">
        

        <div className="mb-8">
          <InvoiceStatsCards stats={stats} isLoading={isLoading} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Invoices</h2>
            <div className="flex gap-2">
              <Button onClick={handleAutoGenerate} variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Auto-Generate
              </Button>
              <Button onClick={handleCreate} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <FilterComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>

          <InvoiceTable
            invoices={invoices}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onDownloadPDF={handleDownloadPDF}
          />

          {!isLoading && invoices.length > 0 && (
            <InvoicePagination
              currentPage={filters.page || 1}
              totalPages={totalPages}
              pageSize={filters.limit || 10}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>

        <InvoicePreviewModal
          invoice={selectedInvoice}
          open={previewOpen}
          onClose={() => {
            setPreviewOpen(false);
            setSelectedInvoice(null);
          }}
          onDownloadPDF={handleDownloadPDF}
        />

        <InvoiceFormModal
          invoice={selectedInvoice}
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
            setSelectedInvoice(null);
          }}
          onSave={handleSave}
          mode={formMode}
          isLoading={isSaving}
        />

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete invoice{' '}
                <span className="font-semibold">{invoiceToDelete?.invoiceNumber}</span>.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
