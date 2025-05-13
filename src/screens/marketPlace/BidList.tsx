import React, {useContext, useEffect, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  RootStackParamList,
  ApiResponse,
  BusinessProvider,
  Bid,
} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectNotifyUuid,
  setQuoteUuid,
  setAcceptedBidDetails,
  setSourceType,
} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProviderCard from './ProviderCard';
import {styles} from '../../assets/styles/bidList/BidListStyles';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

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
        setError('No quote request selected');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: `quote-bids/quote-request/${uuid}`,
        });
        if (response.status === 1 && Array.isArray(response.data)) {
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
              product_id: bid.quote_request_id.product_id,
              quantity: bid.quote_request_id.quantity,
            }),
          );
          setQuoteData(providers);
        } else {
          setError('No bids found for this quote request');
        }
        setTimeout(() => setLoading(false), 3000);
      } catch (fetchError) {
        setError('Failed to load bids. Please try again.');
        setTimeout(() => setLoading(false), 3000);
      }
    };
    fetchQuote();
  }, [uuid]);

  const handleAccept = async (item: BusinessProvider) => {
    try {
      const response: ApiResponse = await apiHelper({
        method: 'POST',
        endpoint: `quote-bids/${item.quote_bid_uuid}/accept`,
      });
      if (response.status === 1) {
        navigation.navigate('Schedule');
        dispatch(setQuoteUuid(item.quote_bid_uuid));
        dispatch(
          setAcceptedBidDetails({
            product_id: item.product_id,
            quantity: item.quantity,
            bid_price: parseFloat(item.price.replace('$', '')),
            servicer_id: item.service_provider_id,
          }),
        );
        dispatch(setSourceType('quote'));
      } else {
        setError('Failed to accept bid. Please try again.');
      }
    } catch (acceptError) {
      setError('Failed to accept bid. Please try again.');
    }
  };

  const handleReject = async (quote_bid_uuid: string) => {
    try {
      const response: ApiResponse = await apiHelper({
        method: 'POST',
        endpoint: `quote-bids/${quote_bid_uuid}/reject`,
        data: {},
      });
      if (response.status === 1) {
        setQuoteData(prevData =>
          prevData.filter(item => item.quote_bid_uuid !== quote_bid_uuid),
        );
      } else {
        setError('Failed to reject bid. Please try again.');
      }
    } catch (rejectError) {
      setError('Failed to reject bid. Please try again.');
    }
  };

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
            renderItem={({item}) => (
              <ProviderCard
                item={item}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            )}
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

export default BidList;
