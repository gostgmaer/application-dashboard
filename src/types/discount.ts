export interface Discount {
  _id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: 'active' | 'inactive';
  isActive?: boolean;
  in_use?:boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountInput {
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: 'active' | 'inactive';
}

export interface UpdateDiscountInput extends Partial<CreateDiscountInput> {
  id: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}