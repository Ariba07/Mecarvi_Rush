/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
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
import {ThemeContext} from '../../helperUtils/theme/ThemeContext';
import * as Animatable from 'react-native-animatable';
import PhoneInput from 'react-native-phone-number-input';

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string | {id: number; name: string}[];
  onChangeText?: (text: string | {id: number; name: string}[]) => void;
  isMultiSelect?: boolean;
  width?: number;
  options?: string[] | {id: number; name: string}[];
  isPhoneNumber?: boolean;
  onCountryCodeChange?: (code: string) => void;
}

const dropdownOptions: {[key: string]: string[]} = {
  'Address-type': ['shipping', 'billing'],
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  isMultiSelect = false,
  width,
  options,
  isPhoneNumber = false,
  onCountryCodeChange,
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const {theme} = useContext(ThemeContext);

  const isDropdownField =
    placeholder in dropdownOptions ||
    placeholder === 'Select Services' ||
    (options && options.length > 0);

  const handleDropdownPress = () => {
    setActiveDropdown(activeDropdown === placeholder ? null : placeholder);
  };

  const handleSelectOption = (option: {id: number; name: string}) => {
    if (isMultiSelect) {
      // Handle multi-select logic if needed
    } else {
      if (onChangeText) {
        onChangeText(option.name);
      }
      setActiveDropdown(null);
    }
  };

  const getDropdownOptions = () => {
    if (options && options.length > 0) {
      return options.map(option =>
        typeof option === 'string' ? {id: 0, name: option} : option,
      );
    }
    return (dropdownOptions[placeholder] || []).map(option => ({
      id: 0,
      name: option,
    }));
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      style={{zIndex: activeDropdown === placeholder ? 1000 : 1}}>
      {isDropdownField && !isPhoneNumber ? (
        <>
          <TouchableOpacity
            style={[
              styles.container,
              {
                width: width ? width : wp(80),
                backgroundColor: theme.button || '#fff',
              },
            ]}
            onPress={handleDropdownPress}>
            <TextInput
              style={[styles.input, {color: theme.input}]}
              placeholder={placeholder}
              value={value as string}
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
            <Animatable.View
              animation="fadeIn"
              duration={400}
              style={[
                styles.dropdownContainer,
                {
                  width: width ? width : wp(80),
                  backgroundColor: theme.whole || '#fff',
                  zIndex: 1000,
                },
              ]}>
              <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                {getDropdownOptions().map((item, index) => {
                  const option =
                    typeof item === 'string' ? {id: 0, name: item} : item;
                  return (
                    <Animatable.View
                      key={option.id || option.name}
                      animation="fadeInUp"
                      duration={400}
                      delay={index * 50}
                      style={[
                        styles.dropdownItem,
                        {backgroundColor: theme.backgroundColor || '#f5f5f5'},
                      ]}>
                      <TouchableOpacity
                        onPress={() => handleSelectOption(option)}>
                        <Text
                          style={[styles.dropdownText, {color: theme.input}]}>
                          {option.name}
                        </Text>
                      </TouchableOpacity>
                    </Animatable.View>
                  );
                })}
              </ScrollView>
            </Animatable.View>
          )}
        </>
      ) : isPhoneNumber ? (
        <PhoneInput
          defaultValue={value as string}
          defaultCode="US"
          layout="first"
          onChangeText={onChangeText}
          onChangeCountry={country => {
            if (onCountryCodeChange) {
              onCountryCodeChange(`+${country.callingCode[0]}`);
            }
          }}
          containerStyle={[
            styles.container,
            {
              width: width ? width : wp(80),
              backgroundColor: theme.button || '#fff',
            },
          ]}
          textContainerStyle={styles.textContainer}
          textInputStyle={[styles.input, {color: theme.input}]}
          codeTextStyle={[styles.countryCodeText, {color: theme.input}]}
          placeholder={placeholder}
          textInputProps={{
            placeholderTextColor: '#999',
            keyboardType: 'phone-pad',
          }}
        />
      ) : (
        <View
          style={[
            styles.container,
            {
              width: width ? width : wp(80),
              backgroundColor: theme.button || '#fff',
            },
          ]}>
          <TextInput
            style={[styles.input, {color: theme.input}]}
            placeholder={placeholder}
            secureTextEntry={!isPasswordVisible}
            value={value as string}
            onChangeText={onChangeText}
            placeholderTextColor={'#999'}
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
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: hp(0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Platform.OS === 'ios' ? '#A9A9A9' : '#777777',
    borderRadius: wp(2),
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(0.2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    fontSize: wp(3.5),
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
  },
  dropdownContainer: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    maxHeight: hp(20),
    top: hp(6),
    padding: wp(2),
  },
  dropdownScroll: {
    maxHeight: hp(20),
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
  countryCodeText: {
    fontSize: wp(3.5),
    marginRight: wp(1),
  },
});

export default CustomTextInput;
