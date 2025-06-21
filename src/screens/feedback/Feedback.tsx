/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {
  API_BASE_URL,
  apiHelper,
} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import {useSelector} from 'react-redux';
import {selectToken} from '../../slice/Slice';
import * as Animatable from 'react-native-animatable'; // Import animatable

type FeedbackRouteProp = RouteProp<RootStackParamList, 'Feedback'>;

interface FeedbackItem {
  id: number;
  uuid: string;
  images: {
    id: number;
    file_url: string;
    file_name: string;
    file_type: string;
    type: string;
    size: number;
    created_at: string;
    updated_at: string;
  }[];
  order_id: number;
  note: string | null;
  status: string | null;
  feedback: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string;
}

const Feedback = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const route = useRoute<FeedbackRouteProp>();
  const order_id = route.params?.order_id;
  const [note, setNote] = useState<string>('');
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const token = useSelector(selectToken);

  // Fetch feedback data
  const fetchFeedback = useCallback(async () => {
    if (!order_id) {
      Alert.alert('Error', 'Order ID is missing.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}orders/order-proofs/${order_id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        },
      );

      const result = await response.json();

      if (response.status >= 200 && response.status < 300) {
        console.log('Feedback fetched successfully:', result);
        if (Array.isArray(result.data)) {
          setFeedbackData(result.data);
        } else {
          console.warn('Unexpected feedback data:', result.data);
          Alert.alert('Warning', 'Received invalid feedback data.');
        }
      } else {
        console.warn('Error fetching feedback:', result);
        Alert.alert('Error', result?.message || 'Failed to fetch feedback.');
      }
    } catch (error) {
      console.warn('Fetch feedback error:', error);
      Alert.alert(
        'Error',
        'Failed to fetch feedback. Please check your network.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [order_id, token]);

  // Fetch feedback on mount and when order_id/token changes
  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !note.trim()) {
      Alert.alert('Error', 'Please write feedback before rejecting.');
      return;
    }

    if (!order_id) {
      Alert.alert('Error', 'Order ID is missing. Please try again.');
      return;
    }

    if (feedbackData.length === 0) {
      Alert.alert('Error', 'No feedback available to approve or reject.');
      return;
    }

    const latestFeedback = feedbackData.reduce((latest, item) => {
      return new Date(item.created_at) > new Date(latest.created_at)
        ? item
        : latest;
    }, feedbackData[0]);
    const uuid = latestFeedback.uuid;

    try {
      setIsLoading(true);
      console.log(`Submitting ${action} action:`, {
        status: action === 'approve' ? 'approved' : 'rejected',
        feedback: action === 'reject' ? note : undefined,
        uuid,
      });
      const response = (await apiHelper({
        method: 'POST',
        endpoint: `orders/order-proofs/${uuid}?_method=patch`,
        data: {
          feedback: action === 'reject' ? note : undefined,
          status: action === 'approve' ? 'approved' : 'rejected',
        },
      })) as any;

      console.log(`${action} action submitted successfully:`, response);
      Alert.alert('Success', `Feedback ${action}d successfully!`);
      setNote('');
      await fetchFeedback(); // Refresh feedback list
    } catch (error) {
      console.warn(`Submit ${action} error:`, error);
      Alert.alert(
        'Error',
        `Failed to ${action} feedback. Please check your network.`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${month}/${day}/${year}, ${hours}:${formattedMinutes}${ampm}`;
  };

  const renderFeedbackItem = ({
    item,
    index,
  }: {
    item: FeedbackItem;
    index: number;
  }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={600}
      delay={index * 100} // Staggered animation
      style={styles.feedbackItem}>
      {item.note && (
        <View style={styles.customerFeedbackContainer}>
          <Text style={[styles.feedbackHeading, {color: theme.text}]}>
            From Provider
          </Text>
          <View style={[styles.feedbackBubble, styles.customerBubble]}>
            <Text style={[styles.feedbackText, {color: theme.header}]}>
              {item.note}
            </Text>
            {item.images.length > 0 && (
              <FlatList
                data={item.images}
                renderItem={({item: image}) => (
                  <Animatable.Image
                    animation="zoomIn"
                    duration={600}
                    source={{uri: image.file_url}}
                    style={styles.feedbackImage}
                    resizeMode="cover"
                  />
                )}
                keyExtractor={image => image.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.feedbackImageList}
              />
            )}
            <Text style={styles.timestamp}>
              {formatTimestamp(item.created_at)}
            </Text>
          </View>
        </View>
      )}
      {item.feedback && (
        <View style={styles.serviceProviderNoteContainer}>
          <View style={[styles.feedbackBubble, styles.providerBubble]}>
            <Text style={[styles.feedbackText, {color: theme.text}]}>
              {item.feedback}
            </Text>
            <Text style={[styles.timestamp, {color: '#999'}]}>
              {formatTimestamp(item.created_at)}
            </Text>
          </View>
        </View>
      )}
    </Animatable.View>
  );

  return (
    <View style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Header title="Feedback" onBackPress={() => navigation.goBack()} />
          {isLoading ? (
            <Animatable.Text
              animation="fadeIn"
              duration={800}
              style={{
                textAlign: 'center',
                color: theme.text,
                marginTop: hp(5),
              }}>
              Loading feedback...
            </Animatable.Text>
          ) : feedbackData.length === 0 ? (
            <Animatable.Text
              animation="fadeIn"
              duration={800}
              style={{
                textAlign: 'center',
                color: theme.text,
                marginTop: hp(5),
              }}>
              No feedback available
            </Animatable.Text>
          ) : (
            <FlatList
              data={feedbackData.sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime(),
              )}
              renderItem={renderFeedbackItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.feedbackList}
              showsVerticalScrollIndicator={true}
            />
          )}
          {/* Feedback Section */}
          <View style={[styles.createSection]}>
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={[styles.section]}>
              <TextInput
                style={[
                  styles.noteInput,
                  {color: theme.text, backgroundColor: theme.input},
                ]}
                placeholder="Write feedback (required for reject)"
                placeholderTextColor="#999"
                multiline
                value={note}
                onChangeText={setNote}
              />
            </Animatable.View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleAction('approve')}
                disabled={isLoading}>
                <Animatable.View animation="bounceIn" duration={600}>
                  <Text style={styles.whiteButtonText}>Approve</Text>
                </Animatable.View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleAction('reject')}
                disabled={isLoading}>
                <Animatable.View
                  animation="bounceIn"
                  duration={600}
                  delay={200}>
                  <Text style={[styles.buttonText, {color: theme.text}]}>
                    Reject
                  </Text>
                </Animatable.View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#333',
  },
  container: {
    flex: 1,
    paddingHorizontal: hp(2),
    paddingVertical: hp(2),
  },
  feedbackList: {
    paddingBottom: hp(25),
    paddingTop: hp(2),
    flexGrow: 1,
  },
  feedbackItem: {
    marginVertical: hp(1),
  },
  customerFeedbackContainer: {
    alignItems: 'flex-start',
    paddingRight: wp(10),
  },
  serviceProviderContainer: {
    alignItems: 'flex-end',
    paddingLeft: wp(10),
    marginVertical: hp(2),
  },
  feedbackHeading: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginBottom: hp(0.5),
    color: '#999',
  },
  feedbackBubble: {
    maxWidth: wp(70),
    padding: wp(3),
  },
  customerBubble: {
    backgroundColor: '#444',
    borderTopRightRadius: wp(4),
    borderBottomRightRadius: wp(20),
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: wp(4),
  },
  providerBubble: {
    backgroundColor: '#00C4B4',
    borderTopLeftRadius: wp(4),
    borderBottomLeftRadius: wp(4),
    borderTopRightRadius: 0,
    borderBottomRightRadius: wp(4),
  },
  feedbackText: {
    fontSize: wp(4),
    lineHeight: wp(5),
  },
  timestamp: {
    fontSize: wp(3),
    color: '#666',
    marginTop: hp(0.5),
    textAlign: 'right',
  },
  feedbackImageList: {
    marginTop: hp(1),
    marginBottom: hp(1),
    maxHeight: hp(10),
  },
  feedbackImage: {
    width: wp(20),
    height: hp(10),
    marginRight: wp(2),
    borderRadius: wp(2),
  },
  createSection: {
    position: 'absolute',
    bottom: wp(8),
    left: wp(4),
    right: wp(4),
  },
  section: {
    marginBottom: hp(2),
  },
  noteInput: {
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#666',
    padding: wp(3),
    fontSize: wp(4),
    minHeight: hp(10),
    textAlignVertical: 'top',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(3),
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#00C4B4',
  },
  rejectButton: {
    backgroundColor: '#fff',
    borderColor: '#00C4B4',
    borderWidth: 2,
  },
  whiteButtonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '600',
  },
  buttonText: {
    fontSize: wp(4.5),
    fontWeight: '600',
  },
  serviceProviderNoteContainer: {
    alignItems: 'flex-end',
    marginLeft: wp(10),
    marginVertical: hp(1),
  },
});

export default Feedback;
