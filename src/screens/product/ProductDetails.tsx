/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {styles} from '../../assets/styles/product/Product';

interface ProductDetailsProps {
  productData: any;
  theme: any;
  attributeValues: {[key: string]: string};
  selectedSize: string | null;
  setFinalPrice: (price: number) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productData,
  theme,
  attributeValues,
  selectedSize,
  setFinalPrice,
}) => {
  const calculatePrice = () => {
    const basePrice = productData?.price || 250;
    const discountAmount = productData?.discount_amount || 0;
    const startingPrice = discountAmount > 0 ? discountAmount : basePrice;
    let adjustedPrice = startingPrice;

    if (selectedSize && productData?.size_variations) {
      const sizeVariation = productData.size_variations.find(
        (v: any) => v.size_name === selectedSize,
      );
      if (sizeVariation) {
        adjustedPrice += sizeVariation.size_price;
      }
    }

    if (productData?.attributes && attributeValues) {
      productData.attributes.forEach((attr: any) => {
        const attrKey = attr.general_attribute.general_attribute_uuid;
        if (attributeValues[attrKey]) {
          const selectedValue = attr.attribute_values.find(
            (val: any) => val.attribute_name === attributeValues[attrKey],
          );
          if (selectedValue) {
            const adjustment = parseFloat(selectedValue.price_adjustment) || 0;
            if (selectedValue.price_type === 'fixed') {
              adjustedPrice += adjustment;
            } else if (selectedValue.price_type === 'percentage') {
              adjustedPrice += (startingPrice * adjustment) / 100;
            }
          }
        }
      });
    }

    const originalPrice = basePrice;
    const finalPrice = Math.max(0, adjustedPrice);

    return {
      originalPrice,
      finalPrice: finalPrice.toFixed(2),
      hasDiscount: discountAmount > 0,
    };
  };

  const {originalPrice, finalPrice, hasDiscount} = calculatePrice();

  useEffect(() => {
    setFinalPrice(parseFloat(finalPrice));
  }, [finalPrice, setFinalPrice]);

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={800}
      style={styles.productDetailsContainer}>
      <View style={styles.productInfoContainer}>
        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Text style={[styles.productTitle, {color: theme.input}]}>
            {productData?.name || 'Signage'}
          </Text>
        </Animatable.View>
        <Animatable.View
          animation="fadeInUp"
          duration={800}
          delay={600}
          style={styles.priceContainer}>
          <Text style={[styles.productPrice, {color: theme.input}]}>
            ${finalPrice}
          </Text>
          {hasDiscount && (
            <Text
              style={[
                styles.originalPrice,
                {textDecorationLine: 'line-through'},
              ]}>
              ${originalPrice.toFixed(2)}
            </Text>
          )}
        </Animatable.View>
      </View>
    </Animatable.View>
  );
};

export default ProductDetails;
