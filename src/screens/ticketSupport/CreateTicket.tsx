import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

type TicketRouteProp = RouteProp<RootStackParamList, 'CreateTicket'>;

const CreateTicket = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<TicketRouteProp>();
  const {order_id, fromOrders} = route.params || {};
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const {theme} = useContext(ThemeContext);
  console.log(order_id);
  console.log(fromOrders);

  const handleSubmit = async () => {
    if (!subject.trim()) {
      Alert.alert('Error', 'Please enter a subject.');
      return;
    }

    if (!message.trim()) {
      Alert.alert('Error', 'Please enter your concern.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);

      // Include order_id if fromOrders is true and order_id exists
      if (fromOrders && order_id) {
        formData.append('order_id', order_id);
      }

      console.log('Submitting ticket:', {
        subject,
        message,
        order_id: fromOrders ? order_id : undefined,
      });

      const endpoint = fromOrders
        ? 'disputes/create'
        : 'support-tickets/create';

      console.log(endpoint);

      const response = (await apiHelper({
        method: 'POST',
        endpoint,
        data: formData,
      })) as any;

      if (response.status === 1) {
        console.log('Ticket created successfully:', response);
        Alert.alert('Success', 'Ticket created successfully!');
        setSubject('');
        setMessage('');
        navigation.goBack();
      } else {
        console.warn('Error creating ticket:', response);
        Alert.alert('Error', response?.message || 'Failed to create ticket.');
      }
    } catch (error) {
      console.warn('Create ticket error:', error);
      Alert.alert(
        'Error',
        'Failed to create ticket. Please check your network.',
      );
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Support" onBackPress={() => navigation.goBack()} />

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Subject Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.text}]}>Subject</Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: theme.backgroundColor, color: theme.input},
              ]}
              placeholder="Write a Subject"
              placeholderTextColor="#A9A9A9"
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, {color: theme.text}]}>Message</Text>
            <TextInput
              style={[
                styles.input,
                styles.messageInput,
                {backgroundColor: theme.backgroundColor, color: theme.input},
              ]}
              placeholder="Write Your concern..."
              placeholderTextColor="#A9A9A9"
              multiline
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  formContainer: {
    flex: 1,
    paddingTop: hp(2),
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp(1),
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(2),
    padding: wp(3),
    fontSize: wp(4),
    color: '#333',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  messageInput: {
    height: hp(20),
    paddingTop: wp(3),
  },
  submitButton: {
    position: 'absolute',
    bottom: hp(3),
    left: wp(4),
    right: wp(4),
    backgroundColor: '#00C4B4',
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CreateTicket;
