import * as XLSX from 'xlsx';

export interface ExportColumn {
  key: string;
  header: string;
  accessor?: (row: any) => any;
}

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn[],
  filename: string = 'export'
) {
  // Prepare headers
  const headers = columns.map(col => col.header);
  
  // Prepare data rows
  const rows = data.map(row => 
    columns.map(col => {
      if (col.accessor) {
        return col.accessor(row);
      }
      return (row as any)[col.key] || '';
    })
  );

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn[],
  filename: string = 'export'
) {
  // Prepare data for Excel
  const excelData = data.map(row => {
    const excelRow: any = {};
    columns.forEach(col => {
      if (col.accessor) {
        excelRow[col.header] = col.accessor(row);
      } else {
        excelRow[col.header] = (row as any)[col.key] || '';
      }
    });
    return excelRow;
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Auto-size columns
  const colWidths = columns.map(col => ({
    wch: Math.max(col.header.length, 15)
  }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');

  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function formatCellValue(value: any): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}