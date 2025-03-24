import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useDispatch} from 'react-redux';
import {setServiceProviderUuid} from '../../slice/Slice';

type Prop = RouteProp<RootStackParamList, 'MarketPlace'>;

// Define the type for our provider based on API response
interface BusinessProvider {
  service_provider_uuid: string;
  id: number;
  service_provider_name: string;
  logo: string;
  average_turnaround_time: string;
  // Adding some default fields since rating and price aren't in API response
  rating: number;
  price: string;
}

const MarketPlace: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {fromProduct} = route.params;
  const {theme} = useContext(ThemeContext);
  const [providers, setProviders] = useState<BusinessProvider[]>([]);
  const dispatch = useDispatch();

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await apiHelper({
          method: 'GET',
          endpoint: 'service-provider/',
        });

        // Map API response to our required format
        const mappedProviders = (response as {data: any[]}).data.map(
          (item: any) => ({
            service_provider_uuid: item.service_provider_uuid,
            id: item.id,
            service_provider_name: item.service_provider_name,
            logo: item.logo,
            average_turnaround_time: item.average_turnaround_time,
            // Since rating and price aren't in API response, adding default values
            rating: 4.0, // Default rating, modify as needed
            price: '$100', // Default price, modify as needed or fetch from another endpoint
          }),
        );

        setProviders(mappedProviders);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProviders();
  }, []);

  const handleAccept = (providerId: number) => {
    console.log(`Accepted provider with ID: ${providerId}`);
    navigation.navigate('Checkout');
  };

  const renderProviderItem = ({item}: {item: BusinessProvider}) => (
    <TouchableOpacity
      style={[styles.providerCard, {backgroundColor: theme.backgroundColor}]}
      onPress={() => {
        navigation.navigate('ShopProfile', {
          fromBid: fromProduct === true ? false : true,
        });
        dispatch(setServiceProviderUuid(item.service_provider_uuid));
      }}>
      <Image
        source={{uri: item.logo}}
        style={styles.providerImage}
        resizeMode="cover"
      />
      <View style={styles.providerInfo}>
        <Text style={[styles.providerName, {color: theme.text}]}>
          {item.service_provider_name}
        </Text>
        <Text style={[styles.deliveryDate, {color: theme.text}]}>
          Delivery Date: {item.average_turnaround_time}
        </Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="star"
              size={wp(4)}
              color={index < item.rating ? '#ffd700' : '#ddd'}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.price, {color: theme.input}]}>{item.price}</Text>
          {!fromProduct && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                handleAccept(item.id);
              }}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title={fromProduct ? 'MarketPlace' : 'Bids List'}
          onBackPress={() => navigation.goBack()}
        />

        <View style={styles.subtitleContainer}>
          <Icon name="store" size={wp(5)} color="#666" />
          <Text style={styles.subtitle}>
            Select Your Preferred business provider
          </Text>
        </View>

        <FlatList
          data={providers}
          renderItem={renderProviderItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  subtitle: {
    fontSize: wp(4),
    color: '#666',
    marginLeft: wp(2),
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(2),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  providerImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 10,
  },
  providerInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  providerName: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryDate: {
    fontSize: wp(3),
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: wp(3),
    color: '#666',
    marginLeft: wp(1),
  },
  price: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp(0.5),
  },
  acceptButton: {
    backgroundColor: '#00cec9',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  acceptButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default MarketPlace;
