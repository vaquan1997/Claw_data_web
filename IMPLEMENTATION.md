# Angular Dashboard - Real API Integration

## Overview

This Angular Dashboard application has been enhanced with real API integration, responsive design, and comprehensive filtering capabilities.

## Features Implemented

### ✅ Real API Integration

#### API Services
- **DedupService** (`src/app/dashboard/services/dedup.service.ts`)
  - `getCustomerList()` - Fetch paginated customer/sales data
  - `searchByPhone()` - Search customer by phone number

- **RevenueService** (`src/app/dashboard/services/revenue.service.ts`)
  - `getRevenueStats()` - Get revenue statistics grouped by day/week/month/quarter
  - `calculateStats()` - Calculate aggregate KPI statistics

#### API Endpoints
```
GET http://localhost:3000/api/dedup?limit=100&offset=0
GET http://localhost:3000/api/dedup/row/by-phone/{phone}
GET http://localhost:3000/api/revenue?groupBy=week
```

### ✅ Filter Component

**Location**: `src/app/dashboard/components/filters/`

Features:
- **Smart Search**: Automatically detects phone numbers vs text
  - Numeric input → API phone search
  - Text input → Client-side name filter
- **Date Range Filter**: From/To date pickers using Angular Material
- **Group By Selector**: Day, Week, Month, Quarter options for revenue chart
- **Clear Filters**: Reset all filters to default

### ✅ Updated Models

**Location**: `src/app/dashboard/models/`

- **customer.model.ts** - Customer/sales data structure
- **revenue.model.ts** - Revenue statistics structure
- **sale.model.ts** - Updated with 4-state status enum

#### Sale Status (4 States)
| Status | Label | Color |
|--------|-------|-------|
| new | Khách mới | Gray (#9E9E9E) |
| closed | Đã chốt | Green (#4CAF50) |
| reference | Tham khảo | Blue (#2196F3) |
| nurturing | Chăm sóc | Orange (#FF9800) |

### ✅ Dashboard Component

**Location**: `src/app/dashboard/dashboard.component.ts`

Features:
- Real API calls with error handling
- Server-side pagination
- Date range filtering
- Smart search (phone/text detection)
- KPI calculation from real data
- Loading states and error messages

### ✅ Revenue Chart Component

**Location**: `src/app/dashboard/components/charts/revenue-chart/`

Features:
- Chart type toggle (Bar/Line)
- Responsive design
- Auto-refresh on filter changes
- Vietnamese currency formatting
- Data-driven from revenue API

### ✅ KPI Cards Component

**Location**: `src/app/dashboard/components/kpi-cards/`

Vietnamese Labels:
- Tổng doanh thu (Total Revenue)
- Tổng số khách hàng (Total Customers)
- Tổng số đơn (Total Orders)
- Doanh thu TB / khách (Avg Revenue per Customer)

Features:
- Auto-calculated from API data
- Trend indicators
- Responsive grid layout

### ✅ Sales Table Component

**Location**: `src/app/dashboard/components/sales-table/`

Vietnamese Headers:
- Tên khách hàng (Customer Name)
- Số điện thoại (Phone Number)
- Sản phẩm (Product)
- Số lượng (Quantity)
- Đơn giá (Unit Price)
- Thành tiền (Total Price)
- Ngày tạo (Created Date)
- Trạng thái chăm sóc (Care Status)

Features:
- 4-state status dropdown with colors
- Server-side pagination
- Horizontal scroll on mobile
- Price calculations from API data
- Empty state and loading states

### ✅ Responsive Design

Breakpoints:
- **Desktop**: > 1200px (4-column KPI grid)
- **Tablet**: 768px - 1200px (2-column KPI grid)
- **Mobile**: < 768px (1-column layout)

Features:
- Responsive KPI cards grid
- Horizontally scrollable table on mobile
- Auto-resizing charts
- Flexible filter layout

### ✅ Error Handling & UX

- Loading spinners for all API calls
- Error message notifications
- Empty state messages
- CORS-enabled API communication
- Graceful error fallbacks

## Running the Application

### Prerequisites
- Node.js (v18+)
- npm (v8+)

### Installation
```bash
npm install
```

### Development

1. Start the mock backend API:
```bash
node /tmp/mock-api/server.js
```

2. Start the Angular development server:
```bash
npm start
```

3. Open browser at http://localhost:4200/

### Build for Production
```bash
npm run build
```

Output will be in `dist/user-manager/`

## Architecture

```
src/app/dashboard/
├── dashboard.component.ts          # Main dashboard orchestrator
├── dashboard.component.html        # Dashboard layout
├── dashboard.component.scss        # Responsive styles
├── components/
│   ├── sidebar/                    # Navigation sidebar
│   ├── header/                     # Top header
│   ├── kpi-cards/                  # KPI metrics cards
│   ├── charts/
│   │   └── revenue-chart/          # Revenue visualization
│   ├── filters/                    # Search and filter controls
│   └── sales-table/                # Data table with pagination
├── services/
│   ├── dedup.service.ts            # Customer/Sales API
│   └── revenue.service.ts          # Revenue statistics API
└── models/
    ├── customer.model.ts           # Customer data types
    ├── revenue.model.ts            # Revenue data types
    ├── sale.model.ts               # Sale order types
    └── kpi.model.ts                # KPI metrics types
```

## Testing

### Manual Testing Checklist

1. **API Integration**
   - [ ] Customer list loads from API
   - [ ] Pagination works correctly
   - [ ] Phone search returns correct result
   - [ ] Revenue chart updates from API

2. **Filtering**
   - [ ] Date range filter updates data
   - [ ] Group by selector changes chart
   - [ ] Search detects phone vs text
   - [ ] Clear filters resets to default

3. **Responsive Design**
   - [ ] Desktop layout (> 1200px)
   - [ ] Tablet layout (768-1200px)
   - [ ] Mobile layout (< 768px)
   - [ ] Table scrolls horizontally on mobile

4. **Status Management**
   - [ ] Status dropdown shows 4 options
   - [ ] Status colors are correct
   - [ ] Status updates immediately

5. **Error Handling**
   - [ ] Loading spinners appear
   - [ ] Error messages display
   - [ ] Empty states show correctly

## Technical Stack

- **Angular**: 21.0.0
- **Angular Material**: 21.0.5
- **Chart.js**: 4.5.1
- **ng2-charts**: 8.0.0
- **RxJS**: 7.8.0
- **TypeScript**: 5.9.2

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- All API calls use RxJS Observables
- No mock data in production code
- All prices calculated dynamically
- Vietnamese localization throughout
- Strict TypeScript typing enforced
