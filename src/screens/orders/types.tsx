export interface OrderDetail {
  id: number;
  product_name: string;
  price: string | number;
  quantity: number;
}

export interface Order {
  id: number;
  order_uuid: string;
  total_price: string | number;
  created_at: string;
  payment_status?: string;
  order_details: OrderDetail[];
  order_number: string;
  status: string;
  order_tracking?: {
    id: number;
    order_tracking_uuid: string;
    order_id: number;
    status: string;
    update_time: string;
    details: string;
    created_at: string;
    updated_at: string;
  }[];
}

export const STORAGE_KEY = '@login_credentials';

export const tabs = [
  {label: 'All Orders', filter: 'All'},
  {label: 'Pending', filter: 'Pending'},
  {label: 'Processing', filter: 'Processing'},
  {label: 'Completed', filter: 'Completed'},
  {label: 'Cancelled', filter: 'Cancelled'},
  {label: 'Disputes', filter: 'Disputes'},
  {label: 'Refunded', filter: 'Refunded'},
];

export const statusOptions = [
  'Pending',
  'Processing',
  'Completed',
  'Cancelled',
  'Disputes',
  'Refunded',
];

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number,
) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
