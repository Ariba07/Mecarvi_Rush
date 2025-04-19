/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CustomErrorModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
  theme: {whole: string; text: string};
}

const CustomErrorModal: React.FC<CustomErrorModalProps> = ({
  visible,
  message,
  onClose,
  theme,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, {backgroundColor: theme.whole}]}>
          <Text style={[styles.errorTitle, {color: '#ff00a7'}]}>Error</Text>
          <Text style={[styles.errorMessage, {color: theme.text}]}>
            {message}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp(80),
    padding: wp(5),
    borderRadius: wp(3),
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  errorTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  errorMessage: {
    fontSize: wp(4),
    textAlign: 'center',
    marginBottom: hp(3),
  },
  closeButton: {
    backgroundColor: '#ff00a7',
    paddingVertical: hp(1),
    paddingHorizontal: wp(10),
    borderRadius: wp(2),
  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '500',
  },
});

export default CustomErrorModal;
