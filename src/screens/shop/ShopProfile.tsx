import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, View, Text, ScrollView} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectServiceProviderUuid,
  selectUserUuidId,
  selectUserName,
  setDispatchId,
} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from '@react-native-firebase/firestore';
import {db} from '../../../FirebaseConfig';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import ProfileSection from './ProfileSection';
import ReviewsSection from './ReviewsSection';
import {
  STORAGE_KEY,
  ProfileData,
  ReviewItem,
  getUserFriendlyMessage,
} from './types';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/shopProfile/ShopProfileStyles';

type Prop = RouteProp<RootStackParamList, 'ShopProfile'>;

const ShopProfile: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {fromBid, providerId} = route.params;
  const {theme} = useContext(ThemeContext);
  const serviceProviderUuid = useSelector(selectServiceProviderUuid);
  const reduxUserUuid = useSelector(selectUserUuidId);
  const username = useSelector(selectUserName);
  const dispatch = useDispatch();
  const [currentUserUuid, setCurrentUserUuid] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {user_uuid: storedId, name} = JSON.parse(savedCredentials);
          setCurrentUserUuid(storedId || reduxUserUuid);
          setCurrentUserName(name || username || null);
        } else {
          setCurrentUserUuid(reduxUserUuid);
          setCurrentUserName(username || null);
        }
      } catch (error: any) {
        setCurrentUserUuid(reduxUserUuid);
        setCurrentUserName(username || null);
        setErrorMessage('Unable to load user data. Using fallback.');
      }
    };
    fetchRoleFromStorage();
  }, [reduxUserUuid, username]);

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
        const fetchedReviews: ReviewItem[] = apiData.reviews
          .map((review: any) => ({
            id: review.id,
            order_id: review.order_id,
            comment: review.comment,
            rating: review.rating,
            created_at: review.created_at,
          }))
          .sort(
            (a: ReviewItem, b: ReviewItem) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 15);
        setReviews(fetchedReviews);
        const totalRating = fetchedReviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        const avgRating =
          fetchedReviews.length > 0 ? totalRating / fetchedReviews.length : 0;
        setAverageRating(parseFloat(avgRating.toFixed(1)));
      } catch (error: any) {
        setErrorMessage('Unable to load profile. Please try again.');
      }
    };
    if (serviceProviderUuid) {
      fetchProfile();
    } else {
      setErrorMessage('Service provider not found.');
    }
  }, [serviceProviderUuid]);

  const handleChat = async () => {
    try {
      if (!currentUserUuid || !providerId) {
        const error = new Error('Missing UUIDs');
        (error as any).cause = {code: 'app/missing-uuids'};
        throw error;
      }
      if (!currentUserName || !profile?.name) {
        const error = new Error('Missing participant names');
        (error as any).cause = {code: 'app/missing-names'};
        throw error;
      }
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
      const participantNames = {
        [currentUserUuid]: currentUserName,
        [providerId]: profile.name,
      };
      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        navigation.navigate('Message', {
          chatId: existingChat.id,
          chatName: profile.name,
          participantNames:
            existingChat.data().participantNames || participantNames,
        });
      } else {
        const newChatRef = await addDoc(chatsRef, {
          chatId,
          name: `Chat with ${profile.name}`,
          participants: [currentUserUuid, providerId],
          participantNames,
          createdAt: new Date(),
        });
        navigation.navigate('Message', {
          chatId: newChatRef.id,
          chatName: profile.name,
          participantNames,
        });
      }
    } catch (error: any) {
      setErrorMessage(getUserFriendlyMessage(error.cause || error));
    }
  };

  const handleBookService = () => navigation.navigate('Booking');
  const handleOrderService = () => {
    navigation.navigate('Cart');
    dispatch(setDispatchId(profile?.id ?? 0));
  };

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
          <ProfileSection
            profile={profile}
            currentUserUuid={currentUserUuid}
            providerId={providerId}
            onChat={handleChat}
          />
          <ReviewsSection reviews={reviews} averageRating={averageRating} />
        </ScrollView>
        <View style={styles.payButton}>
          <CustomButton
            title="Book this service"
            onPress={() =>
              fromBid ? handleBookService() : handleOrderService()
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShopProfile;
