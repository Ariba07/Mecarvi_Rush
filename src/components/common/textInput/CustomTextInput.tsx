/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string | string[];
  onChangeText?: (text: string | string[]) => void;
  isMultiSelect?: boolean;
}

const dropdownOptions: {[key: string]: string[]} = {
  'State Registration': ['Registered', 'Unregistered', 'Pending'],
  'Legal Structure of Business': ['Sole Proprietorship', 'Partnership', 'LLC'],
  'Select Capacity': ['Small', 'Medium', 'Large'],
  'Select Your Target Market': ['Local', 'National', 'International'],
  'Select Services': ['Consulting', 'Development', 'Marketing'],
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  isMultiSelect = false,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>(
    Array.isArray(value) ? value : [],
  );

  const isDropdownField = placeholder in dropdownOptions;

  const handleDropdownPress = () => {
    setActiveDropdown(activeDropdown === placeholder ? null : placeholder);
  };

  const handleSelectOption = (option: string) => {
    if (isMultiSelect) {
      const updatedSelections = selectedServices.includes(option)
        ? selectedServices.filter(item => item !== option) // Remove if already selected
        : [...selectedServices, option]; // Add new selection

      setSelectedServices(updatedSelections);
      if (onChangeText) {
        onChangeText(updatedSelections); // Pass array back
      }
    } else {
      if (onChangeText) {
        onChangeText(option);
      }
      setActiveDropdown(null);
    }
  };

  return (
    <View>
      {isDropdownField ? (
        <>
          <TouchableOpacity
            style={styles.container}
            onPress={handleDropdownPress}>
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={
                isMultiSelect
                  ? selectedServices.join(', ') // Display selected items
                  : (value as string)
              }
              editable={false}
              placeholderTextColor={'#999'}
            />
            <Icon
              name="arrow-drop-down"
              size={25}
              color="#333333"
              type="material"
            />
          </TouchableOpacity>

          {activeDropdown === placeholder && (
            <View style={styles.dropdownContainer}>
              <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                {dropdownOptions[placeholder].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.dropdownItem,
                      selectedServices.includes(item) && {
                        backgroundColor: '#f0f8ff', // Highlight selected items
                      },
                    ]}
                    onPress={() => handleSelectOption(item)}>
                    <Text style={styles.dropdownText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      ) : (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={!isPasswordVisible}
            value={value as string}
            onChangeText={onChangeText}
            placeholderTextColor={'#999'}
            keyboardType={
              placeholder === 'Phone Number' ? 'numeric' : 'default'
            }
          />
          {placeholder.includes('Password') && (
            <TouchableOpacity
              onPress={() => setPasswordVisible(!isPasswordVisible)}>
              <Icon
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color={'#333333'}
                type="ionicon"
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? '#A9A9A9' : '#777',
    borderRadius: wp(2),
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(0.2),
    paddingHorizontal: wp(2),
    width: wp(80),
    alignSelf: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: wp(3.5),
    color: '#000',
  },
  dropdownContainer: {
    position: 'absolute',
    width: wp(80),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    maxHeight: hp(20), // Fixed height
    top: hp(6),
    padding: wp(2),
  },
  dropdownScroll: {
    maxHeight: hp(20), // Ensure scrolling within dropdown
  },
  dropdownItem: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    margin: wp(1),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  dropdownText: {
    fontSize: wp(3.5),
    color: '#333',
  },
});

export default CustomTextInput;
