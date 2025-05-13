export const STORAGE_KEY = '@login_credentials';

export interface Order {
  id: number;
  points: number;
  is_redeemed: boolean;
  order_uuid: string;
}
