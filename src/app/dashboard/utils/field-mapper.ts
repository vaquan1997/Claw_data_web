/**
 * Field Mapper Utility
 * Maps between Vietnamese API field names and English Angular model properties
 */

export interface Sale {
  id?: number;
  customerName: string;
  phone: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: string;
  saleStatus: string;
}

// API to Model mapping
export const API_TO_MODEL_MAP: Record<string, string> = {
  'id': 'id',
  'Tên khách hàng': 'customerName',
  'Số điện thoại khách hàng': 'phone',
  'Sản phẩm': 'product',
  'Số lượng': 'quantity',
  'Đơn giá': 'unitPrice',
  'Ngày tạo': 'createdAt',
  'Trạng thái chăm sóc': 'saleStatus'
};

// Model to API mapping (for PUT requests)
export const MODEL_TO_API_MAP: Record<string, string> = {
  'id': 'id',
  'customerName': 'Tên khách hàng',
  'phone': 'Số điện thoại khách hàng',
  'product': 'Sản phẩm',
  'quantity': 'Số lượng',
  'unitPrice': 'Đơn giá',
  'createdAt': 'Ngày tạo',
  'saleStatus': 'Trạng thái chăm sóc'
};

// Sale Status Options with Vietnamese labels
export const SALE_STATUS_OPTIONS = [
  { value: 'new', label: 'Khách mới', apiValue: 'Khách mới', color: '#9E9E9E' },
  { value: 'closed', label: 'Đã chốt', apiValue: 'Đã chốt', color: '#4CAF50' },
  { value: 'reference', label: 'Tham khảo', apiValue: 'Tham khảo', color: '#2196F3' },
  { value: 'nurturing', label: 'Chăm sóc', apiValue: 'Chăm sóc', color: '#FF9800' }
];

/**
 * Map API response data (Vietnamese fields) to Angular model (English fields)
 * @param apiData - Data from API with Vietnamese field names
 * @returns Sale object with English field names
 */
export function mapApiToModel(apiData: any): Sale {
  return {
    id: apiData['id'],
    customerName: apiData['Tên khách hàng'] || '',
    phone: apiData['Số điện thoại khách hàng'] || '',
    product: apiData['Sản phẩm'] || '',
    quantity: apiData['Số lượng'] || 0,
    unitPrice: apiData['Đơn giá'] || 0,
    createdAt: apiData['Ngày tạo'] || '',
    saleStatus: apiData['Trạng thái chăm sóc'] || 'Khách mới',
    totalPrice: (apiData['Số lượng'] || 0) * (apiData['Đơn giá'] || 0)
  };
}

/**
 * Map Angular model data (English fields) to API format (Vietnamese fields)
 * Only includes fields that are defined in the model data
 * @param modelData - Partial Sale object with English field names
 * @returns Object with Vietnamese field names for API
 */
export function mapModelToApi(modelData: Partial<Sale>): any {
  const apiData: any = {};
  
  if (modelData.customerName !== undefined) {
    apiData['Tên khách hàng'] = modelData.customerName;
  }
  if (modelData.phone !== undefined) {
    apiData['Số điện thoại khách hàng'] = modelData.phone;
  }
  if (modelData.product !== undefined) {
    apiData['Sản phẩm'] = modelData.product;
  }
  if (modelData.quantity !== undefined) {
    apiData['Số lượng'] = modelData.quantity;
  }
  if (modelData.unitPrice !== undefined) {
    apiData['Đơn giá'] = modelData.unitPrice;
  }
  if (modelData.createdAt !== undefined) {
    apiData['Ngày tạo'] = modelData.createdAt;
  }
  if (modelData.saleStatus !== undefined) {
    apiData['Trạng thái chăm sóc'] = modelData.saleStatus;
  }
  
  return apiData;
}

/**
 * Get status label by value
 * @param value - Status value (e.g., 'new', 'closed')
 * @returns Vietnamese label
 */
export function getStatusLabel(value: string): string {
  const status = SALE_STATUS_OPTIONS.find(s => s.value === value || s.apiValue === value);
  return status?.label || value;
}

/**
 * Get status value by API value
 * @param apiValue - Status value from API (Vietnamese)
 * @returns Internal status value
 */
export function getStatusValue(apiValue: string): string {
  const status = SALE_STATUS_OPTIONS.find(s => s.apiValue === apiValue);
  return status?.value || 'new';
}

/**
 * Get API status value by internal value
 * @param value - Internal status value
 * @returns API status value (Vietnamese)
 */
export function getApiStatusValue(value: string): string {
  const status = SALE_STATUS_OPTIONS.find(s => s.value === value);
  return status?.apiValue || 'Khách mới';
}

/**
 * Get status color by value
 * @param value - Status value
 * @returns Hex color code
 */
export function getStatusColor(value: string): string {
  const status = SALE_STATUS_OPTIONS.find(s => s.value === value || s.apiValue === value);
  return status?.color || '#9E9E9E';
}
