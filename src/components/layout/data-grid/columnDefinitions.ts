import { ColDef } from 'ag-grid-community';
import { DataGridUtils } from './ReusableDataGrid';

const { StatusCellRenderer, numberFormatter, currencyFormatter, dateFormatter } = DataGridUtils;

// Server-side action renderer that will be created with handlers
let ServerSideActionRenderer: any;

export const employeeColumns: ColDef[] = [
  {
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
    pinned: 'left',
    lockPosition: true,
    suppressMenu: true,
    suppressSorting: true,
    suppressFilter: true,
  },
  {
    headerName: 'ID',
    field: 'id',
    width: 80,
    pinned: 'left',
    cellClass: 'font-mono',
  },
  {
    headerName: 'First Name',
    field: 'firstName',
    width: 120,
    pinned: 'left',
  },
  {
    headerName: 'Last Name',
    field: 'lastName',
    width: 120,
    pinned: 'left',
  },
  {
    headerName: 'Email',
    field: 'email',
    width: 200,
    cellClass: 'font-mono text-blue-600',
  },
  {
    headerName: 'Department',
    field: 'department',
    width: 130,
    filter: 'agTextColumnFilter',
  },
  {
    headerName: 'Position',
    field: 'position',
    width: 150,
  },
  {
    headerName: 'Salary',
    field: 'salary',
    width: 120,
    valueFormatter: currencyFormatter,
    filter: 'agNumberColumnFilter',
    cellClass: 'font-mono text-green-600 font-semibold',
  },
  {
    headerName: 'Hire Date',
    field: 'hireDate',
    width: 120,
    valueFormatter: dateFormatter,
    filter: 'agDateColumnFilter',
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 100,
    cellRenderer: StatusCellRenderer,
    filter: 'agTextColumnFilter',
  },
  {
    headerName: 'Performance',
    field: 'performance',
    width: 120,
    valueFormatter: (params) => `${params.value}/5.0`,
    filter: 'agNumberColumnFilter',
    cellClass: 'font-semibold',
  },
  {
    headerName: 'Projects',
    field: 'projects',
    width: 100,
    valueFormatter: numberFormatter,
    filter: 'agNumberColumnFilter',
    cellClass: 'text-center',
  },
];

export const productColumns: ColDef[] = [
  {
    headerName: '',
    checkboxSelection: true,
    headerCheckboxSelection: true,
    width: 50,
    pinned: 'left',
    lockPosition: true,
    suppressMenu: true,
    suppressSorting: true,
    suppressFilter: true,
  },
  {
    headerName: 'ID',
    field: 'id',
    width: 80,
    pinned: 'left',
    cellClass: 'font-mono',
  },
  {
    headerName: 'Product Name',
    field: 'name',
    width: 180,
    pinned: 'left',
    cellClass: 'font-semibold',
  },
  {
    headerName: 'Category',
    field: 'category',
    width: 130,
    filter: 'agTextColumnFilter',
  },
  {
    headerName: 'Price',
    field: 'price',
    width: 120,
    valueFormatter: currencyFormatter,
    filter: 'agNumberColumnFilter',
    cellClass: 'font-mono text-green-600 font-semibold',
  },
  {
    headerName: 'Stock',
    field: 'stock',
    width: 100,
    valueFormatter: numberFormatter,
    filter: 'agNumberColumnFilter',
    cellClass: 'text-center font-mono',
    cellStyle: (params) => {
      if (params.value < 10) {
        return { color: 'red', fontWeight: 'bold' };
      }
      if (params.value < 25) {
        return { color: 'orange', fontWeight: 'bold' };
      }
      return { color: 'green' };
    },
  },
  {
    headerName: 'Supplier',
    field: 'supplier',
    width: 130,
  },
  {
    headerName: 'Date Added',
    field: 'dateAdded',
    width: 120,
    valueFormatter: dateFormatter,
    filter: 'agDateColumnFilter',
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 100,
    cellRenderer: StatusCellRenderer,
    filter: 'agTextColumnFilter',
  },
  {
    headerName: 'Rating',
    field: 'rating',
    width: 100,
    valueFormatter: (params) => `★ ${params.value}`,
    filter: 'agNumberColumnFilter',
    cellClass: 'text-yellow-600 font-semibold text-center',
  },
];

// Simple column configuration for basic usage
export const simpleEmployeeColumns: ColDef[] = [
  { headerName: 'ID', field: 'id', width: 80 },
  { headerName: 'Name', valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`, width: 150 },
  { headerName: 'Email', field: 'email', width: 200 },
  { headerName: 'Department', field: 'department', width: 130 },
  { headerName: 'Position', field: 'position', width: 150 },
  { headerName: 'Salary', field: 'salary', valueFormatter: currencyFormatter, width: 120 },
];

// Function to create columns with server-side actions
export const createEmployeeColumnsWithActions = (onUpdate: (data: any) => void, onDelete: (data: any) => void): ColDef[] => {
  const ActionRenderer = DataGridUtils.createServerSideActionRenderer(onUpdate, onDelete);
  
  return [
    ...employeeColumns,
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: ActionRenderer,
      suppressMenu: true,
      suppressSorting: true,
      suppressFilter: true,
      pinned: 'right',
    },
  ];
};

export const createProductColumnsWithActions = (onUpdate: (data: any) => void, onDelete: (data: any) => void): ColDef[] => {
  const ActionRenderer = DataGridUtils.createServerSideActionRenderer(onUpdate, onDelete);
  
  return [
    ...productColumns,
    {
      headerName: 'Actions',
      width: 150,
      cellRenderer: ActionRenderer,
      suppressMenu: true,
      suppressSorting: true,
      suppressFilter: true,
      pinned: 'right',
    },
  ];
};