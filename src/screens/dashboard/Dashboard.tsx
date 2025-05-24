/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Platform,
  RefreshControl,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Productss} from '../../components/types/screenTypes/ScreenTypes';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectDefaultCity, selectDefaultCountry} from '../../slice/Slice';
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
    } catch (error) {
      console.warn('Error fetching products:', error);
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
    } catch (error) {
      console.warn('Error fetching banners:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'categories/?parent_only=1',
      })) as any;
      setCategories(response.data);
    } catch (error) {
      console.warn('Error fetching categories:', error);
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
    } catch (error) {
      console.warn('Error during refresh:', error);
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
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.whole || '#F5F7FA'}]}>
      <HeaderTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
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
          <FilterSection
            defaultCity={defaultCity}
            defaultCountry={defaultCountry}
          />
          <BannerSection banners={banners} />
          <ServicesSection categories={categories} />
          <FlatList
            data={sectionTypes}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={renderSectionTab}
            keyExtractor={item => item}
            style={{marginVertical: wp(2), paddingHorizontal: wp(2)}}
            contentContainerStyle={{paddingRight: wp(2)}}
          />
          <FeaturedProductsSection
            products={products}
            sectionType={selectedSection as any}
          />
        </ScrollView>
      ) : (
        <View style={styles.availContainer}>
          <Text style={styles.availTxt}>Available Soon</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Dashboard;
