import {StyleSheet, Platform} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? hp(3) : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(4),
  },
  headerText: {
    fontSize: wp(5),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  messageList: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
  messageContainer: {
    marginVertical: hp(1),
  },
  sentMessageContainer: {
    alignItems: 'flex-end',
  },
  receivedMessageContainer: {
    alignItems: 'flex-start',
  },
  message: {
    maxWidth: '75%',
    padding: wp(3),
    borderRadius: wp(4),
  },
  sentMessage: {
    backgroundColor: '#03A7A7',
    borderTopRightRadius: 0,
  },
  receivedMessage: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
  },
  senderName: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
  },
  messageText: {
    fontSize: wp(4),
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(0.5),
  },
  timeText: {
    fontSize: wp(3),
    color: '#000000',
  },
  checkmark: {
    marginLeft: wp(1),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
  },
  input: {
    flex: 1,
    padding: wp(2),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(5),
    fontSize: wp(4),
  },
  sendButton: {
    backgroundColor: '#ff69b4',
    padding: wp(2),
    borderRadius: wp(10),
    marginLeft: wp(2),
  },
  errorText: {
    fontSize: wp(4),
    textAlign: 'center',
    marginVertical: hp(2),
    color: 'red',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
});
