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
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ApiResponse,
  RootStackParamList,
} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import * as Animatable from 'react-native-animatable';
import CustomModal from '../../components/common/errorModal/CustomModal';

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

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

const Feedback = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const route = useRoute<FeedbackRouteProp>();
  const order_id = route.params?.order_id;
  const [note, setNote] = useState<string>('');
  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');

  const fetchFeedback = useCallback(async (): Promise<ActionResult> => {
    if (!order_id) {
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Order ID is missing.',
        },
      };
    }

    setIsLoading(true);
    try {
      const response = (await apiHelper<ApiResponse>({
        method: 'GET',
        endpoint: `orders/order-proofs/${order_id}`,
      })) as any;
      console.log('Feedback fetched successfully:', response);
      setFeedbackData(response.data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log('Fetch feedback error:', error);
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to fetch feedback. Please check your network.',
        },
      };
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [order_id]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchFeedback();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  }, [fetchFeedback]);

  useEffect(() => {
    const loadFeedback = async () => {
      const result = await fetchFeedback();
      if (!result.success && result.error) {
        setModalTitle(result.error.title);
        setModalMessage(result.error.message);
        setModalVisible(true);
      }
    };
    loadFeedback();
  }, [fetchFeedback]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (isSubmitting) {return;} // Prevent multiple submissions
    if (action === 'reject' && !note.trim()) {
      setModalTitle('Error');
      setModalMessage('Please write feedback before rejecting.');
      setModalVisible(true);
      return;
    }

    if (!order_id) {
      setModalTitle('Error');
      setModalMessage('Order ID is missing. Please try again.');
      setModalVisible(true);
      return;
    }

    if (feedbackData.length === 0) {
      setModalTitle('Error');
      setModalMessage('No feedback available to approve or reject.');
      setModalVisible(true);
      return;
    }

    const latestFeedback = feedbackData.reduce((latest, item) => {
      return new Date(item.created_at) > new Date(latest.created_at)
        ? item
        : latest;
    }, feedbackData[0]);
    const uuid = latestFeedback.uuid;

    try {
      setIsSubmitting(true);
      console.log(`Submitting ${action} action:`, {
        status: action === 'approve' ? 'approved' : 'rejected',
        feedback: action === 'reject' ? note : undefined,
        uuid,
      });
      await apiHelper({
        method: 'POST',
        endpoint: `orders/order-proofs/${uuid}?_method=patch`,
        data: {
          feedback: action === 'reject' ? note : undefined,
          status: action === 'approve' ? 'approved' : 'rejected',
        },
      });

      setModalTitle('Success');
      setModalMessage(`Feedback ${action}d successfully!`);
      setModalVisible(true);
      setNote('');
      navigation.goBack();
    } catch (error) {
      console.warn(`Submit ${action} error:`, error);
      setModalTitle('Error');
      setModalMessage(
        `Failed to ${action} feedback. Please check your network.`,
      );
      setModalVisible(true);
    } finally {
      setIsSubmitting(false);
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
      delay={index * 100}
      style={[styles.feedbackItem]}>
      {item.note && (
        <View style={styles.customerFeedbackContainer}>
          <Text style={[styles.feedbackHeading, {color: theme.text}]}>
            From Provider
          </Text>
          <View
            style={[
              styles.feedbackBubble,
              styles.customerBubble,
              {backgroundColor: theme.button},
            ]}>
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
            <Text style={[styles.timestamp, {color: theme.text}]}>
              {formatTimestamp(item.created_at)}
            </Text>
          </View>
        </View>
      )}
      {item.feedback && (
        <View style={styles.serviceProviderNoteContainer}>
          <View
            style={[
              styles.feedbackBubble,
              styles.providerBubble,
              {backgroundColor: theme.button},
            ]}>
            <Text style={[styles.feedbackText, {color: theme.header}]}>
              {item.feedback}
            </Text>
            <Text style={[styles.timestamp, {color: theme.text}]}>
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
              animation="pulse"
              easing="ease-out"
              iterationCount="infinite"
              style={[styles.loadingText, {color: theme.text}]}>
              Loading feedback...
            </Animatable.Text>
          ) : feedbackData.length === 0 ? (
            <Animatable.Text
              animation="fadeIn"
              duration={800}
              style={[styles.noFeedbackText, {color: theme.text}]}>
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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[theme.status || '#00C4B4']}
                  tintColor={theme.status || '#00C4B4'}
                  title="Pull to refresh"
                />
              }
            />
          )}
          <View style={[styles.createSection, {backgroundColor: theme.bottom}]}>
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              style={styles.section}>
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    color: theme.text,
                    backgroundColor: theme.button,
                    borderColor: theme.text,
                  },
                ]}
                placeholder="Write feedback (required for reject)"
                placeholderTextColor={theme.text + '80'}
                multiline
                value={note}
                onChangeText={setNote}
                editable={!isSubmitting}
              />
            </Animatable.View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.approveButton,
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={() => handleAction('approve')}
                disabled={isSubmitting}>
                <Animatable.View animation="bounceIn" duration={600}>
                  <Text style={styles.whiteButtonText}>Approve</Text>
                </Animatable.View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.rejectButton,
                  {borderColor: theme.text},
                  isSubmitting && styles.buttonDisabled,
                ]}
                onPress={() => handleAction('reject')}
                disabled={isSubmitting}>
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
          <CustomModal
            visible={modalVisible}
            title={modalTitle}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
  },
  feedbackList: {
    paddingBottom: hp(30),
    paddingTop: hp(2),
    flexGrow: 1,
  },
  feedbackItem: {
    marginVertical: hp(1.5),
    borderRadius: wp(3),
  },
  customerFeedbackContainer: {
    alignItems: 'flex-start',
    paddingRight: wp(10),
  },
  serviceProviderNoteContainer: {
    alignItems: 'flex-end',
    marginLeft: wp(10),
    marginVertical: hp(1.5),
  },
  feedbackHeading: {
    fontSize: wp(4.5),
    fontWeight: '600',
    marginBottom: hp(1),
    opacity: 0.8,
  },
  feedbackBubble: {
    maxWidth: wp(75),
    padding: wp(4),
    borderRadius: wp(4),
  },
  customerBubble: {
    borderTopRightRadius: wp(5),
    borderBottomRightRadius: wp(5),
    borderTopLeftRadius: wp(1),
    borderBottomLeftRadius: wp(5),
  },
  providerBubble: {
    borderTopLeftRadius: wp(5),
    borderBottomLeftRadius: wp(5),
    borderTopRightRadius: wp(1),
    borderBottomRightRadius: wp(5),
  },
  feedbackText: {
    fontSize: wp(4.2),
    lineHeight: wp(6),
    fontWeight: '400',
  },
  timestamp: {
    fontSize: wp(3.5),
    marginTop: hp(1),
    textAlign: 'right',
    opacity: 0.6,
  },
  feedbackImageList: {
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
    maxHeight: hp(15),
  },
  feedbackImage: {
    width: wp(25),
    height: hp(15),
    marginRight: wp(2.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#00000020',
  },
  createSection: {
    position: 'absolute',
    bottom: wp(6),
    left: wp(4),
    right: wp(4),
    borderRadius: wp(3),
    padding: wp(4),
  },
  section: {
    marginBottom: hp(2),
  },
  noteInput: {
    borderRadius: wp(3),
    borderWidth: 1,
    padding: wp(4),
    fontSize: wp(4.2),
    minHeight: hp(12),
    textAlignVertical: 'top',
    backgroundColor: '#ffffff10',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: wp(4),
  },
  actionButton: {
    flex: 1,
    paddingVertical: hp(2),
    borderRadius: wp(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: '#00C4B4',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  whiteButtonText: {
    color: '#fff',
    fontSize: wp(4.8),
    fontWeight: '700',
  },
  buttonText: {
    fontSize: wp(4.8),
    fontWeight: '700',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: wp(4.5),
    marginTop: hp(10),
    fontWeight: '500',
  },
  noFeedbackText: {
    textAlign: 'center',
    fontSize: wp(4.5),
    marginTop: hp(10),
    fontWeight: '500',
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
});

export default Feedback;
