export interface Discount {
  _id: string;
  name: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: 'active' | 'inactive';
  isActive?: boolean;
  in_use?: boolean;
  startDate?: string;
  categoryIds?: string[];
  brandIds?: string[];
  productIds?: string[];
  tags?: string[];
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