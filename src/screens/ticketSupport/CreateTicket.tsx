import React, {useContext, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {apiHelper} from '../../services/api';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../context/ThemeContext';
import CustomModal from '../../components/common/errorModal/CustomModal';

type TicketRouteProp = RouteProp<RootStackParamList, 'CreateTicket'>;

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

const CreateTicket = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<TicketRouteProp>();
  const {order_id, fromOrders} = route.params || {};
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const {theme} = useContext(ThemeContext);
  console.log(order_id);
  console.log(fromOrders);

  const handleSubmit = async (): Promise<ActionResult> => {
    if (!subject.trim()) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please enter a subject.',
        },
      };
    }

    if (!message.trim()) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Please enter your concern.',
        },
      };
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('message', message);

      if (fromOrders && order_id) {
        formData.append('order_id', order_id.toString());
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
        return {
          success: true,
          error: {
            title: 'Success',
            message: 'Ticket created successfully!',
          },
        };
      } else {
        console.warn('Error creating ticket:', response);
        return {
          success: false,
          error: {
            title: 'Error',
            message: response?.message || 'Failed to create ticket.',
          },
        };
      }
    } catch (error) {
      console.warn('Create ticket error:', error);
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to create ticket. Please check your network.',
        },
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async () => {
    if (isSubmitting) {
      return;
    }
    const result = await handleSubmit();
    if (result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
      setSubject('');
      setMessage('');
      navigation.goBack();
    } else if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
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
                isSubmitting && styles.inputDisabled,
              ]}
              placeholder="Write a Subject"
              placeholderTextColor="#A9A9A9"
              value={subject}
              onChangeText={setSubject}
              editable={!isSubmitting}
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
                isSubmitting && styles.inputDisabled,
              ]}
              placeholder="Write Your concern..."
              placeholderTextColor="#A9A9A9"
              multiline
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
              editable={!isSubmitting}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={isSubmitting}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
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
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  inputDisabled: {
    opacity: 0.5,
    backgroundColor: '#f0f0f0',
  },
});

export default CreateTicket;
