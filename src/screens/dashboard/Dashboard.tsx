import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Platform,
  RefreshControl,
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
import {styles} from '../../assets/styles/dashboard/DashboardStyles';
import RecommendedSection from './RecommendationSection';

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

  const fetchProducts = async () => {
    try {
      const response: {data: Productss[]} = await apiHelper({
        method: 'GET',
        endpoint: 'products',
      });
      setProducts(Array.isArray(response?.data) ? response.data : []);
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
      await Promise.all([fetchProducts(), fetchBanners(), fetchCategories()]);
    };
    fetchInitialData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchProducts(), fetchBanners(), fetchCategories()]);
    } catch (error) {
      console.warn('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
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
          <RecommendedSection products={products} />
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
