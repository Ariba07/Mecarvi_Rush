import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  chatItem: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noChatsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
});
