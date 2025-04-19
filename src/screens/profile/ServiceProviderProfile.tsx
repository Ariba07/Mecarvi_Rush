import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Rate from '../../assets/images/Rate.svg';
import AboutUs from '../../components/helperUtils/profile/AboutUs';
import Work from '../../components/helperUtils/profile/Work';
import Reviews from '../../components/helperUtils/profile/Reviews';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useSelector} from 'react-redux';
import {selectServiceProviderUuid, selectUserName} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tabs = [
  // {label: 'Services'},
  {label: 'About'},
  {label: 'Work'},
  {label: 'Reviews'},
];

const STORAGE_KEY = '@login_credentials';

const ServiceProviderProfile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('About');
  const {theme} = useContext(ThemeContext);
  const user_uuid = useSelector(selectServiceProviderUuid);
  interface ProfileData {
    user: any;
    service_provider_name: string;
    address: string;
    logo: string;
  }
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userUuid, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const reduxUserName = useSelector(selectUserName);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          if (parsedCredentials.name) {
            setUserName(parsedCredentials.name);
            setUserId(parsedCredentials.userUuid);

            return;
          }
        }
        // Fallback to Redux if AsyncStorage doesn't have userId
        setUserName(reduxUserName ?? null);
        setUserId(user_uuid ?? null);
      } catch (error) {
        console.warn('Error retrieving user ID from AsyncStorage:', error);
        // Fallback to Redux on error
        setUserName(reduxUserName ?? null);
        setUserId(user_uuid ?? null);
      }
    };

    getUserId();
  }, [reduxUserName, user_uuid]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = (await apiHelper({
          method: 'GET',
          endpoint: `service-provider/${userUuid}`,
        })) as {
          data: {
            user: any;
            service_provider_name: string;
            address: string;
            logo: string;
          };
        };
        setProfileData(response.data);
      } catch (error) {
        console.warn('Error fetching profile:', error);
      }
    };
    fetchProfileData();
  }, [userUuid]);

  if (!profileData) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const {address, logo} = profileData;

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Profile" onBackPress={() => navigation.goBack()} />

        {/* Profile Image & Name */}
        <View style={styles.profileContainer}>
          <Image
            source={{uri: logo}}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={[styles.storeName, {color: theme.input}]}>
            {userName}
          </Text>
          <Text style={[styles.label, {color: theme.text}]}>{address}</Text>
          <View style={styles.ratings}>
            <Rate width={wp(3)} height={wp(3)} />
            <Text style={[styles.ratingText, {color: theme.backgroundColor}]}>
              {' '}
              4.9 (12 Reviews){' '}
              {/* This could be dynamic if API provides rating data */}
            </Text>
          </View>
        </View>

        <View>
          <FlatList
            data={tabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.label}
            contentContainerStyle={styles.tabContainer}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setSelectedTab(item.label)}
                style={styles.tabButton}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === item.label
                      ? styles.activeTab
                      : {color: theme.text},
                  ]}>
                  {item.label}
                </Text>
                {selectedTab === item.label && (
                  <View style={styles.activeUnderline} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
        {/* Tab Content */}
        <View style={styles.contentContainer}>
          {/* {selectedTab === 'Services' && <ServiceList />} */}
          {selectedTab === 'About' && <AboutUs />}
          {selectedTab === 'Work' && <Work />}
          {selectedTab === 'Reviews' && <Reviews />}
        </View>
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
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  profileImage: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(15),
    resizeMode: 'cover',
  },
  storeName: {
    fontSize: wp(5),
    fontWeight: 'bold',
    lineHeight: wp(10),
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(1),
    color: '#333',
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03A7A7',
    borderRadius: wp(2),
    padding: wp(1),
  },
  ratingText: {color: '#ffffff', fontSize: wp(3.5)},
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: hp(2),
  },
  tabButton: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: wp(4),
    fontWeight: '500',
    color: '#444',
    paddingVertical: hp(0.5),
  },
  activeTab: {
    color: '#FF0080',
    fontWeight: 'bold',
  },
  activeUnderline: {
    height: hp(0.4),
    backgroundColor: '#FF0080',
    width: '100%',
    borderRadius: wp(3),
  },
  contentContainer: {
    flex: 1,
  },
});

export default ServiceProviderProfile;
