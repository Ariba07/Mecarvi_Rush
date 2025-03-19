import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import CustomTextInput from '../../common/textInput/CustomTextInput';
import {apiHelper} from '../apiHelper/ApiHelper';
import {useSelector} from 'react-redux';
import {selectUserId} from '../../../slice/Slice';
import {ThemeContext} from '../theme/ThemeContext';

interface AddressCreateProps {
  visible: boolean;
  onClose: () => void;
}

const AddressCreate: React.FC<AddressCreateProps> = ({visible, onClose}) => {
  const [addressType, setAddressType] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const user_id = useSelector(selectUserId);
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  const handleSave = async () => {
    if (!addressType || !country || !state || !city || !zipCode || !address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user_id,
        address_type: addressType,
        address,
        city,
        state,
        zip_code: zipCode,
        country,
        is_default: true,
      };

      const response = (await apiHelper({
        method: 'POST',
        endpoint: 'user-address/create',
        data: payload,
      })) as {status: number; message?: string};

      if (response.status === 1) {
        Alert.alert('Success', 'Address added successfully');
        onClose();
      } else {
        Alert.alert('Error', response.message || 'Failed to add address');
      }
    } catch (error: any) {
      console.error('API Error:', error.message);
      Alert.alert('Error', 'An error occurred while adding the address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: theme.whole}]}>
            <Text style={[styles.title, {color: theme.text}]}>Add Address</Text>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.text}]}>
                Address-type
              </Text>
              <CustomTextInput
                placeholder="Address-type"
                value={addressType}
                onChangeText={(text: string | string[]) =>
                  setAddressType(Array.isArray(text) ? text.join(', ') : text)
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.text}]}>Country</Text>
              <CustomTextInput
                placeholder="Country"
                value={country}
                onChangeText={text => setCountry(text as string)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.text}]}>State</Text>
              <CustomTextInput
                placeholder="State"
                value={state}
                onChangeText={text => setState(text as string)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.text}]}>City</Text>
              <CustomTextInput
                placeholder="City"
                value={city}
                onChangeText={text => setCity(text as string)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.text}]}>Zip Code</Text>
              <CustomTextInput
                placeholder="Zip Code"
                value={zipCode}
                onChangeText={text => setZipCode(text as string)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, {color: theme.text}]}>Address</Text>
              <CustomTextInput
                placeholder="Address"
                value={address}
                onChangeText={text => setAddress(text as string)}
              />
            </View>

            <TouchableOpacity
              style={[styles.doneButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}>
              <Text
                style={[styles.doneButtonText, {color: theme.backgroundColor}]}>
                {loading ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F5F7FA',
    borderRadius: wp(3),
    padding: wp(5),
    width: wp(90),
    maxHeight: hp(90),
  },
  title: {
    fontSize: wp(6),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(2),
    color: '#333',
  },
  inputContainer: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(4),
    color: '#333',
    marginBottom: hp(0.5),
  },
  doneButton: {
    backgroundColor: '#03A7A7',
    borderRadius: wp(2),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginTop: hp(2),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  disabledButton: {
    backgroundColor: '#A0C4C4', // Lighter shade to indicate disabled state
    elevation: 0,
    shadowOpacity: 0,
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: wp(5),
    height: wp(5),
    borderWidth: 1,
    borderColor: '#03A7A7',
    borderRadius: wp(1),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  checkboxChecked: {
    backgroundColor: '#03A7A7',
  },
  checkboxLabel: {
    fontSize: wp(4),
    color: '#333',
  },
});

export default AddressCreate;
