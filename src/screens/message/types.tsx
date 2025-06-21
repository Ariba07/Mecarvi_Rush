export interface Message {
  id: string;
  text?: string; // Optional for customer messages
  message?: string; // Optional for seller messages
  createdAt: any; // Firestore Timestamp or compatible type
  sender: string;
}

export const getUserFriendlyMessage = (error: any): string => {
  switch (error.code) {
    case 'firestore/permission-denied':
      return 'You don’t have permission to send or view messages.';
    case 'firestore/unavailable':
      return 'Network error. Please check your connection.';
    case 'firestore/invalid-argument':
      return 'Unable to process message. Please try again.';
    case 'firestore/not-found':
      return 'Chat not found. Please try another chat.';
    case 'firestore/resource-exhausted':
      return 'Service limit reached. Please try again later.';
    case 'firestore/unauthenticated':
      return 'Please log in again.';
    case 'app/no-chat-id':
      return 'Invalid chat. Please try again.';
    case 'app/no-user-uuid':
      return 'Please log in to send messages.';
    case 'app/firestore-invalid':
      return 'Unable to load messages. Please try again later.';
    default:
      return error.message.includes('collection')
        ? 'Unable to process request. Please try again later.'
        : 'An error occurred. Please try again.';
  }
};
