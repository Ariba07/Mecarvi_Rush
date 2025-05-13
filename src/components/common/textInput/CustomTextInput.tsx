/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
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
import {apiHelper} from '../../helperUtils/apiHelper/ApiHelper';

interface CustomTextInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  value?: string | {id: number; name: string}[];
  onChangeText?: (text: string | {id: number; name: string}[]) => void;
  isMultiSelect?: boolean;
  width?: number;
  options?: string[] | {id: number; name: string}[]; // Add options prop
}

const dropdownOptions: {[key: string]: string[]} = {
  'State Registration': ['Registered', 'Unregistered', 'Pending'],
  'Legal Structure of Business': ['Sole Proprietorship', 'Partnership', 'LLC'],
  'Select Capacity': ['Small', 'Medium', 'Large'],
  'Select Your Target Market': ['Local', 'National', 'International'],
  'Address-type': ['shipping', 'billing'],
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
  isMultiSelect = false,
  width,
  options, // Add options to destructured props
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(!secureTextEntry);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<
    {id: number; name: string}[]
  >(Array.isArray(value) ? value : []);
  const {theme} = useContext(ThemeContext);

  const [categories, setCategories] = useState<{id: number; name: string}[]>(
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: {data: {data: any[]}} = await apiHelper({
          method: 'GET',
          endpoint: 'categories/?parent_only=1',
        });
        const categoryData = (response?.data?.data || []).map(category => ({
          id: category.id,
          name: category.name,
        }));
        setCategories(categoryData);
      } catch (error) {
        console.warn('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const isDropdownField =
    placeholder in dropdownOptions ||
    placeholder === 'Select Services' ||
    (options && options.length > 0); // Consider it a dropdown if options are provided

  const handleDropdownPress = () => {
    setActiveDropdown(activeDropdown === placeholder ? null : placeholder);
  };

  const handleSelectOption = (option: {id: number; name: string}) => {
    if (isMultiSelect) {
      const isSelected = selectedServices.some(item => item.id === option.id);
      const updatedSelections = isSelected
        ? selectedServices.filter(item => item.id !== option.id)
        : [...selectedServices, option];
      setSelectedServices(updatedSelections);
      if (onChangeText) {
        onChangeText(updatedSelections);
      }
    } else {
      if (onChangeText) {
        onChangeText(option.name);
      }
      setActiveDropdown(null);
    }
  };

  const getDropdownOptions = () => {
    // Use passed options if provided
    if (options && options.length > 0) {
      return options.map(option =>
        typeof option === 'string'
          ? {id: 0, name: option} // Convert string options to object format
          : option,
      );
    }
    // Fallback to internal logic
    if (placeholder === 'Select Services') {
      return categories;
    }
    return (dropdownOptions[placeholder] || []).map(option => ({
      id: 0,
      name: option,
    }));
  };

  return (
    <View>
      {isDropdownField ? (
        <>
          <TouchableOpacity
            style={[
              styles.container,
              {
                width: width ? width : wp(80),
                backgroundColor: theme.backgroundColor,
              },
            ]}
            onPress={handleDropdownPress}>
            <TextInput
              style={[styles.input, {color: theme.input}]}
              placeholder={placeholder}
              value={
                isMultiSelect
                  ? selectedServices.map(service => service.name).join(', ')
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
            <View
              style={[
                styles.dropdownContainer,
                {width: width ? width : wp(80), backgroundColor: theme.whole},
              ]}>
              <ScrollView nestedScrollEnabled style={styles.dropdownScroll}>
                {getDropdownOptions().map(item => {
                  const option =
                    typeof item === 'string' ? {id: 0, name: item} : item;
                  return (
                    <TouchableOpacity
                      key={option.id || option.name}
                      style={[
                        styles.dropdownItem,
                        {backgroundColor: theme.backgroundColor},
                        selectedServices.some(s => s.id === option.id) && {
                          backgroundColor: '#9c9c9c',
                        },
                      ]}
                      onPress={() => handleSelectOption(option)}>
                      <Text style={[styles.dropdownText, {color: theme.input}]}>
                        {option.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </>
      ) : (
        <View
          style={[
            styles.container,
            {
              width: width ? width : wp(80),
              backgroundColor: theme.backgroundColor,
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
    borderColor: Platform.OS === 'ios' ? '#A9A9A9' : '#777 777',
    borderRadius: wp(2),
    paddingVertical: Platform.OS === 'ios' ? hp(1.5) : hp(0.2),
    paddingHorizontal: wp(2),
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    fontSize: wp(3.5),
  },
  dropdownContainer: {
    position: 'absolute',
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
});

export default CustomTextInput;
