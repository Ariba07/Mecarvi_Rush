import React from 'react';
import {View, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {styles} from '../../assets/styles/product/Product';

interface AttributeSelectorProps {
  attributes: any[];
  attributeValues: {[key: string]: string};
  setAttributeValues: (values: {[key: string]: string}) => void;
  theme: any;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  attributes,
  attributeValues,
  setAttributeValues,
  theme,
}) => {
  const handleChange = (
    key: string,
    value: string | {id: number; name: string}[] | string[],
  ) => {
    const processedValue = Array.isArray(value)
      ? value
          .map(item => (typeof item === 'string' ? item : item.name))
          .join(', ')
      : value;
    setAttributeValues({
      ...attributeValues,
      [key]: processedValue,
    });
  };

  return (
    <>
      {attributes.map(attr => (
        <View key={attr.key} style={{marginBottom: hp(2)}}>
          <Text style={[styles.label, {color: theme.text}]}>{attr.label}</Text>
          <CustomTextInput
            placeholder={attr.placeholder}
            value={attributeValues[attr.key] || ''}
            width={wp(90)}
            onChangeText={text => handleChange(attr.key, text)}
            isMultiSelect={false}
            options={attr.options}
          />
        </View>
      ))}
    </>
  );
};

export default AttributeSelector;
