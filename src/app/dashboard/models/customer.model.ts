export interface Customer {
  id: string;
  customerName: string;
  phone: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  saleNoteStatus: SaleNoteStatus;
}

export type SaleNoteStatus = 'new' | 'closed' | 'reference' | 'nurturing';

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  limit: number;
  offset: number;
}

export interface CustomerByPhoneResponse {
  data: Customer | null;
}
