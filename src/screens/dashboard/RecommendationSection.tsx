/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {Productss} from '../../components/types/screenTypes/ScreenTypes';
import ProductCard from '../../components/common/productCard/ProductCard';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';

interface RecommendedSectionProps {
  products: Productss[];
}

const RecommendedSection: React.FC<RecommendedSectionProps> = ({products}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.text || '#333'}]}>
        Recommended
      </Text>
      {Array.isArray(products) && products.length > 0 ? (
        products.slice(0, 5).map(item => {
          const imageSource = item.featured_image
            ? {uri: item.featured_image}
            : {
                uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
              };
          return (
            <ProductCard
              key={item.id}
              productUuid={item.product_uuid}
              name={item.name}
              price={item.price}
              image={imageSource}
            />
          );
        })
      ) : (
        <Text style={{color: theme.text || '#333', textAlign: 'center'}}>
          No products available
        </Text>
      )}
    </View>
  );
};

export default RecommendedSection;
