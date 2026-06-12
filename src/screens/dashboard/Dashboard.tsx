/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Platform,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Productss} from '../../types/navigation';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {apiHelper} from '../../services/api';
import {ThemeContext} from '../../context/ThemeContext';
import {useSelector} from 'react-redux';
import {selectDefaultCity, selectDefaultCountry} from '../../store/authSlice';
import HeaderTabs from './HeaderTabs';
import FilterSection from './FilterSection';
import BannerSection from './BannerSection';
import ServicesSection from './ServicesSection';
import FeaturedProductsSection from './FeaturedProductsSection';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';

const Dashboard: React.FC = () => {
  const {theme} = useContext(ThemeContext);
  const defaultCity = useSelector(selectDefaultCity);
  const defaultCountry = useSelector(selectDefaultCountry);
  const [selectedTab, setSelectedTab] = useState<'prints' | 'rentals'>(
    'prints',
  );
  const [products, setProducts] = useState<Productss[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string>('featured');

  const sectionTypes: Array<
    | 'featured'
    | 'top_rated'
    | 'hot'
    | 'trending'
    | 'flash_deal'
    | 'best_seller'
    | 'bid_save'
    | 'new'
    | 'sale'
    | 'hottest_deal'
  > = [
    'featured',
    'top_rated',
    'hot',
    'trending',
    'flash_deal',
    'best_seller',
    'bid_save',
    'new',
    'sale',
    'hottest_deal',
  ];

  const fetchProducts = async (sectionType: string) => {
    try {
      const queryParams = new URLSearchParams();
      if (sectionType === 'featured') {
        queryParams.append('highlight_in_featured', '1');
      }
      if (sectionType === 'top_rated') {
        queryParams.append('highlight_in_top_rated', '1');
      }
      if (sectionType === 'hot') {
        queryParams.append('highlight_in_hot', '1');
      }
      if (sectionType === 'trending') {
        queryParams.append('highlight_in_trending', '1');
      }
      if (sectionType === 'flash_deal') {
        queryParams.append('highlight_in_flash_deal', '1');
      }
      if (sectionType === 'best_seller') {
        queryParams.append('highlight_in_best_seller', '1');
      }
      if (sectionType === 'bid_save') {
        queryParams.append('highlight_in_bid_save', '1');
      }
      if (sectionType === 'new') {
        queryParams.append('highlight_in_new', '1');
      }
      if (sectionType === 'sale') {
        queryParams.append('highlight_in_sale', '1');
      }
      if (sectionType === 'hottest_deal') {
        queryParams.append('highlight_in_hottest_deals', '1');
      }
      const endpoint = `products?${queryParams.toString()}`;
      const response: {data: Productss[]} = await apiHelper({
        method: 'GET',
        endpoint: endpoint,
      });
      setProducts(
        Array.isArray(response?.data) ? response.data.slice(0, 5) : [],
      );
    } catch (error: any) {
      setProducts([]);
    }
  };

  const fetchBanners = async () => {
    try {
      const response: {data: any[]} = await apiHelper({
        method: 'GET',
        endpoint: 'banners',
      });
      setBanners(response.data || []);
    } catch (error: any) {
      setBanners([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'categories/?parent_only=1',
      })) as any;
      setCategories(response.data);
    } catch (error: any) {
      setCategories([]);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await Promise.all([
        fetchProducts(selectedSection),
        fetchBanners(),
        fetchCategories(),
      ]);
    };
    fetchInitialData();
  }, [selectedSection]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchProducts(selectedSection),
        fetchBanners(),
        fetchCategories(),
      ]);
    } catch (error: any) {
    } finally {
      setRefreshing(false);
    }
  };

  const renderSectionTab = ({item}: {item: string}) => {
    const isSelected = selectedSection === item;
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
    return (
      <Animatable.View animation="fadeIn" duration={800} delay={200}>
        <TouchableOpacity
          onPress={() => setSelectedSection(item)}
          style={{
            width: wp(25),
            height: wp(8),
            marginHorizontal: wp(1),
            backgroundColor: isSelected ? '#FF00A7' : '#E0E0E0',
            borderRadius: wp(2),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: isSelected ? '#FFF' : theme.text || '#333',
              fontSize: wp(3.5),
              fontWeight: isSelected ? 'bold' : 'normal',
            }}>
            {titles[item as keyof typeof titles]}
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.whole || '#F5F7FA'}]}>
      <Animatable.View animation="fadeInDown" duration={1000}>
        <HeaderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </Animatable.View>
      {selectedTab === 'prints' ? (
        <ScrollView
          style={{marginBottom: Platform.OS === 'ios' ? wp(15) : wp(20)}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.text || '#FF00A7'}
            />
          }>
          <Animatable.View animation="fadeInUp" duration={1000} delay={300}>
            <FilterSection
              defaultCity={defaultCity}
              defaultCountry={defaultCountry}
            />
          </Animatable.View>
          <Animatable.View animation="fadeInUp" duration={1000} delay={600}>
            <BannerSection banners={banners} />
          </Animatable.View>
          <Animatable.View animation="fadeInUp" duration={1000} delay={900}>
            <ServicesSection categories={categories} />
          </Animatable.View>
          <Animatable.View animation="fadeInUp" duration={1000} delay={1200}>
            <FlatList
              data={sectionTypes}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderSectionTab}
              keyExtractor={item => item}
              style={{marginVertical: wp(2), paddingHorizontal: wp(2)}}
              contentContainerStyle={{paddingRight: wp(2)}}
            />
          </Animatable.View>
          <Animatable.View animation="fadeInUp" duration={1000} delay={1500}>
            <FeaturedProductsSection
              products={products}
              sectionType={selectedSection as any}
            />
          </Animatable.View>
        </ScrollView>
      ) : (
        <Animatable.View
          animation="fadeIn"
          duration={1000}
          style={styles.availContainer}>
          <Text style={styles.availTxt}>Available Soon</Text>
        </Animatable.View>
      )}
    </SafeAreaView>
  );
};

export default Dashboard;
