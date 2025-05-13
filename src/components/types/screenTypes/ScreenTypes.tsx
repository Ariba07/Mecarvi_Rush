// Define types for navigation params
export type RootStackParamList = {
  Splash: undefined;
  OnBoard: undefined;
  Login: undefined;
  Forget: undefined;
  Reset: undefined;
  Verify: undefined;
  Options: undefined;
  Register: undefined;
  Upload: undefined;
  Photo: undefined;
  Card: undefined;
  Dashboard: undefined;
  ServiceProviderRegister: undefined;
  ServiceProviderRegister1: undefined;
  ServiceProviderRegister2: undefined;
  ServiceProviderRegister3: undefined;
  Subscription: undefined;
  Orders: undefined;
  Chats: undefined;
  Settings: undefined;
  BottomTabs: undefined;
  Drawer: undefined;
  SideMenu: undefined;
  Notification: undefined;
  Service: undefined;
  Search: undefined;
  Products: undefined;
  Address: {forDelivery?: boolean};
  Message: {
    chatId: string;
    chatName: string;
    participantNames: {[uuid: string]: string};
  };
  Tracking: {order_uuid: string};
  OrderDetails: undefined;
  Review: {order_id: number};
  Support: undefined;
  Profile: undefined;
  Points: undefined;
  Product: undefined;
  Quote: undefined;
  QuoteDecision: undefined;
  ServiceProviderDashboard: undefined;
  Services: undefined;
  ProductPrice: {product_uuid: string; id: number};
  ServiceProviderOrderDetail: undefined;
  ServiceProviderProfile: undefined;
  Wallet: undefined;
  Withdraw: undefined;
  WithdrawBalance: undefined;
  WithdrawConfirm: undefined;
  Cart: undefined;
  Schedule: undefined;
  Booking: undefined;
  Checkout: undefined;
  Receipt: undefined;
  MarketPlace: {productId: number};
  ShopProfile: {fromBid: boolean; providerId: string};
  AcceptBid: undefined;
  Ticket: {ticketId: number; ticketUuid: string};
  Feedback: {order_id: number};
  AllTicket: undefined;
  CreateTicket: {order_id: number | null; fromOrders: boolean};
  ChildCategories: {
    categoryId: number;
    categoryName: string;
  };
  SubChildCategories: {
    categoryId: number;
    categoryName: string;
  };
  Disputes: undefined;
  DisputeChat: {disputeId: number; disputeUuid: string};
};
export interface Productss {
  id: number;
  product_uuid: string;
  name: string;
  sku: string;
  slug: string;
  manufacturer: string;
  model: string;
  category_id: number;
  specifications: {
    color: string;
    size: string;
  };
  refund_policy: string;
  description: string;
  price: number;
  discount_amount: number;
  wholesale_price: number;
  wholesale_quantity: number;
  status: boolean;
  type: string;
  created_at: string;
  updated_at: string;
  featured_image?: string | null;
}
export interface Products {
  id: number;
  product_uuid: string;
  name: string;
  sku: string;
  slug: string;
  manufacturer: string;
  model: string;
  category_id: number;
  specifications: {
    color: string;
    size: string;
  };
  refund_policy: string;
  description: string;
  price: number;
  discount_amount: number;
  wholesale_price: number;
  wholesale_quantity: number;
  status: boolean;
  type: string;
  created_at: string;
  updated_at: string;
  labels: Array<{
    id: number;
    label_uuid: string;
    label: string;
    label_color: string;
    description: string;
    created_at: string;
    updated_at: string;
  }>;
  size_variations: Array<{
    id: number;
    size_variation_uuid: string;
    product_id: number;
    size_name: string;
    size_qty: number;
    size_price: number;
    created_at: string;
    updated_at: string;
  }>;
  variations: Array<{
    id: number;
    product_variation_uuid: string;
    product_id: number;
    general_attribute_id: number;
    specific_attribute_id: number | null;
    price_adjustment: string;
    price_type: string;
    created_at: string;
    updated_at: string;
  }>;
  specific_attributes: Array<{
    id: number;
    specific_attribute_uuid: string;
    product_id: number;
    general_attribute_id: number;
    created_at: string;
    updated_at: string;
    attribute_values: Array<{
      id: number;
      attribute_value_uuid: string;
      general_attribute_id: number | null;
      specific_attribute_id: number;
      value: string;
      additional_info: string;
      created_at: string;
      updated_at: string;
    }>;
  }>;
  seo: {
    id: number;
    product_id: number;
    title: string;
    slug: string;
    keywords: string;
    meta_tags: string;
    meta_description: string;
    created_at: string;
    updated_at: string;
  };
  shipping: {
    id: number;
    product_id: number;
    free_shipping: number;
    delivery_time: string;
    variant: string;
    shipping_cost: string;
    shipping_location: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiResponse {
  status: number;
  data: Products;
}

export interface Attribute {
  label: string;
  placeholder: string;
  key: string;
  isMultiSelect?: boolean;
  options: string[];
}

export interface CartItem {
  id: number;
  productUuid: string;
  name: string;
  price: number;
  selectedColor?: string | null;
  frontFile?: {uri: string} | null;
  backFile?: {uri: string} | null;
  orderNotes?: string;
  quantity?: number;
  attributes?: {[key: string]: string}; // Added attributes field
}
export interface DateSlot {
  day: string;
  date: number;
  fullDate: string; // YYYY-MM-DD
}

export interface TimeSlot {
  time: string;
}

export interface Message {
  text: string;
  sender: string;
  createdAt: any;
  id?: string;
  timestamp?: string;
  isSent?: boolean;
  images?: string[];
}

export interface Chat {
  id: string;
  name: string;
  chatId: string;
  participants: string[];
  participantNames: {[uuid: string]: string};
  lastMessage?: Message;
}

export interface PaymentOption {
  id: string;
  label: string;
  logoUrl: string;
  selected: boolean;
  balance?: string;
}

export interface Bid {
  id: number;
  quote_bid_uuid: string;
  service_provider_id: number;
  bid_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  service_provider: {
    service_provider_id: number;
    service_provider_name: string;
    service_provider_logo: string;
  };
  quote_request_id: {
    id: number;
    quote_request_uuid: string;
    user_id: number;
    product_id: number;
    quantity: number;
    note: string | null;
    details: {[key: string]: string};
    front_image: string;
    back_image: string;
    created_at: string;
    updated_at: string;
  };
}

export interface BusinessProvider {
  id: number;
  quote_bid_uuid: string;
  service_provider_id: number;
  service_provider_uuid?: string;
  service_provider_user_uuid?: string;
  service_provider_name: string;
  logo: string;
  address?: string;
  price: string;
  product_id: number;
  quantity: number;
}
