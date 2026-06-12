/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Productss} from '../../types/navigation';
import ProductCard from '../../components/common/productCard/ProductCard';
import {ThemeContext} from '../../context/ThemeContext';
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
    <Animatable.View animation="fadeInUp" duration={1000}>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: theme.text || '#333'}]}>
          {getSectionTitle()}
        </Text>

        {products.length > 0 ? (
          <View style={{paddingVertical: 10}}>
            {products.slice(0, 6).map((item, index) => (
              <Animatable.View
                key={item.id}
                animation="fadeIn"
                duration={800}
                delay={index * 200}>
                <ProductCard
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
              </Animatable.View>
            ))}
          </View>
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
    </Animatable.View>
  );
};

export default FeaturedProductsSection;
