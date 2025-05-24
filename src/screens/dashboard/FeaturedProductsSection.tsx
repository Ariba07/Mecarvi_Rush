/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, FlatList} from 'react-native';
import {Productss} from '../../components/types/screenTypes/ScreenTypes';
import ProductCard from '../../components/common/productCard/ProductCard';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';

interface FeaturedProductsSectionProps {
  products: Productss[];
  sectionType:
    | 'featured'
    | 'top_rated'
    | 'hot'
    | 'trending'
    | 'flash_deal'
    | 'best_seller'
    | 'bid_save'
    | 'new'
    | 'sale'
    | 'hottest_deal';
}

const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  sectionType,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const getSectionTitle = () => {
    const titles = {
      featured: 'Featured',
      top_rated: 'Top Rated',
      hot: 'Hot',
      trending: 'Trending',
      flash_deal: 'Flash Deals',
      best_seller: 'Best Sellers',
      bid_save: 'Bid & Save',
      new: 'New Arrivals',
      sale: 'On Sale',
      hottest_deal: 'Hottest Deals',
    };
    return titles[sectionType];
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, {color: theme.text || '#333'}]}>
        {getSectionTitle()}
      </Text>
      {products.length > 0 ? (
        <FlatList
          data={products.slice(0, 5)}
          horizontal
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <ProductCard
              key={item.id}
              productUuid={item.product_uuid}
              name={item.name}
              price={item.price}
              image={
                item.featured_image
                  ? {uri: item.featured_image}
                  : {
                      uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                    }
              }
            />
          )}
          contentContainerStyle={{paddingVertical: 10}}
        />
      ) : (
        <Text
          style={{
            color: theme.text || '#333',
            textAlign: 'center',
            padding: 10,
          }}>
          No products available
        </Text>
      )}
    </View>
  );
};

export default FeaturedProductsSection;
