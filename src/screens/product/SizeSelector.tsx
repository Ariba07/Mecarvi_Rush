import React from 'react';
import {View, Text} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import {styles} from '../../assets/styles/product/Product';

interface SizeSelectorProps {
  productData: any;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  theme: any;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  productData,
  selectedSize,
  setSelectedSize,
  theme,
}) => {
  return (
    <>
      {productData?.size_variations.length > 0 && (
        <View style={{marginBottom: hp(2)}}>
          <Text style={[styles.label, {color: theme.text}]}>Size *</Text>
          <CustomTextInput
            placeholder="Select Size"
            value={selectedSize || ''}
            width={wp(90)}
            onChangeText={text => setSelectedSize(text as string)}
            isMultiSelect={false}
            options={productData.size_variations.map((v: any) => v.size_name)}
          />
        </View>
      )}
    </>
  );
};

export default SizeSelector;
