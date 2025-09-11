export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'Pending';
  performance: number;
  projects: number;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  supplier: string;
  dateAdded: string;
  status: 'Active' | 'Inactive' | 'Pending';
  rating: number;
}

export const employeeData: Employee[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 95000,
    hireDate: '2022-01-15',
    status: 'Active',
    performance: 4.5,
    projects: 8,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 75000,
    hireDate: '2021-03-10',
    status: 'Active',
    performance: 4.2,
    projects: 12,
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@company.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 70000,
    hireDate: '2023-06-01',
    status: 'Pending',
    performance: 4.0,
    projects: 3,
  },
  {
    id: 4,
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah.wilson@company.com',
    department: 'HR',
    position: 'HR Specialist',
    salary: 60000,
    hireDate: '2020-11-20',
    status: 'Active',
    performance: 4.7,
    projects: 6,
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@company.com',
    department: 'Sales',
    position: 'Sales Representative',
    salary: 55000,
    hireDate: '2022-08-12',
    status: 'Inactive',
    performance: 3.8,
    projects: 15,
  },
  {
    id: 6,
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    salary: 85000,
    hireDate: '2021-12-05',
    status: 'Active',
    performance: 4.3,
    projects: 7,
  },
  {
    id: 7,
    firstName: 'Alex',
    lastName: 'Miller',
    email: 'alex.miller@company.com',
    department: 'Finance',
    position: 'Financial Analyst',
    salary: 65000,
    hireDate: '2023-02-14',
    status: 'Active',
    performance: 4.1,
    projects: 4,
  },
  {
    id: 8,
    firstName: 'Lisa',
    lastName: 'Garcia',
    email: 'lisa.garcia@company.com',
    department: 'Marketing',
    position: 'Content Creator',
    salary: 50000,
    hireDate: '2022-05-30',
    status: 'Active',
    performance: 4.4,
    projects: 9,
  },
];

export const productData: Product[] = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    stock: 45,
    supplier: 'TechCorp',
    dateAdded: '2023-01-15',
    status: 'Active',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Gaming Mouse',
    category: 'Electronics',
    price: 79.99,
    stock: 23,
    supplier: 'GameGear',
    dateAdded: '2023-02-20',
    status: 'Active',
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Office Chair',
    category: 'Furniture',
    price: 299.99,
    stock: 12,
    supplier: 'ComfortCo',
    dateAdded: '2023-03-10',
    status: 'Pending',
    rating: 4.2,
  },
  {
    id: 4,
    name: 'Smartphone Case',
    category: 'Accessories',
    price: 24.99,
    stock: 156,
    supplier: 'ProtectPlus',
    dateAdded: '2023-04-05',
    status: 'Active',
    rating: 4.0,
  },
  {
    id: 5,
    name: 'Desk Lamp',
    category: 'Lighting',
    price: 89.99,
    stock: 8,
    supplier: 'BrightLight',
    dateAdded: '2023-01-28',
    status: 'Inactive',
    rating: 4.3,
  },
];