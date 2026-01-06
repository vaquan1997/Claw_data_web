export type NoteStatus = 'new' | 'closed' | 'reference' | 'nurturing';
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'cod';

export interface SaleOrder {
  id: string;
  orderCode: string;
  customerName: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number; // calculated: unitPrice * quantity
  createdAt: string;
  paymentMethod: PaymentMethod;
  saleStatus: string; // Original status from data
  noteStatus: NoteStatus; // Sale decision status
}

export interface SaleOrderResponse {
  data: SaleOrder[];
  total: number;
  page: number;
  limit: number;
}

export interface SaleFilterParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}
