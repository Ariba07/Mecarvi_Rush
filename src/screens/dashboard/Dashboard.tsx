/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {
  Productss,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductCard from '../../components/common/productCard/ProductCard';
import SideMenu from '../../assets/images/SideMenu.svg';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectDefaultCity,
  selectDefaultCountry,
  setServiceUuid,
} from '../../slice/Slice';

const banners = [
  {id: '1', image: require('../../assets/images/Banner.png')},
  {id: '2', image: require('../../assets/images/Banner.png')},
  {id: '3', image: require('../../assets/images/Banner.png')},
];

const Dashboard: React.FC = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const move = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<any[]>([]);
  const {theme} = useContext(ThemeContext); // Access theme
  const dispatch = useDispatch();
  const defaultCity = useSelector(selectDefaultCity);
  const defaultCountry = useSelector(selectDefaultCountry);

  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTab, setSelectedTab] = useState<'prints' | 'rentals'>(
    'prints',
  ); // Track selected tab

  const [products, setProducts] = useState<Productss[]>([]); // Type state with Product

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: {data: Productss[]} = await apiHelper({
          method: 'GET',
          endpoint: 'products',
        });
        const fetchedProduct = response?.data || [];
        setProducts(fetchedProduct);
      } catch (error) {
        console.warn('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []); // Empty

  const renderBanner = ({item}: any) => (
    <Image source={item.image} style={styles.banner} resizeMode="cover" />
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: {data: {data: any[]}} = await apiHelper({
          method: 'GET',
          endpoint: 'categories/?parent_only=1',
        });
        setCategories(response.data.data || []);
      } catch (error) {
        console.warn('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []); // Empty dependency array

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.whole}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <SideMenu />
        </TouchableOpacity>

        {/* Tab container to hold the "Prints" and "Rentals" tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => setSelectedTab('prints')}
            style={[
              styles.tab,
              selectedTab === 'prints' && styles.selectedTabStyle,
            ]}>
            <Text
              style={[
                styles.title,
                selectedTab === 'prints'
                  ? styles.selectedTabText
                  : {color: theme.text},
              ]}>
              Prints
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedTab('rentals')}
            style={[
              styles.tab,
              selectedTab === 'rentals' && styles.selectedTabStyle,
            ]}>
            <Text
              style={[
                styles.title,
                selectedTab === 'rentals'
                  ? styles.selectedTabText
                  : {color: theme.text},
              ]}>
              Rentals
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedTab === 'prints' ? (
        <ScrollView
          style={{marginBottom: Platform.OS === 'ios' ? wp(15) : wp(20)}}
          showsVerticalScrollIndicator={false}>
          {/** Filter Section */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.locationContainer,
                {backgroundColor: theme.backgroundColor},
              ]}
              onPress={() => {
                move.navigate('Address', {forDelivery: false});
              }}>
              <View style={styles.location}>
                <Icon name="location" size={20} color={'#FF00A7'} />
                <Text style={{color: theme.text}}>
                  {defaultCity !== null && defaultCountry !== null
                    ? `${defaultCity}, ${defaultCountry}`
                    : 'Select a city'}{' '}
                </Text>
                <Icon name="chevron-down" size={15} color={'#5c5c5c'} />
              </View>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.backgroundColor},
                ]}
                onPress={() => move.navigate('Search')}>
                <Icon name="search-outline" size={20} color={'#9c9c9c'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.iconBox,
                  {backgroundColor: theme.backgroundColor},
                ]}
                onPress={() => {
                  move.navigate('Notification');
                }}>
                <Icon
                  name="notifications-outline"
                  size={20}
                  color={'#9c9c9c'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/** Banner Section */}
          <FlatList
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={renderBanner}
            onScroll={event => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / wp('100%'),
              );
              setActiveIndex(index);
            }}
            scrollEventThrottle={16}
          />
          <View style={styles.dotContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === activeIndex ? '#FF00A7' : '#cccccc',
                  },
                ]}
              />
            ))}
          </View>

          {/* Services Section */}
          <View style={styles.section}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.sectionTitle, {color: theme.text}]}>
                Services
              </Text>
              <TouchableOpacity onPress={() => move.navigate('Service')}>
                <Text
                  style={{textDecorationLine: 'underline', color: '#FF00A7'}}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              horizontal
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.serviceCard,
                    {backgroundColor: theme.backgroundColor},
                  ]}
                  onPress={() => {
                    move.navigate('Products');
                    dispatch(setServiceUuid(item.id));
                  }}>
                  <Image
                    source={{uri: item.icon}} // Ensure correct format
                    style={styles.serviceImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={[styles.serviceName, {color: theme.text}]}
                    numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {/* Recommended Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Recommended
            </Text>
            {products.slice(0, 5).map(item => (
              <ProductCard
                key={item.id} // React key
                productUuid={item.product_uuid} // Explicit prop for ProductCard
                name={item.name}
                price={item.price}
                image={require('../../assets/images/Orders.png')}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.availContainer}>
          <Text style={styles.availTxt}>Available Soon</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  title: {fontSize: wp('5%'), fontWeight: 'bold'},
  banner: {
    width: wp('100%'),
    height: hp('20%'),
    borderRadius: 10,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Platform.OS === 'android' ? hp(1) : undefined,
  },
  dot: {
    width: wp('2%'),
    height: wp('2%'),
    borderRadius: wp('1%'),
    marginHorizontal: wp('1%'),
  },
  section: {marginHorizontal: wp('4%'), marginVertical: hp('1S%')},
  sectionTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
  },
  serviceCard: {
    alignItems: 'center',
    marginRight: wp('8.5%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    width: wp('25%'), // Set a fixed width for the service card
    height: wp('25%'), // Set a fixed height for the service card
    justifyContent: 'center',
  },
  serviceImage: {
    width: wp('10%'),
    height: wp('15%'), // Ensure image fits within the service card
    borderRadius: wp('2%'),
  },
  serviceName: {
    marginTop: hp('1%'),
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    maxWidth: wp('20%'), // Ensure text does not overflow the card
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Platform.OS === 'ios' ? hp(0.5) : hp(5), // More height for iOS (status bar)
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? undefined : hp(2),
    paddingHorizontal: hp(2.5),
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flex: 1, // To ensure tabs are aligned properly
  },
  tab: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabStyle: {
    borderBottomColor: '#03A7A7',
    borderBottomWidth: 2,
  },
  selectedTabText: {
    color: '#03A7A7', // Color for the selected tab
  },
  availTxt: {
    color: '#03A7A7',
    fontWeight: 'bold',
    fontSize: wp(12), // Adjust font size as per screen size
    textAlign: 'center', // Ensures text is centered within the container
  },
  availContainer: {
    alignItems: 'center', // Centers horizontally
    justifyContent: 'center', // Centers vertically
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp('4%'),
    marginBottom: Platform.OS === 'ios' ? wp(2) : wp(3),
    marginTop: Platform.OS === 'ios' ? wp(2) : undefined,
  },
  locationContainer: {
    backgroundColor: '#ffffff',
    width: wp(48),
    paddingVertical: hp(1),
    borderRadius: 8,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: wp(1),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    backgroundColor: '#ffffff',
    padding: wp(2),
    borderRadius: 8,
    marginRight: wp(2),
  },
});

export default Dashboard;
