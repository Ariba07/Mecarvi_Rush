/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/product/Product';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
  theme: any;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  theme,
}) => {
  return (
    <View style={{marginBottom: hp(2)}}>
      <Text style={[styles.label, {color: theme.text}]}>Quantity</Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: wp(30),
          justifyContent: 'space-between',
          marginTop: hp(1),
        }}>
        <TouchableOpacity
          style={{
            width: wp(8),
            height: wp(8),
            borderRadius: wp(4),
            backgroundColor: theme.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}>
          <Text style={{color: theme.input, fontSize: wp(5)}}>-</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: wp(4.5),
            color: theme.text,
            width: wp(10),
            textAlign: 'center',
          }}>
          {quantity}
        </Text>
        <TouchableOpacity
          style={{
            width: wp(8),
            height: wp(8),
            borderRadius: wp(4),
            backgroundColor: theme.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => setQuantity(Math.max(1, quantity + 1))}>
          <Text style={{color: theme.input, fontSize: wp(5)}}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default QuantitySelector;
