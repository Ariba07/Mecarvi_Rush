import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
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
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {selectNotifyUuid} from '../../slice/Slice';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

const ServiceProviderOrderDecision = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [price, setPrice] = useState<string>(''); // State for price input
  const [loading, setLoading] = useState<boolean>(true); // State for loading indicator
  const [quoteData, setQuoteData] = useState<any>(null); // State for API data
  const [customerData, setCustomerData] = useState<any[]>([]); // State for customer details
  const uuid = useSelector(selectNotifyUuid);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!uuid) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response: ApiResponse = await apiHelper({
          method: 'GET',
          endpoint: `quote-requests/${uuid}`,
        });

        if (response.status === 1) {
          setQuoteData(response.data);

          // Mock customer data since the API doesn't provide it
          // In a real scenario, you might need to make another API call to get customer details
          const mockCustomerData = [
            {label: 'Customer Name', value: 'Chris'},
            {label: 'Email', value: 'xyz@gmail.com'},
            {label: 'Phone no.', value: '09876543212'},
            {label: 'Shipping Address', value: 'NewYork, USA'},
          ];
          setCustomerData(mockCustomerData);
        }

        // Ensure loading indicator shows for at least 3 seconds
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (error) {
        console.warn('Error fetching product:', error);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    };
    fetchQuote();
  }, [uuid]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.input} />
          <Text style={[styles.loadingText, {color: theme.text}]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const createBid = async () => {
    try {
      await apiHelper({
        method: 'POST',
        endpoint: 'quote-bids',
        data: {bid_price: price, quote_request_uuid: uuid},
      });
      Alert.alert('Bid Created');
    } catch (error) {
      console.warn('Error creating Bid:', error);
    }
  };

  if (!quoteData) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <View style={styles.container}>
          <View style={styles.space}>
            <Header title="Quote" onBackPress={() => navigation.goBack()} />
          </View>
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, {color: theme.text}]}>
              Failed to load quote data
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <View style={styles.space}>
          <Header title="Quote" onBackPress={() => navigation.goBack()} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/**Order Overview */}
          <View style={styles.space}>
            <Text style={[styles.title, {color: theme.input}]}>
              Orders Overview
            </Text>
            <View
              style={[styles.cards, {backgroundColor: theme.backgroundColor}]}>
              <View style={styles.imageContainer}>
                <Image
                  source={{uri: quoteData.front_image}}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.info}>
                <Text style={[styles.name, {color: theme.text}]}>
                  Quote Request #{quoteData.id}
                </Text>

                <View style={styles.ratingContainer}>
                  <Text style={[styles.rating, {color: theme.text}]}>
                    {new Date(quoteData.created_at).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/**Customer Detail */}
          <View style={styles.space}>
            <Text style={[styles.title, {color: theme.input}]}>
              Customer Detail
            </Text>
            <View
              style={[styles.cards, {backgroundColor: theme.backgroundColor}]}>
              <View>
                {customerData.map((item, index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={[styles.specLabel, {color: theme.text}]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.specValue, {color: theme.input}]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
                {/* <TouchableOpacity
                  style={styles.chats}
                  onPress={() => {
                    navigation.navigate('Message', {
                      chatId: '0',
                      chatName: 'Ali',
                    });
                  }}>
                  <ChatIcon />
                  <Text style={styles.chatText}>Chat</Text>
                </TouchableOpacity> */}
              </View>
            </View>
          </View>

          {/**Quote Details */}
          <View style={styles.space}>
            <Text style={[styles.title, {color: theme.input}]}>
              Quote Details
            </Text>
            <View
              style={[styles.cards, {backgroundColor: theme.backgroundColor}]}>
              <View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, {color: theme.text}]}>
                    Quantity
                  </Text>
                  <Text style={[styles.specValue, {color: theme.input}]}>
                    {quoteData.quantity}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={[styles.specLabel, {color: theme.text}]}>
                    Note
                  </Text>
                  <Text style={[styles.specValue, {color: theme.input}]}>
                    {quoteData.note || 'N/A'}
                  </Text>
                </View>
                {quoteData.details &&
                  Object.entries(quoteData.details).map(
                    ([key, value], index) => (
                      <View key={index} style={styles.specRow}>
                        <Text style={[styles.specLabel, {color: theme.text}]}>
                          {key}
                        </Text>
                        <Text style={[styles.specValue, {color: theme.input}]}>
                          {value as string}
                        </Text>
                      </View>
                    ),
                  )}
              </View>
            </View>
          </View>

          <View style={[styles.space, {marginVertical: wp(3)}]}>
            <Text style={[styles.label, {color: theme.text}]}>
              Add Your Price
            </Text>
            <TextInput
              style={[styles.input, {color: theme.input}]}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder="Enter Price"
              placeholderTextColor={'#999'}
            />
          </View>

          {/* <View style={[styles.space, {marginVertical: wp(3)}]}>
            <Text style={[styles.label, {color: theme.text}]}>
              Add Delivery Date
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.inputWithIcon, {color: theme.input}]}
                value={deliveryDate}
                onChangeText={setDeliveryDate}
                placeholder="Enter Date"
                placeholderTextColor={'#999'}
              />
              <Icon name="calendar-today" size={20} color="#666" />
            </View>
          </View> */}

          {/* Accept and Reject Buttons */}
          <View style={[styles.space, styles.buttonRow]}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                createBid();
              }}>
              <Text style={styles.acceptButtonText}>Create Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rejectButton, {borderColor: theme.text}]}
              onPress={() => {
                navigation.replace('BottomTabs');
              }}>
              <Text style={[styles.rejectButtonText, {color: theme.text}]}>
                Reject
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: wp(4),
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: wp(4),
    color: '#333',
  },
  space: {
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: hp(2.5),
    borderTopRightRadius: hp(2.5),
    padding: wp(5),
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    height: hp(5.5),
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
    marginVertical: hp(1),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    marginVertical: hp(1),
    paddingRight: hp(2),
  },
  inputWithIcon: {
    flex: 1,
    height: hp(5.5),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
  },
  iconContainer: {
    paddingHorizontal: wp(2),
  },
  cards: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: wp('2%'),
    borderRadius: wp('4%'),
    marginBottom: hp('1%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: wp('2%'),
  },
  info: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  name: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: wp('3%'),
    color: '#333333',
    marginTop: hp('0.5%'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: wp(1),
  },
  specLabel: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#9c9c9c',
    width: '50%',
  },
  specValue: {
    fontSize: wp(3.5),
    color: '#333333',
    width: '50%',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  chats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: wp(1),
    borderRadius: wp(2),
    backgroundColor: '#03A7A7',
    alignSelf: 'flex-end',
    width: wp(22),
    marginVertical: wp(1.5),
  },
  chatText: {
    fontSize: wp(3.5),
    color: '#ffffff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: wp(3),
  },
  acceptButton: {
    backgroundColor: '#03A7A7',
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    flex: 1,
    marginRight: wp(2),
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  rejectButton: {
    borderWidth: 1.5,
    borderColor: '#333',
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    flex: 1,
    marginLeft: wp(2),
    alignItems: 'center',
  },
  rejectButtonText: {
    color: '#333',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
});

export default ServiceProviderOrderDecision;
