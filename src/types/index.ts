// ============================================================
// PRODUCT TYPES
// ============================================================

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductWithRelations {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  description: string | null;
  specs: string | null;
  sku: string;
  stockStatus: string;
  image1: string | null;
  image2: string | null;
  image3: string | null;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  brand: {
    id: number;
    name: string;
    slug: string;
    logo?: string | null;
  };
  productCategories: {
    productId?: number;
    categoryId?: number;
    category: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  productTags: {
    productId?: number;
    tagId?: number;
    tag: {
      id: number;
      name: string;
      slug: string;
      color: string;
    };
  }[];
}

// ============================================================
// CATEGORY TYPES
// ============================================================

export interface CategoryWithChildren {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  order: number;
  children: CategoryWithChildren[];
  _count?: { productCategories: number };
}

// ============================================================
// CART TYPES
// ============================================================

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  image: string | null;
  quantity: number;
  sku: string;
  brandName: string;
}

// ============================================================
// ORDER TYPES
// ============================================================

export interface OrderWithItems {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentTransactionId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: number;
    productId: number;
    productName: string;
    productPrice: number;
    quantity: number;
    subtotal: number;
  }[];
}

export interface CheckoutFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes?: string;
  agreeTerms: boolean;
}

// ============================================================
// FILTER TYPES
// ============================================================

export interface ProductFilters {
  categorySlug?: string;
  brandId?: number[];
  minPrice?: number;
  maxPrice?: number;
  tagSlugs?: string[];
  inStock?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "name_asc";
  search?: string;
  page?: number;
  pageSize?: number;
}

// ============================================================
// ADMIN TYPES
// ============================================================

export interface AdminStats {
  ordersToday: number;
  ordersWeek: number;
  ordersMonth: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  totalProducts: number;
  pendingOrders: number;
  outOfStockProducts: number;
}

// ============================================================
// PAYMENT TYPES
// ============================================================

export interface PaymentProvider {
  name: string;
  initiate(params: PaymentInitParams): Promise<PaymentInitResult>;
  handleCallback(data: unknown): Promise<PaymentCallbackResult>;
  verifySignature(data: unknown, signature: string): boolean;
}

export interface PaymentInitParams {
  orderId: number;
  orderNumber: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  successUrl: string;
  failureUrl: string;
}

export interface PaymentInitResult {
  success: boolean;
  redirectUrl?: string;
  transactionId?: string;
  error?: string;
}

export interface PaymentCallbackResult {
  success: boolean;
  orderId: number;
  transactionId: string;
  amount: number;
  status: "paid" | "failed";
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
