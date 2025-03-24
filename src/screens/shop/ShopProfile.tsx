import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Alert,
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
import {selectServiceProviderUuid, selectUserUuidId} from '../../slice/Slice';
import {useSelector} from 'react-redux';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {db} from '../../../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Prop = RouteProp<RootStackParamList, 'ShopProfile'>;

interface ProfileData {
  name: string;
  location: string;
  profileImageUrl: string;
}

interface PreviousWorkItem {
  id: string;
  imageUrl: string;
}

interface ServiceItem {
  id: string;
  name: string;
  imageUrl: string;
  price: string;
  rating: number;
}

const STORAGE_KEY = 'your_storage_key_here'; // Replace with your actual STORAGE_KEY constant

const ShopProfile: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {fromBid} = route.params;
  const {theme} = useContext(ThemeContext);
  const serviceProviderUuid = useSelector(selectServiceProviderUuid);
  const reduxUserUuid = useSelector(selectUserUuidId);
  const [currentUserUuid, setCurrentUserUuid] = useState<string | null>(null);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [previousWork, setPreviousWork] = useState<PreviousWorkItem[]>([]);
  const [offeredServices, setOfferedServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {user_uuid: storedId} = JSON.parse(savedCredentials);
          if (storedId) {
            setCurrentUserUuid(storedId);
          } else {
            setCurrentUserUuid(reduxUserUuid);
          }
        } else {
          setCurrentUserUuid(reduxUserUuid);
        }
      } catch (error) {
        console.log(
          'Error fetching role from AsyncStorage:',
          (error as any)?.message,
        );
        setCurrentUserUuid(reduxUserUuid); // Fallback to Redux role on error
      }
    };

    fetchRoleFromStorage();
  }, [reduxUserUuid]);

  useEffect(() => {
    console.log('Current User UUID:', currentUserUuid);
    console.log('Service Provider UUID:', serviceProviderUuid);

    const fetchProfile = async () => {
      try {
        const response = await apiHelper({
          method: 'GET',
          endpoint: `service-provider/${serviceProviderUuid}`,
        });

        const apiData = (response as {data: any}).data;

        setProfile({
          name: apiData.service_provider_name,
          location: apiData.address,
          profileImageUrl: apiData.logo,
        });

        setPreviousWork([
          {
            id: '1',
            imageUrl: apiData.portfolio,
          },
        ]);

        setOfferedServices(
          apiData.services_offered.map((serviceId: string, index: number) => ({
            id: `${index}`,
            name: `Service ${serviceId.slice(-4)}`,
            imageUrl: apiData.logo,
            price: '$150',
            rating: 4.5,
          })),
        );
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (serviceProviderUuid) {
      fetchProfile();
    } else {
      console.warn('No serviceProviderUuid available yet');
    }
  }, [currentUserUuid, serviceProviderUuid]);

  const handleChat = async () => {
    console.log('Handling chat - Current User UUID:', currentUserUuid);
    console.log('Handling chat - Service Provider UUID:', serviceProviderUuid);

    if (!currentUserUuid || !serviceProviderUuid) {
      console.error(
        'Missing UUIDs for chat - User:',
        currentUserUuid,
        'Provider:',
        serviceProviderUuid,
      );
      Alert.alert(
        'Unable to start chat: User or provider information is missing.',
      );
      return;
    }

    const participants = [currentUserUuid, serviceProviderUuid].sort();
    const chatId = `${participants[0]}_${participants[1]}`;

    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('chatId', '==', chatId));
    const querySnapshot = await getDocs(q);

    let existingChatId = null;
    if (!querySnapshot.empty) {
      existingChatId = querySnapshot.docs[0].id;
    } else {
      const newChat = await addDoc(chatsRef, {
        chatId,
        name: `${profile?.name || 'Chat'} with User`,
        participants: [currentUserUuid, serviceProviderUuid],
        createdAt: serverTimestamp(),
      });
      existingChatId = newChat.id;
    }

    navigation.navigate('Message', {
      chatId: existingChatId,
      chatName: profile?.name || 'Chat',
    });
  };

  const handleBookService = () => {
    navigation.navigate('Booking');
  };

  const renderPreviousWorkItem = ({item}: {item: PreviousWorkItem}) => (
    <Image
      source={{uri: item.imageUrl}}
      style={styles.previousWorkImage}
      resizeMode="cover"
    />
  );

  const renderServiceItem = ({item}: {item: ServiceItem}) => (
    <View
      style={[styles.serviceCard, {backgroundColor: theme.backgroundColor}]}>
      <Image
        source={{uri: item.imageUrl}}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={[styles.serviceName, {color: theme.text}]}>
          {item.name}
        </Text>
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
        <Text>Loading profile...</Text>
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
        <ScrollView contentContainerStyle={{paddingBottom: wp(16)}}>
          <View style={styles.profileSection}>
            <Image
              source={{uri: profile.profileImageUrl}}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Text style={[styles.profileName, {color: theme.text}]}>
              {profile.name}
            </Text>
            <Text style={styles.profileLocation}>{profile.location}</Text>
            <TouchableOpacity
              style={[
                styles.chatButton,
                (!currentUserUuid || !serviceProviderUuid) &&
                  styles.disabledChatButton,
              ]}
              onPress={handleChat}
              disabled={!currentUserUuid || !serviceProviderUuid}>
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
        {fromBid && (
          <View style={styles.payButton}>
            <CustomButton
              title="Book this service"
              onPress={handleBookService}
            />
          </View>
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
  profileSection: {
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  profileImage: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
  },
  profileName: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
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
    color: '#333',
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  previousWorkList: {
    marginTop: hp(1),
  },
  previousWorkContent: {
    paddingRight: wp(5),
  },
  previousWorkImage: {
    width: wp(40),
    height: wp(40),
    borderRadius: 15,
    marginRight: wp(2),
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
  serviceImage: {
    width: wp(20),
    height: wp(20),
    borderRadius: 10,
  },
  serviceInfo: {
    alignItems: 'center',
    marginTop: hp(1),
  },
  serviceName: {
    fontSize: wp(3.5),
    color: '#333',
  },
  servicePrice: {
    fontSize: wp(3.5),
    color: '#000',
    fontWeight: 'bold',
    marginTop: hp(0.5),
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
    color: '#333',
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
});

export default ShopProfile;
