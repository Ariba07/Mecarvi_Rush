import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Platform,
  ScrollView,
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
import CustomButton from '../../components/common/buttons/CustomButton';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {
  selectServiceProviderUuid,
  selectUserUuidId,
  selectRole,
  selectUserName,
  setDispatchId,
} from '../../slice/Slice';
import {useDispatch, useSelector} from 'react-redux';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@react-native-firebase/firestore';
import {db} from '../../../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Prop = RouteProp<RootStackParamList, 'ShopProfile'>;

interface ProfileData {
  id: number;
  name: string;
  location: string;
  profileImageUrl: string;
}

interface PreviousWorkItem {
  id: string;
  title: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: string;
  rating: number;
}

const STORAGE_KEY = '@login_credentials';

const ShopProfile: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {fromBid, providerId} = route.params;
  const {theme} = useContext(ThemeContext);
  const serviceProviderUuid = useSelector(selectServiceProviderUuid);
  const reduxUserUuid = useSelector(selectUserUuidId);
  const role = useSelector(selectRole);
  const username = useSelector(selectUserName);
  const [currentUserUuid, setCurrentUserUuid] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [previousWork, setPreviousWork] = useState<PreviousWorkItem[]>([]);
  const [offeredServices, setOfferedServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {user_uuid: storedId, name} = JSON.parse(savedCredentials);
          if (storedId) {
            setCurrentUserUuid(storedId);
            console.log('Fetched user_uuid from AsyncStorage:', storedId);
            setCurrentUserName(name || null);
            console.log('Fetched name from AsyncStorage:', name);
          } else {
            setCurrentUserUuid(reduxUserUuid);
            setCurrentUserName(username || null);
            console.log('Fetched name from redux:', username);
            console.log('Using reduxUserUuid (no storedId):', reduxUserUuid);
          }
        } else {
          setCurrentUserUuid(reduxUserUuid);
          setCurrentUserName(username || null);
          console.log('Fetched name from redux:', username);
          console.log('Using reduxUserUuid (no storedId):', reduxUserUuid);
        }
      } catch (error: any) {
        console.error('Detailed AsyncStorage Error:', {
          message: error.message || 'Failed to fetch role from AsyncStorage',
          stack: error.stack,
          code: 'async-storage/fetch-error',
          response: 'No response data',
          firestoreError: 'Not a Firestore error',
          timestamp: new Date().toISOString(),
        });
        setCurrentUserUuid(reduxUserUuid);
        setCurrentUserName(username || null);
        setErrorMessage('Unable to load user data. Using fallback.');
      }
    };

    fetchRoleFromStorage();
  }, [reduxUserUuid, role, currentUserName, username]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiHelper({
          method: 'GET',
          endpoint: `service-provider/${serviceProviderUuid}`,
        });

        const apiData = (response as {data: any}).data;

        setProfile({
          id: apiData.id,
          name: apiData.service_provider_name,
          location: apiData.address,
          profileImageUrl: apiData.logo,
        });

        setPreviousWork([
          {
            id: '1',
            title: 'Portfolio Project',
          },
        ]);

        setOfferedServices(
          apiData.services_offered.map((serviceId: string, index: number) => ({
            id: `${index}`,
            name: `Service ${serviceId.slice(-4)}`,
            price: '$150',
            rating: 4.5,
          })),
        );
      } catch (error: any) {
        console.error('Detailed Profile Fetch Error:', {
          message: error.message || 'Failed to fetch profile',
          stack: error.stack,
          code: 'api/fetch-profile-error',
          response: 'No response data',
          firestoreError: 'Not a Firestore error',
          timestamp: new Date().toISOString(),
        });
        setErrorMessage('Unable to load profile. Please try again.');
      }
    };

    if (serviceProviderUuid) {
      fetchProfile();
    } else {
      console.warn('No serviceProviderUuid or providerId available yet');
      setErrorMessage('Service provider not found.');
    }
  }, [currentUserUuid, serviceProviderUuid]);

  const handleChat = async () => {
    try {
      if (!currentUserUuid || !providerId) {
        const error = new Error('Missing UUIDs');
        console.error('Detailed Chat Error:', {
          message: error.message,
          stack: error.stack,
          code: 'app/missing-uuids',
          response: 'No response data',
          firestoreError: 'Not a Firestore error',
          timestamp: new Date().toISOString(),
          details: {currentUserUuid, providerId},
        });
        setErrorMessage('Unable to start chat. Please log in.');
        return;
      }

      if (!currentUserName || !profile?.name) {
        const error = new Error('Missing participant names');
        console.error('Detailed Chat Error:', {
          message: error.message,
          stack: error.stack,
          code: 'app/missing-names',
          response: 'No response data',
          firestoreError: 'Not a Firestore error',
          timestamp: new Date().toISOString(),
          details: {currentUserName, serviceProviderName: profile?.name},
        });
        setErrorMessage('Unable to start chat. User or provider name missing.');
        return;
      }

      console.log(
        'Handling chat - Current User UUID:',
        currentUserUuid,
        'Name:',
        currentUserName,
      );
      console.log(
        'Handling chat - Service Provider UUID:',
        providerId,
        'Name:',
        profile.name,
      );

      if (!db || typeof db.collection !== 'function') {
        throw new Error('Firestore instance is invalid or not initialized');
      }

      const chatId = `${providerId}_${currentUserUuid}`;
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('chatId', '==', chatId),
        where('participants', 'array-contains', currentUserUuid),
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        console.log('Existing chat found:', existingChat.id);
        navigation.navigate('Message', {
          chatId: existingChat.id,
          chatName: profile.name,
          participantNames: existingChat.data().participantNames || {
            [currentUserUuid]: currentUserName,
            [providerId]: profile.name,
          },
        });
      } else {
        const participantNames = {
          [currentUserUuid]: currentUserName,
          [providerId]: profile.name,
        };
        const newChatRef = await addDoc(chatsRef, {
          chatId: chatId,
          name: `Chat with ${profile.name}`,
          participants: [currentUserUuid, providerId],
          participantNames,
          createdAt: new Date(),
        });
        console.log('New chat created:', newChatRef.id);
        navigation.navigate('Message', {
          chatId: newChatRef.id,
          chatName: profile.name,
          participantNames,
        });
      }
    } catch (error: any) {
      console.error('Detailed Chat Error:', {
        message: error.message || 'Failed to initiate chat',
        stack: error.stack,
        code: error.code || 'firestore/chat-error',
        response: 'No response data',
        firestoreError: {
          code: error.code,
          message: error.message,
        },
        timestamp: new Date().toISOString(),
      });
      setErrorMessage(getUserFriendlyMessage(error));
    }
  };

  const getUserFriendlyMessage = (error: any): string => {
    switch (error.code) {
      case 'app/missing-uuids':
        return 'Missing required information. Please try again.';
      case 'app/missing-names':
        return 'User or provider name missing. Please try again.';
      case 'firestore/chat-error':
        return 'Unable to initiate chat. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  const handleBookService = () => {
    navigation.navigate('Booking');
  };
  const handleOrderService = () => {
    navigation.navigate('Cart');
    dispatch(setDispatchId(profile?.id ?? 0));
  };

  const renderPreviousWorkItem = ({item}: {item: PreviousWorkItem}) => (
    <View style={styles.previousWorkCard}>
      <Text style={[styles.previousWorkText, {color: theme.text}]}>
        {item.title}
      </Text>
    </View>
  );

  const renderServiceItem = ({item}: {item: ServiceItem}) => (
    <View
      style={[styles.serviceCard, {backgroundColor: theme.backgroundColor}]}>
      <Text style={[styles.serviceName, {color: theme.text}]}>{item.name}</Text>
      <View style={styles.serviceInfo}>
        <Text style={styles.servicePrice}>{item.price}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="star"
              size={wp(3.5)}
              color={index < item.rating ? '#ffd700' : '#ddd'}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );

  if (!profile) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <Text style={[styles.loadingText, {color: theme.text}]}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Business Profile"
          onBackPress={() => navigation.goBack()}
        />
        {errorMessage && (
          <Text style={[styles.errorText, {color: theme.text}]}>
            {errorMessage}
          </Text>
        )}
        <ScrollView
          contentContainerStyle={{paddingBottom: wp(16)}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={[styles.profileImageText, {color: theme.text}]}>
                {profile.name[0]}
              </Text>
            </View>
            <Text style={[styles.profileName, {color: theme.text}]}>
              {profile.name}
            </Text>
            <Text style={styles.profileLocation}>{profile.location}</Text>
            <TouchableOpacity
              style={[
                styles.chatButton,
                (!currentUserUuid || !providerId) && styles.disabledChatButton,
              ]}
              onPress={handleChat}
              disabled={!currentUserUuid || !providerId}>
              <Icon name="chat" size={wp(4)} color="#fff" />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Previous Work
            </Text>
            <FlatList
              data={previousWork}
              renderItem={renderPreviousWorkItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.previousWorkList}
              contentContainerStyle={styles.previousWorkContent}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Other Offered Services
            </Text>
            <FlatList
              data={offeredServices}
              renderItem={renderServiceItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.serviceList}
              contentContainerStyle={styles.serviceContent}
            />
          </View>

          <View style={styles.reviewSection}>
            <Text style={[styles.sectionTitle, {color: theme.text}]}>
              Review & Rating
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingValue, {color: theme.text}]}>4.9</Text>
              {[...Array(5)].map((_, index) => (
                <Icon key={index} name="star" size={wp(5)} color="#03A7A7" />
              ))}
            </View>
            <Text style={styles.reviewsText}>Reviews(88)</Text>
          </View>
        </ScrollView>

        <View style={styles.payButton}>
          <CustomButton
            title="Book this service"
            onPress={() => {
              fromBid ? handleBookService() : handleOrderService();
            }}
          />
        </View>
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
  profileSection: {
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  profileImagePlaceholder: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: wp(10),
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginTop: hp(1),
  },
  profileLocation: {
    fontSize: wp(3.5),
    color: '#666',
    marginBottom: hp(1),
  },
  chatButton: {
    flexDirection: 'row',
    backgroundColor: '#00cec9',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledChatButton: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  chatButtonText: {
    fontSize: wp(4),
    color: '#fff',
    marginLeft: wp(1),
  },
  section: {
    marginTop: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  previousWorkList: {
    marginTop: hp(1),
  },
  previousWorkContent: {
    paddingRight: wp(5),
  },
  previousWorkCard: {
    width: wp(40),
    height: wp(40),
    borderRadius: 15,
    marginRight: wp(2),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previousWorkText: {
    fontSize: wp(4),
    textAlign: 'center',
  },
  serviceList: {
    marginTop: hp(1),
  },
  serviceContent: {
    paddingRight: wp(5),
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(2),
    marginRight: wp(2),
    width: wp(25),
    alignItems: 'center',
  },
  serviceName: {
    fontSize: wp(3.5),
    marginBottom: hp(1),
  },
  serviceInfo: {
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: wp(3.5),
    color: '#000',
    fontWeight: 'bold',
    marginBottom: hp(0.5),
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
  reviewSection: {
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  ratingValue: {
    fontSize: wp(6),
    fontWeight: 'bold',
    marginRight: wp(1),
  },
  reviewsText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  payButton: {
    position: 'absolute',
    bottom: Platform.select({ios: hp(2), android: hp(2)}),
    left: Platform.select({ios: wp(6), android: wp(5)}),
    right: Platform.select({ios: wp(6), android: wp(5)}),
    marginBottom: hp(2),
  },
  errorText: {
    fontSize: wp(4),
    textAlign: 'center',
    marginVertical: hp(2),
    color: 'red',
  },
  loadingText: {
    fontSize: wp(4),
    textAlign: 'center',
    marginTop: hp(10),
  },
});

export default ShopProfile;
