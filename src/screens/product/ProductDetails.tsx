/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import BestSeller from '../../assets/images/BestSeller.svg';
import {renderStars} from '../../components/common/review/RenderStars';
import {styles} from '../../assets/styles/product/Product';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
    // Start with the original price
    const basePrice = productData?.price || 250;
    const discountAmount = productData?.discount_amount || 0;

    // Use discounted price if available, otherwise original price
    const startingPrice = discountAmount > 0 ? discountAmount : basePrice;

    // Initialize adjusted price
    let adjustedPrice = startingPrice;

    // Add size variation price if selected
    if (selectedSize && productData?.size_variations) {
      const sizeVariation = productData.size_variations.find(
        (v: any) => v.size_name === selectedSize,
      );
      if (sizeVariation) {
        adjustedPrice += sizeVariation.size_price;
      }
    }

    // Add attribute price adjustments
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

    // Calculate original price before discount for strikethrough
    const originalPrice = basePrice;

    // Ensure final price is not negative
    const finalPrice = Math.max(0, adjustedPrice);

    return {
      originalPrice,
      finalPrice: finalPrice.toFixed(2),
      hasDiscount: discountAmount > 0,
    };
  };

  const {originalPrice, finalPrice, hasDiscount} = calculatePrice();

  // Update finalPrice in parent component
  useEffect(() => {
    setFinalPrice(parseFloat(finalPrice));
  }, [finalPrice, setFinalPrice]);

  return (
    <View style={styles.productDetailsContainer}>
      <View style={styles.bestSellerBadge}>
        <BestSeller width={wp(3)} height={hp(3)} />
        <Text style={[styles.bestSellerText, {color: theme.bottom}]}>
          Best Seller
        </Text>
      </View>
      <View style={styles.productInfoContainer}>
        <View>
          <Text style={[styles.productTitle, {color: theme.input}]}>
            {productData?.name || 'Signage'}
          </Text>
          <View style={styles.ratingContainer}>
            {renderStars(Number('4.5'))}
            <Text style={[styles.ratingText, {color: theme.input}]}>4.5</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
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
        </View>
      </View>
    </View>
  );
};

export default ProductDetails;
