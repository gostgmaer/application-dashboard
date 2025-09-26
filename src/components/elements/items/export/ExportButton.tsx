"use client";

import { useState } from 'react';
import { Download, FileText, Table, FileSpreadsheet } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
  filename: string;
  title?: string;
}

export function ExportButton({ data, filename, title = "Export Data" }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const exportToPDF = () => {
    // In a real application, you would use a library like jsPDF
    console.log('Exporting to PDF:', data);
    alert('PDF export would be implemented with a library like jsPDF');
    setIsOpen(false);
  };

  const exportToExcel = () => {
    // In a real application, you would use a library like xlsx
    console.log('Exporting to Excel:', data);
    alert('Excel export would be implemented with a library like SheetJS');
    setIsOpen(false);
  };

  const exportToCSV = () => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-2">
              <button
                onClick={exportToPDF}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as PDF
              </button>
              <button
                onClick={exportToExcel}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Export as Excel
              </button>
              <button
                onClick={exportToCSV}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Table className="h-4 w-4 mr-2" />
                Export as CSV
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}