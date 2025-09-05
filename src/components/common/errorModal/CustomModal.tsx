import React, {useContext} from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../../helperUtils/theme/ThemeContext';

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  buttonText?: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title = 'Error',
  message,
  onClose,
  buttonText = 'OK',
}) => {
  const {theme} = useContext(ThemeContext);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {backgroundColor: theme.backgroundColor || '#fff'},
          ]}>
          <Text style={[styles.title, {color: theme.input || '#333'}]}>
            {title}
          </Text>
          <Text style={[styles.message, {color: theme.input || '#666'}]}>
            {message}
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp(80),
    padding: wp(5),
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: '#cccccc',
    alignItems: 'center',
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  message: {
    fontSize: wp(4),
    marginBottom: hp(3),
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF00A7',
    borderRadius: wp(2),
    width: wp(60),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default CustomModal;
