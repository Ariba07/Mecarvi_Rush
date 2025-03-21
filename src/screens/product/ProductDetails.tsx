import React from 'react';
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
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productData,
  theme,
}) => (
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
      <Text style={styles.productPrice}>
        ${productData?.price.toFixed(2) || '250'}
      </Text>
    </View>
  </View>
);

export default ProductDetails;
