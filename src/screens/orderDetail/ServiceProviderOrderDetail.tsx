import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useContext, useState, useEffect} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import {CheckCircle, Circle} from 'react-native-feather';
import {trackingSteps} from '../tracking/Tracking';
import ChatIcon from '../../assets/images/Chat.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';

const customerDetail = [
  {label: 'Customer Name', value: 'Chris'},
  {label: 'Email', value: 'xyz@gmail.com'},
  {label: 'Phone no.', value: '09876543212'},
  {label: 'Sipping Address', value: 'NewYork, USA'},
];
// Reverse mapping for API status to tracking step status
const reverseStatusMapping: {[key: string]: string} = {
  'Order Placed': 'Order is accepted.',
  Accepted: 'Order is accepted.',
  Pickup: 'Order is being Pickup.',
  OnTheWay: 'Order is on the way.',
  Delivered: 'Order will be delivered soon.',
};

const statuses = ['Processing', 'Pending', 'Completed', 'Declined'];

const ServiceProviderOrderDetail: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [selectedStatus, setSelectedStatus] = useState('Processing');
  const [trackingProgress, setTrackingProgress] = useState(
    trackingSteps.map(step => ({...step, completed: false})),
  );

  // Hardcoding order_id and orderUuid for now; in a real app, this would come from props or navigation params
  const orderId = '1';
  const orderUuid = 'b0290969-917e-4be7-87e9-420fb8d4aea6';

  // Map tracking steps to API statuses
  const statusMapping: {[key: string]: string} = {
    'Order is accepted.': 'Accepted',
    'Order is being Pickup.': 'Pickup',
    'Order is on the way.': 'OnTheWay',
    'Order will be delivered soon.': 'Delivered',
  };

  // Function to format the update_time
  const formatUpdateTime = (updateTime: string) => {
    const date = new Date(updateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }); // e.g., "Apr 10, 2025, 8:41 AM"
  };

  // Fetch tracking order on component mount
  useEffect(() => {
    const fetchTrackingOrder = async () => {
      try {
        const response = (await apiHelper({
          method: 'GET',
          endpoint: `order-tracking/order/${orderUuid}`,
        })) as {
          status: number;
          data: {
            order_tracking_uuid: string;
            order_id: number;
            status: string;
            update_time: string;
            details: string;
            created_at: string;
            updated_at: string;
          }[];
        };

        if (response.status === 1 && response.data) {
          const updatedProgress = [...trackingSteps].map(step => ({
            ...step,
            completed: false,
            time: step.time,
          }));

          response.data.forEach(tracking => {
            const stepStatus = reverseStatusMapping[tracking.status];
            if (stepStatus) {
              const stepIndex = updatedProgress.findIndex(
                step => step.status === stepStatus,
              );
              if (stepIndex !== -1) {
                updatedProgress[stepIndex].completed = true;
                updatedProgress[stepIndex].time = formatUpdateTime(
                  tracking.update_time,
                );

                // Update selectedStatus based on the latest tracking status
                if (
                  tracking.status === 'Order Placed' ||
                  tracking.status === 'Accepted'
                ) {
                  setSelectedStatus('Processing');
                } else if (
                  tracking.status === 'Pickup' ||
                  tracking.status === 'OnTheWay'
                ) {
                  setSelectedStatus('Pending');
                } else if (tracking.status === 'Delivered') {
                  setSelectedStatus('Completed');
                }
              }
            }
          });

          setTrackingProgress(updatedProgress);
        } else {
          console.error('Failed to fetch tracking order');
        }
      } catch (error) {
        console.error('Error fetching tracking order:', error);
        Alert.alert(
          'Error',
          'Failed to fetch tracking order. Please try again.',
        );
      }
    };

    fetchTrackingOrder();
  }, [orderUuid]);

  const updateOrderStatus = async (stepStatus: string, index: number) => {
    // Check if all previous steps are completed
    for (let i = 0; i < index; i++) {
      if (!trackingProgress[i].completed) {
        Alert.alert('Error', 'Please complete the previous steps first.');
        return;
      }
    }

    const apiStatus = statusMapping[stepStatus];
    if (!apiStatus) {
      console.error('No API status mapped for:', stepStatus);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('status', apiStatus);
      formData.append('order_id', orderId);
      formData.append('details', 'Updated via app');

      const response = (await apiHelper({
        method: 'POST',
        endpoint: 'order-tracking',
        data: formData,
      })) as {status: number; data: {update_time: string}; [key: string]: any};

      if (response.status === 1) {
        // Update the tracking progress
        const updatedProgress = [...trackingProgress];
        // Mark the clicked step and all previous steps as completed
        for (let i = 0; i <= index; i++) {
          updatedProgress[i].completed = true;
        }
        // Mark subsequent steps as not completed
        for (let i = index + 1; i < updatedProgress.length; i++) {
          updatedProgress[i].completed = false;
        }

        // Update the time for the current step with the API response's update_time
        if (response.data?.update_time) {
          updatedProgress[index].time = formatUpdateTime(
            response.data.update_time,
          );
        }

        // If the current step is "Order is being Pickup", automatically trigger "Order is on the way"
        if (
          stepStatus === 'Order is being Pickup.' &&
          index + 1 < updatedProgress.length
        ) {
          const nextStepStatus = updatedProgress[index + 1].status; // Should be "Order is on the way"
          const nextApiStatus = statusMapping[nextStepStatus];
          if (nextApiStatus) {
            const nextFormData = new FormData();
            nextFormData.append('status', nextApiStatus);
            nextFormData.append('order_id', orderId);
            nextFormData.append(
              'details',
              'Automatically updated after pickup',
            );

            const nextResponse = (await apiHelper({
              method: 'POST',
              endpoint: 'order-tracking',
              data: nextFormData,
            })) as {
              status: number;
              data: {update_time: string};
              [key: string]: any;
            };

            if (nextResponse.status === 1) {
              updatedProgress[index + 1].completed = true; // Mark "Order is on the way" as completed
              // Update the time for "Order is on the way" with the API response's update_time
              if (nextResponse.data?.update_time) {
                updatedProgress[index + 1].time = formatUpdateTime(
                  nextResponse.data.update_time,
                );
              }
            } else {
              console.error(
                'Failed to automatically update "Order is on the way"',
              );
            }
          }
        }

        setTrackingProgress(updatedProgress);

        // Update the selected status (for the Order Type buttons, if needed)
        if (apiStatus === 'Accepted') {
          setSelectedStatus('Processing');
        } else if (apiStatus === 'Pickup') {
          setSelectedStatus('Pending');
        } else if (apiStatus === 'OnTheWay') {
          setSelectedStatus('Pending');
        } else if (apiStatus === 'Delivered') {
          setSelectedStatus('Completed');
        }

        Alert.alert('Success', `Order status updated to ${apiStatus}`);
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      Alert.alert('Error', 'Failed to update order status. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <View style={styles.space}>
          <Header
            title="Order Detail"
            onBackPress={() => navigation.goBack()}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/** Order Overview */}
          <View style={styles.space}>
            <Text style={[styles.title, {color: theme.input}]}>
              Orders Overview
            </Text>
            <View
              style={[styles.cards, {backgroundColor: theme.backgroundColor}]}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/images/Orders.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.info}>
                <Text style={[styles.name, {color: theme.text}]}>
                  Aluminium Signage
                </Text>

                <View style={styles.ratingContainer}>
                  <Text style={[styles.rating, {color: theme.text}]}>
                    Yesterday at 8:00 PM
                  </Text>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity style={[styles.cartButton]}>
                    <Text style={styles.cartText}>{selectedStatus}</Text>
                  </TouchableOpacity>
                  <Text style={[styles.price, {color: theme.text}]}>$ 250</Text>
                </View>
              </View>
            </View>
          </View>

          {/** Customer Detail */}
          <View style={styles.space}>
            <Text style={[styles.title, {color: theme.input}]}>
              Customer Detail
            </Text>
            <View
              style={[styles.cards, {backgroundColor: theme.backgroundColor}]}>
              <View>
                {customerDetail.map((item, index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={[styles.specLabel, {color: theme.text}]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.specValue, {color: theme.input}]}>
                      {item.value}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.chats}
                  onPress={() => {
                    navigation.navigate('Message', {
                      chatId: '0',
                      chatName: 'Ali',
                    });
                  }}>
                  <ChatIcon />
                  <Text style={styles.chatText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/** Status */}
          <View style={styles.space}>
            <Text style={[styles.title, {color: theme.input}]}>Order Type</Text>
            <View style={styles.buttonContainer}>
              {statuses.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.button,
                    selectedStatus === status
                      ? styles.selectedButton
                      : {
                          backgroundColor: theme.backgroundColor,
                          borderColor: theme.text,
                        },
                  ]}
                  onPress={() => setSelectedStatus(status)}>
                  <Text
                    style={[
                      styles.buttonText,
                      selectedStatus === status
                        ? styles.selectedText
                        : {color: theme.text},
                    ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Card Section - Order Status */}
          <View style={[styles.card, {backgroundColor: theme.backgroundColor}]}>
            <Text style={[styles.title, {color: theme.input}]}>
              Order Status
            </Text>
            <View>
              {trackingProgress.map((item, index) => (
                <View key={item.id} style={styles.stepContainer}>
                  {/* Icon with background */}
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item.bgColor},
                    ]}>
                    {item.icon}
                  </View>

                  <View style={styles.stepTextContainer}>
                    <Text style={[styles.stepTitle, {color: theme.input}]}>
                      {item.status}
                    </Text>
                    <Text style={[styles.stepTime, {color: theme.text}]}>
                      {item.time}
                    </Text>
                  </View>

                  {/* Clickable Circle */}
                  <TouchableOpacity
                    onPress={() => updateOrderStatus(item.status, index)}
                    style={styles.circleContainer}>
                    {item.completed ? (
                      <CheckCircle color="green" width={20} height={20} />
                    ) : (
                      <Circle color="gray" width={20} height={20} />
                    )}
                  </TouchableOpacity>

                  {index !== trackingProgress.length - 1 && (
                    <View style={styles.progressLine} />
                  )}
                </View>
              ))}
            </View>
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
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  stepTime: {
    fontSize: wp(3),
    color: 'gray',
  },
  progressLine: {
    position: 'absolute',
    right: wp(3.7),
    top: Platform.OS === 'ios' ? wp(10) : wp(11.5),
    width: 2,
    height: Platform.OS === 'ios' ? hp(7.5) : hp(9),
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
  },
  iconContainer: {
    width: Platform.OS === 'ios' ? wp(15) : wp(18),
    height: Platform.OS === 'ios' ? wp(15) : wp(18),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  circleContainer: {
    padding: 5, // Add padding to make the clickable area larger
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
  cartButton: {
    paddingVertical: hp('0.5%'),
    width: wp('27%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#03A7A7',
  },
  cartText: {
    fontSize: Platform.OS === 'ios' ? wp('3%') : wp('3.5%'),
    fontWeight: '600',
    color: '#ffffff',
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
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
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
    marginBottom: wp(4),
  },
  button: {
    paddingVertical: wp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedButton: {
    backgroundColor: '#03A7A7',
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#333',
  },
  selectedText: {
    color: '#fff',
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
  chatText: {fontSize: wp(3.5), color: '#ffffff'},
});

export default ServiceProviderOrderDetail;
