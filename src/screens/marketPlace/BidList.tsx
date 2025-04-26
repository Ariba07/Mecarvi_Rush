import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ApiResponse,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectNotifyUuid,
  setServiceProviderUuid,
  setAcceptedBidDetails,
  setSourceType,
  setQuoteUuid,
} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

// Define the type for the bid based on the API response
interface Bid {
  id: number;
  quote_bid_uuid: string;
  service_provider_id: number;
  bid_price: string;
  status: string;
  created_at: string;
  updated_at: string;
  service_provider: {
    service_provider_id: number;
    service_provider_name: string;
    service_provider_logo: string;
  };
  quote_request_id: {
    id: number;
    quote_request_uuid: string;
    user_id: number;
    product_id: number;
    quantity: number;
    note: string | null;
    details: {[key: string]: string};
    front_image: string;
    back_image: string;
    created_at: string;
    updated_at: string;
  };
}

// Define the type for rendering in FlatList
interface BusinessProvider {
  id: number;
  quote_bid_uuid: string;
  service_provider_id: number;
  service_provider_uuid?: string;
  service_provider_user_uuid?: string;
  service_provider_name: string;
  logo: string;
  address?: string;
  price: string;
  product_id: number; // Added for dispatching
  quantity: number; // Added for dispatching
}

const BidList: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const dispatch = useDispatch();
  const uuid = useSelector(selectNotifyUuid);
  const [quoteData, setQuoteData] = useState<BusinessProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!uuid) {
        console.warn('No UUID provided for fetching quote bids');
        setError('No quote request selected');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch quote bids
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: `quote-bids/quote-request/${uuid}`,
        });

        if (response.status === 1 && Array.isArray(response.data)) {
          // Map bids to BusinessProvider format
          const providers: BusinessProvider[] = response.data.map(
            (bid: Bid) => ({
              id: bid.id,
              quote_bid_uuid: bid.quote_bid_uuid,
              service_provider_id: bid.service_provider_id,
              service_provider_uuid: undefined,
              service_provider_user_uuid: undefined,
              service_provider_name: bid.service_provider.service_provider_name,
              logo:
                bid.service_provider.service_provider_logo ||
                'https://via.placeholder.com/150',
              address: undefined,
              price: `$${bid.bid_price}`,
              product_id: bid.quote_request_id.product_id, // Store product_id
              quantity: bid.quote_request_id.quantity, // Store quantity
            }),
          );

          setQuoteData(providers);
          console.log('Fetched and mapped providers:', providers);
        } else {
          setError('No bids found for this quote request');
        }

        // Ensure loading indicator shows for at least 3 seconds
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (fetchError) {
        console.warn('Error fetching quote bids:', fetchError);
        setError('Failed to load bids. Please try again.');
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };

    fetchQuote();
  }, [uuid]);

  const handleAccept = async (item: BusinessProvider) => {
    try {
      console.log(`Accepting bid with UUID: ${item.quote_bid_uuid}`);
      const response: ApiResponse = await apiHelper({
        method: 'POST',
        endpoint: `quote-bids/${item.quote_bid_uuid}/accept`,
      });

      if (response.status === 1) {
        console.log('Bid accepted successfully:', response);
        navigation.navigate('Schedule');

        // Dispatch product_id, quantity, and bid_price
        dispatch(setQuoteUuid(item.quote_bid_uuid));
        dispatch(
          setAcceptedBidDetails({
            product_id: item.product_id,
            quantity: item.quantity,
            bid_price: parseFloat(item.price.replace('$', '')),
            servicer_id: item.service_provider_id,
          }),
          dispatch(setSourceType('quote')),
        );
      } else {
        console.warn('Failed to accept bid:', response);
        setError('Failed to accept bid. Please try again.');
      }
    } catch (acceptError) {
      console.warn('Error accepting bid:', acceptError);
      setError('Failed to accept bid. Please try again.');
    }
  };

  const handleReject = async (quote_bid_uuid: string) => {
    try {
      console.log(`Rejecting bid with UUID: ${quote_bid_uuid}`);
      const response: ApiResponse = await apiHelper({
        method: 'POST',
        endpoint: `quote-bids/${quote_bid_uuid}/reject`,
        data: {},
      });

      if (response.status === 1) {
        console.log('Bid rejected successfully:', response);
        // Remove the rejected bid from quoteData
        setQuoteData(prevData =>
          prevData.filter(item => item.quote_bid_uuid !== quote_bid_uuid),
        );
      } else {
        console.warn('Failed to reject bid:', response);
        setError('Failed to reject bid. Please try again.');
      }
    } catch (rejectError) {
      console.warn('Error rejecting bid:', rejectError);
      setError('Failed to reject bid. Please try again.');
    }
  };

  const renderProviderItem = ({item}: {item: BusinessProvider}) => (
    <View
      style={[styles.providerCard, {backgroundColor: theme.backgroundColor}]}>
      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => handleReject(item.quote_bid_uuid)}>
        <Icon name="close" size={wp(5)} color={theme.input} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.providerContent}
        onPress={() => {
          console.warn(
            'Cannot navigate to ShopProfile: service_provider_user_uuid is undefined',
          );
          dispatch(
            setServiceProviderUuid(
              item.service_provider_uuid || item.quote_bid_uuid,
            ),
          );
          console.log('Selected bid UUID:', item.quote_bid_uuid);
        }}>
        <Image
          source={{uri: item.logo}}
          style={styles.providerImage}
          resizeMode="cover"
          onError={() =>
            console.warn(
              `Failed to load image for ${item.service_provider_name}`,
            )
          }
        />
        <View style={styles.providerInfo}>
          <Text style={[styles.providerName, {color: theme.text}]}>
            {item.service_provider_name}
          </Text>
          <Text style={[styles.address, {color: theme.text}]}>
            Address: {item.address || 'N/A'}
          </Text>
          <View style={styles.row}>
            <Text style={[styles.price, {color: theme.input}]}>
              {item.price}
            </Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(item)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Bids List" onBackPress={() => navigation.goBack()} />

        <View style={styles.subtitleContainer}>
          <Icon name="store" size={wp(5)} color="#666" />
          <Text style={styles.subtitle}>
            Select Your Preferred Business Provider
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.input} />
            <Text style={[styles.loadingText, {color: theme.text}]}>
              Loading bids...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, {color: theme.text}]}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={quoteData}
            renderItem={renderProviderItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={[styles.emptyText, {color: theme.text}]}>
                No providers found
              </Text>
            }
          />
        )}
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
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(2),
    marginBottom: hp(2),
    position: 'relative',
  },
  providerContent: {
    flexDirection: 'row',
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
  address: {
    fontSize: wp(3),
    color: '#666',
    marginTop: hp(0.5),
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
  rejectButton: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
  },
  emptyText: {
    fontSize: wp(4),
    color: '#666',
    textAlign: 'center',
    marginTop: hp(5),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: wp(4),
    color: '#666',
    marginTop: hp(2),
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: wp(4),
    color: '#FF3333',
    textAlign: 'center',
  },
});

export default BidList;
