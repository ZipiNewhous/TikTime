import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price in ILS */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Generate a URL-friendly slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-א-ת]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

/** Generate a unique order number */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TT-${timestamp}-${random}`;
}

/** Truncate text to a max length */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + "...";
}

/** Format a date in Hebrew locale */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

/** Format a datetime in Hebrew locale */
export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/** Status label mapping */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: "חדש",
  confirmed: "אושר",
  processing: "בטיפול",
  shipped: "נשלח",
  delivered: "נמסר",
  completed: "הושלם",
  cancelled: "בוטל",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "ממתין",
  paid: "שולם",
  failed: "נכשל",
  refunded: "הוחזר",
};

export const STOCK_STATUS_LABELS: Record<string, string> = {
  in_stock: "במלאי",
  out_of_stock: "אזל במלאי",
};

/** Parse JSON safely, return null on error */
export function safeParseJSON<T>(json: string | null | undefined): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** Validate Israeli phone number */
export function isValidIsraeliPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-]/g, "");
  return /^0[2-9]\d{7,8}$/.test(cleaned);
}

/** Get image placeholder URL */
export function getPlaceholderImage(width = 400, height = 400, text = "שעון"): string {
  return `https://placehold.co/${width}x${height}/f5f5f5/888888?text=${encodeURIComponent(text)}`;
}
