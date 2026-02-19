import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    PROCESSING: 'text-blue-400 bg-blue-400/10',
    SHIPPED: 'text-purple-400 bg-purple-400/10',
    DELIVERED: 'text-green-400 bg-green-400/10',
    CANCELLED: 'text-red-400 bg-red-400/10',
  };
  return colors[status] || 'text-gray-400 bg-gray-400/10';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    UPPER_WEAR: 'Upper Wear',
    LOWER_WEAR: 'Lower Wear',
    WINTER_WEAR: 'Winter Wear',
    SUMMER_WEAR: 'Summer Wear',
    ACCESSORIES: 'Accessories',
  };
  return labels[category] || category;
}
