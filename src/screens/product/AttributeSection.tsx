import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {useDispatch} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {styles} from '../../assets/styles/product/Product';
import {addToCart, setSourceType} from '../../store/authSlice';
import ActionButtons from './ActionButtons';
import AttributeSelector from './AttributeSelector';
import ColorSelector from './ColorSelector';
import FileUploader from './FileUploader';
import OrderNotes from './OrderNotes';
import QuantitySelector from './QuantitySelector';
import SizeSelector from './SizeSelector';
import {validateSelections, createCartItem} from './utils';
import CustomModal from '../../components/common/errorModal/CustomModal';

interface AttributesSectionProps {
  attributes: any[];
  attributeValues: {[key: string]: string};
  setAttributeValues: (values: {[key: string]: string}) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  frontFile: any;
  setFrontFile: (file: any) => void;
  backFile: any;
  setBackFile: (file: any) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  theme: any;
  navigation: NativeStackNavigationProp<any>;
  productData: any;
  productUuid: string | '';
  finalPrice: number;
}

const AttributesSection: React.FC<AttributesSectionProps> = ({
  attributes,
  attributeValues,
  setAttributeValues,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
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
  finalPrice,
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');

  useEffect(() => {
    const defaultAttributeValues: {[key: string]: string} = {};
    let hasNewAttributes = false;
    attributes.forEach(attr => {
      if (
        attr.options &&
        attr.options.length > 0 &&
        !attributeValues[attr.key]
      ) {
        defaultAttributeValues[attr.key] = attr.options[0];
        hasNewAttributes = true;
      }
    });

    if (hasNewAttributes) {
      setAttributeValues({
        ...attributeValues,
        ...defaultAttributeValues,
      });
    }

    if (
      productData?.size_variations &&
      productData.size_variations.length > 0 &&
      !selectedSize
    ) {
      setSelectedSize(productData.size_variations[0].size_name);
    }
  }, [
    attributeValues,
    attributes,
    productData,
    selectedSize,
    setAttributeValues,
    setSelectedSize,
  ]);

  useEffect(() => {
    console.log('Updated attributeValues:', attributeValues);
  }, [attributeValues]);

  const colorOptions =
    productData?.labels.map((label: any) => label.label_color) || [];

  const handleChooseForMe = () => {
    if (!productUuid || !productData) {
      setModalTitle('Error');
      setModalMessage('Product data or UUID is missing.');
      setModalVisible(true);
      return;
    }

    const validationResult = validateSelections(
      colorOptions,
      selectedColor,
      productData,
      selectedSize,
      frontFile,
      backFile,
    );
    if (!validationResult.success && validationResult.error) {
      setModalTitle(validationResult.error.title);
      setModalMessage(validationResult.error.message);
      setModalVisible(true);
      return;
    }

    const cartItem = createCartItem(
      productData,
      productUuid,
      finalPrice,
      quantity,
      selectedColor,
      frontFile,
      backFile,
      reviewText,
      attributeValues,
      selectedSize,
    );
    console.log('Dispatching cartItem:', cartItem);
    navigation.navigate('Cart');
    dispatch(addToCart(cartItem));
    dispatch(setSourceType('cart'));
  };

  const handleRequestQuote = async () => {
    if (!productUuid || !productData) {
      setModalTitle('Error');
      setModalMessage('Product data or UUID is missing.');
      setModalVisible(true);
      return;
    }

    const validationResult = validateSelections(
      colorOptions,
      selectedColor,
      productData,
      selectedSize,
      frontFile,
      backFile,
    );
    if (!validationResult.success && validationResult.error) {
      setModalTitle(validationResult.error.title);
      setModalMessage(validationResult.error.message);
      setModalVisible(true);
      return;
    }
    // FormData and API logic handled in ActionButtons
  };

  const handleMarketplace = () => {
    if (!productUuid || !productData) {
      setModalTitle('Error');
      setModalMessage('Product data or UUID is missing.');
      setModalVisible(true);
      return;
    }

    const validationResult = validateSelections(
      colorOptions,
      selectedColor,
      productData,
      selectedSize,
      frontFile,
      backFile,
    );
    if (!validationResult.success && validationResult.error) {
      setModalTitle(validationResult.error.title);
      setModalMessage(validationResult.error.message);
      setModalVisible(true);
      return;
    }

    const cartItem = createCartItem(
      productData,
      productUuid,
      finalPrice,
      quantity,
      selectedColor,
      frontFile,
      backFile,
      reviewText,
      attributeValues,
      selectedSize,
    );
    console.log('Dispatching cartItem:', cartItem);
    navigation.navigate('MarketPlace', {
      fromProduct: true,
      productId: productData.id,
    });
    dispatch(setSourceType('marketplace'));
    dispatch(addToCart(cartItem));
  };

  return (
    <View style={styles.attributeContainer}>
      <SizeSelector
        productData={productData}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        theme={theme}
      />
      <AttributeSelector
        attributes={attributes}
        attributeValues={attributeValues}
        setAttributeValues={setAttributeValues}
        theme={theme}
      />
      <ColorSelector
        colorOptions={colorOptions}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        theme={theme}
      />
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        theme={theme}
      />
      <FileUploader
        frontFile={frontFile}
        setFrontFile={setFrontFile}
        backFile={backFile}
        setBackFile={setBackFile}
        theme={theme}
      />
      <OrderNotes
        reviewText={reviewText}
        setReviewText={setReviewText}
        theme={theme}
      />
      <ActionButtons
        handleChooseForMe={handleChooseForMe}
        handleRequestQuote={handleRequestQuote}
        handleMarketplace={handleMarketplace}
        theme={theme}
        productData={productData}
        cartItem={createCartItem(
          productData,
          productUuid,
          finalPrice,
          quantity,
          selectedColor,
          frontFile,
          backFile,
          reviewText,
          attributeValues,
          selectedSize,
        )}
        navigation={navigation}
      />
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default AttributesSection;
