export interface PaymentOption {
  id: string;
  label: string;
  logoUrl: string;
  selected: boolean;
  balance?: string;
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

export type RootStackParamList = {
  Receipt: undefined;
  // Add other screen types as needed
};
