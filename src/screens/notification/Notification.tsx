import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import {Icon} from 'react-native-elements';
import {apiHelper} from '../../services/api';
import {useDispatch, useSelector} from 'react-redux';
import {selectToken, setNotifyUuid} from '../../store/authSlice';

type NotificationItem = {
  id: string;
  message: string;
  icon: string;
  iconType: string;
  bgColor: string;
  data?: {
    quote_request_uuid: string;
    tag?: string;
  };
};

const Notification: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const token = useSelector(selectToken);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await apiHelper({
          method: 'GET',
          endpoint: 'notifications',
          token: token,
        });

        const {data} = response as {data: any[]};
        const fetchedNotifications: NotificationItem[] = data.map(
          notification => ({
            id: notification.id,
            message: notification.data.message,
            icon:
              notification.data.tag === 'AcceptBid'
                ? 'cart'
                : 'information-circle',
            iconType: 'ionicon',
            bgColor:
              notification.data.tag === 'AcceptBid' ? '#2ECC71' : '#3498DB',
            data: {
              quote_request_uuid: notification.data.data?.quote_request_uuid,
              tag: notification.data.tag,
            },
          }),
        );

        setNotifications(fetchedNotifications);
      } catch (error: any) {
        console.warn('Error fetching notifications:', error);
        setErrorMessage('Failed to load notifications. Please try again.');
      }
    };

    getNotifications();
  }, [token]);

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Notification" onBackPress={() => navigation.goBack()} />
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.data?.quote_request_uuid) {
                    dispatch(setNotifyUuid(item.data.quote_request_uuid));
                    navigation.navigate('AcceptBid');
                  } else {
                    console.warn(
                      'No quote_request_uuid found for notification',
                    );
                  }
                }}
                style={[
                  styles.notificationCard,
                  {backgroundColor: theme.backgroundColor},
                ]}>
                <View
                  style={[
                    styles.iconContainer,
                    {backgroundColor: item.bgColor},
                  ]}>
                  <Icon
                    name={item.icon}
                    type={item.iconType}
                    size={wp(5)}
                    color="white"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text
                    style={[styles.message, {color: theme.text}]}
                    numberOfLines={2}>
                    {item.message}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={[styles.errorText, {color: theme.text}]}>
                No notifications available.
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
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(4),
    }),
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
    alignItems: 'center',
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: wp(4),
    color: '#333',
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: wp(3),
    borderRadius: wp(2),
    marginVertical: hp(2),
    alignItems: 'center',
  },
  errorText: {
    color: '#FF3333',
    fontSize: wp(3.5),
    textAlign: 'center',
  },
});

export default Notification;
