/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomTextInput from '../../components/common/textInput/CustomTextInput';
import DocumentPicker from 'react-native-document-picker';
import File from '../../assets/images/File.svg';
import {styles} from '../../assets/styles/product/Product';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {addToCart} from '../../slice/Slice';
import {CartItem} from '../../components/types/screenTypes/ScreenTypes';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

interface AttributesSectionProps {
  attributes: any[];
  attributeValues: {[key: string]: string};
  setAttributeValues: (values: {[key: string]: string}) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  frontFile: any;
  setFrontFile: (file: any) => void;
  backFile: any;
  setBackFile: (file: any) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  theme: any;
  navigation: NativeStackNavigationProp<any>;
  productData: any;
  productUuid: string | null;
}

const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  attributeValues,
  setAttributeValues,
  selectedColor,
  setSelectedColor,
  frontFile,
  setFrontFile,
  backFile,
  setBackFile,
  reviewText,
  setReviewText,
  theme,
  navigation,
  productData,
  productUuid,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

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

  const pickDocument = async (setFile: Function) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setFile(res);
    } catch (err) {
      console.log(
        DocumentPicker.isCancel(err)
          ? 'User cancelled'
          : 'Error picking document:',
        err,
      );
    }
  };

  const colorMap: {[key: string]: string} = {
    red: '#FF0000',
    grey: '#808080',
    indigo: '#4B0082',
    black: '#000000',
    white: '#FFFFFF',
    blue: '#0000FF',
    green: '#008000',
    yellow: '#FFFF00',
    purple: '#800080',
    orange: '#FFA500',
  };

  const colorOptions = attributes
    .flatMap(attr => attr.options)
    .filter(
      (color: string, index: number, self: string[]) =>
        self.indexOf(color) === index,
    );

  const getHexColor = (colorName: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(colorName)
      ? colorName
      : colorMap[colorName.toLowerCase()] || '#808080';

  const handleChooseForMe = () => {
    if (!productUuid || !productData) {
      return;
    }

    const cartItem: CartItem = {
      id: productData.id,
      productUuid,
      name: productData.name || 'Unnamed Product',
      price: productData.price || 0,
      quantity: quantity || 1, // Ensure quantity has a default
      selectedColor: selectedColor ? getHexColor(selectedColor) : undefined,
      frontFile: frontFile ? {uri: frontFile.uri} : undefined,
      backFile: backFile ? {uri: backFile.uri} : undefined,
      orderNotes: reviewText || undefined,
      attributes: attributeValues,
    };

    console.log('Dispatching cartItem:', cartItem);
    dispatch(addToCart(cartItem));
  };

  const handleRequestQuote = async () => {
    if (!productUuid || !productData) {
      return;
    }

    const cartItem: CartItem = {
      id: productData.id,
      productUuid,
      name: productData.name || 'Unnamed Product',
      price: productData.price || 0,
      quantity: quantity,
      selectedColor: selectedColor ? getHexColor(selectedColor) : undefined,
      frontFile: frontFile ? {uri: frontFile.uri} : undefined,
      backFile: backFile ? {uri: backFile.uri} : undefined,
      orderNotes: reviewText || undefined,
      attributes: attributeValues,
    };

    // Prepare form-data for the API request
    const formData = new FormData();
    formData.append('product_id', cartItem.id.toString());
    formData.append('quantity', cartItem.quantity?.toString() || '1');
    formData.append('note', cartItem.orderNotes || '');

    if (cartItem.attributes) {
      Object.entries(cartItem.attributes).forEach(([key, value]) => {
        formData.append(`details[${key}]`, value);
      });
    }

    if (cartItem.frontFile && frontFile) {
      formData.append('front_image', {
        uri: frontFile.uri,
        type: frontFile.type || 'image/jpeg',
        name: frontFile.name || 'front_image.jpg',
      });
    }
    if (cartItem.backFile && backFile) {
      formData.append('back_image', {
        uri: backFile.uri,
        type: backFile.type || 'image/jpeg',
        name: backFile.name || 'back_image.jpg',
      });
    }

    try {
      // Call the apiHelper function
      const result: {success: boolean; [key: string]: any} = await apiHelper({
        method: 'POST',
        endpoint: 'quote-requests/',
        data: formData,
      });

      console.log('Quote Request Response:', result);

      navigation.navigate('Quote');
    } catch (error) {
      console.error('Error making quote request:', error);
      // Handle network error (e.g., show error message to user)
    }

    // Optionally still dispatch to cart
    dispatch(addToCart(cartItem));
  };

  return (
    <View style={styles.attributeContainer}>
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
      <Text style={[styles.label, {color: theme.text}]}>Color</Text>
      <View style={styles.colorOptionsContainer}>
        {colorOptions.map((color: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.colorOption,
              {backgroundColor: getHexColor(color)},
              selectedColor === color && styles.selectedBorder,
            ]}
            onPress={() => setSelectedColor(color)}
          />
        ))}
      </View>
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
            onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
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
            onPress={() => setQuantity(prev => prev + 1)}>
            <Text style={{color: theme.input, fontSize: wp(5)}}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.label, {color: theme.text}]}>
        Upload Logo/Artwork
      </Text>
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickDocument(setFrontFile)}>
          {frontFile ? (
            <Image source={{uri: frontFile.uri}} style={styles.uploadedImage} />
          ) : (
            <>
              <File width={wp(10)} height={wp(10)} style={styles.fileIcon} />
              <Text style={[styles.uploadText, {color: theme.text}]}>
                Front Image
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => pickDocument(setBackFile)}>
          {backFile ? (
            <Image source={{uri: backFile.uri}} style={styles.uploadedImage} />
          ) : (
            <>
              <File width={wp(10)} height={wp(10)} style={styles.fileIcon} />
              <Text style={[styles.uploadText, {color: theme.text}]}>
                Back Image
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.label, {color: theme.text}]}>Order Notes</Text>
      <TextInput
        style={[
          styles.input,
          {color: theme.input, backgroundColor: theme.backgroundColor},
        ]}
        placeholder="Write description"
        multiline
        value={reviewText}
        onChangeText={setReviewText}
        placeholderTextColor={'#9c9c9c'}
      />

      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.button} onPress={handleChooseForMe}>
            <Text style={[styles.buttonText, {color: theme.backgroundColor}]}>
              Choose for me
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRequestQuote}>
            <Text style={[styles.buttonText, {color: theme.backgroundColor}]}>
              Request a Quote
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.fullWidthButton]}
          onPress={() =>
            navigation.navigate('MarketPlace', {
              fromProduct: true,
              productId: productData.id,
            })
          }>
          <Text style={[styles.buttonText, {color: theme.backgroundColor}]}>
            Add Marketplace
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AttributesSection;
