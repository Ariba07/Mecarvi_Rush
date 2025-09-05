import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {setSourceType} from '../../slice/Slice';
import {styles} from '../../assets/styles/product/Product';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {CartItem} from '../../components/types/screenTypes/ScreenTypes';

interface ActionButtonsProps {
  handleChooseForMe: () => void;
  handleRequestQuote: () => void;
  handleMarketplace: () => void;
  theme: any;
  productData: any;
  cartItem: CartItem;
  navigation?: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleChooseForMe,
  handleMarketplace,
  theme,
  cartItem,
  navigation,
}) => {
  const dispatch = useDispatch();

  const handleRequestQuoteInternal = async () => {
    const formData = new FormData();
    formData.append('product_id', cartItem.id.toString());
    formData.append('quantity', cartItem.quantity?.toString() || '1');
    formData.append('note', cartItem.orderNotes || '');

    if (cartItem.attributes) {
      Object.entries(cartItem.attributes).forEach(([key, value]) => {
        if (value) {
          formData.append(`details[${key}]`, value);
        }
      });
    }

    if (cartItem.frontFile) {
      formData.append('front_image', {
        uri: cartItem.frontFile.uri,
        type: cartItem.frontFile.type || 'image/jpeg',
        name: cartItem.frontFile.name || 'front_image.jpg',
      });
    }
    if (cartItem.backFile) {
      formData.append('back_image', {
        uri: cartItem.backFile.uri,
        type: cartItem.backFile.type || 'image/jpeg',
        name: cartItem.backFile.name || 'back_image.jpg',
      });
    }

    try {
      const result: {success: boolean; [key: string]: any} = await apiHelper({
        method: 'POST',
        endpoint: 'quote-requests',
        data: formData,
      });
      console.log('Quote Request Response:', result);
      dispatch(setSourceType('quote'));
      navigation.navigate('Quote');
    } catch (error) {
      console.error('Error making quote request:', error);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={handleChooseForMe}>
          <Text style={[styles.buttonText, {color: theme.backgroundColor}]}>
            Choose for me
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleRequestQuoteInternal}>
          <Text style={[styles.buttonText, {color: theme.backgroundColor}]}>
            Request a Quote
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, styles.fullWidthButton]}
        onPress={handleMarketplace}>
        <Text style={[styles.buttonText, {color: theme.backgroundColor}]}>
          Add Marketplace
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;
