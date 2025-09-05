/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
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
import CustomModal from '../../common/errorModal/CustomModal';

interface AddressCreateProps {
  visible: boolean;
  onClose: () => void;
}

const GOOGLE_API_KEY = 'AIzaSyAU9bshzS-D9P2Equ-0HW9skO7Ro9wR9ZY';
const GEOCODE_API_URL = 'https://maps.google.com/maps/api/geocode/json';

const AddressCreate: React.FC<AddressCreateProps> = ({visible, onClose}) => {
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('Error');
  const user_id = useSelector(selectUserId);
  const {theme} = useContext(ThemeContext);

  const fetchCoordinates = async (fullAddress: string) => {
    try {
      const response = await fetch(
        `${GEOCODE_API_URL}?key=${GOOGLE_API_KEY}&address=${encodeURIComponent(
          fullAddress,
        )}`,
      );
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        const {lat, lng} = data.results[0].geometry.location;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        return {latitude: lat, longitude: lng};
      } else {
        throw new Error('Unable to geocode address');
      }
    } catch (error) {
      console.warn('Geocoding Error:', error);
      setModalTitle('Error');
      setModalMessage('Failed to get coordinates for the address');
      setModalVisible(true);
      return null;
    }
  };

  const handleSave = async () => {
    if (!country || !state || !city || !zipCode || !address) {
      setModalTitle('Error');
      setModalMessage('Please fill all fields');
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      const fullAddress = `${address}, ${city}, ${state}, ${zipCode}, ${country}`;
      const coordinates = await fetchCoordinates(fullAddress);

      if (!coordinates) {
        setLoading(false);
        return;
      }

      const payload = {
        user_id: user_id,
        address,
        city,
        state,
        zip_code: zipCode,
        country,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        is_default: true,
      };

      const response = (await apiHelper({
        method: 'POST',
        endpoint: 'user-address/create',
        data: payload,
      })) as {status: number; message?: string};

      if (response.status === 1) {
        setModalTitle('Success');
        setModalMessage('Address added successfully');
        setModalVisible(true);
        setCountry('');
        setState('');
        setCity('');
        setZipCode('');
        setAddress('');
        setLatitude('');
        setLongitude('');
        onClose();
      } else {
        setModalTitle('Error');
        setModalMessage(response.message || 'Failed to add address');
        setModalVisible(true);
      }
    } catch (error: any) {
      console.warn('API Error:', error.message);
      setModalTitle('Error');
      setModalMessage('An error occurred while adding the address');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, {backgroundColor: theme.whole}]}>
              <Text style={[styles.title, {color: theme.text}]}>
                Add Address
              </Text>

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
                <Text style={[styles.label, {color: theme.text}]}>
                  Zip Code
                </Text>
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
                  style={[
                    styles.doneButtonText,
                    {color: theme.backgroundColor},
                  ]}>
                  {loading ? 'Adding...' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </>
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
  },
  disabledButton: {
    backgroundColor: '#A0C4C4',
  },
  doneButtonText: {
    color: '#FFF',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
});

export default AddressCreate;
