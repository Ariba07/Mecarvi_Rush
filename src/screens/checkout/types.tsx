export interface VerifyScreenProps {
  title: string;
  label: string;
  imageSource: any;
}

export interface ImageData {
  uri: string;
  type: string;
  name: string;
  fileSize?: number;
  width?: number;
  height?: number;
}

export interface UserCard {
  id: number;
  user_card_uuid: string;
  user_id: number;
  card_name: string;
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentOption {
  id: string;
  label: string;
  logoUrl: string;
  selected: boolean;
  balance?: string;
}
