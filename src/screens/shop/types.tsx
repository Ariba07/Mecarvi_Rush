export const STORAGE_KEY = '@login_credentials';

export interface ProfileData {
  id: number;
  name: string;
  location: string;
  profileImageUrl: string;
}

export interface ReviewItem {
  id: number;
  order_id: number;
  comment: string;
  rating: number;
  created_at: string;
}

export const getUserFriendlyMessage = (error: any): string => {
  switch (error.code) {
    case 'app/missing-uuids':
      return 'Missing required information. Please try again.';
    case 'app/missing-names':
      return 'User or provider name missing. Please try again.';
    case 'firestore/chat-error':
      return 'Unable to initiate chat. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
