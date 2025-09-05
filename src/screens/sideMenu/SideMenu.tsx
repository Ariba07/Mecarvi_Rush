/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Edit from '../../assets/images/Edit.svg';
import Points from '../../assets/images/Points.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import Settings from '../settings/Settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {
  selectPointsEarned,
  selectProfileImage,
  selectUserName,
} from '../../slice/Slice';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';

const STORAGE_KEY = '@login_credentials';

const SideMenu: React.FC = () => {
  const {theme} = useContext(ThemeContext);
  const [userName, setUserName] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [profileImage, setProfileImage] = useState<string | null>(null); // Local state for profile image
  const reduxUserName = useSelector(selectUserName);
  const reduxTotalPoints = useSelector(selectPointsEarned);
  const reduxProfileImage = useSelector(selectProfileImage);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Use useFocusEffect to refresh data when screen is focused
  useFocusEffect(
    useCallback(() => {
      // Function to fetch user data, including profile image
      const fetchUserData = async () => {
        try {
          const credentials = await AsyncStorage.getItem(STORAGE_KEY);
          if (credentials) {
            const parsedCredentials = JSON.parse(credentials);
            if (
              parsedCredentials.name &&
              parsedCredentials.role &&
              parsedCredentials.pointsEarned &&
              parsedCredentials.profileImage
            ) {
              setUserName(parsedCredentials.name);
              setTotalPoints(parsedCredentials.pointsEarned);
              setProfileImage(parsedCredentials.profileImage); // Set profile image from AsyncStorage
              return;
            }
          }
          // Fallback to Redux if AsyncStorage doesn't have data
          setUserName(reduxUserName ?? null);
          setTotalPoints(reduxTotalPoints ?? 0);
          setProfileImage(reduxProfileImage ?? null); // Fallback to Redux profile image
        } catch (error) {
          console.warn('Error retrieving user data from AsyncStorage:', error);
          // Fallback to Redux on error
          setUserName(reduxUserName ?? null);
          setTotalPoints(reduxTotalPoints ?? 0);
          setProfileImage(reduxProfileImage ?? null);
        }
      };
      fetchUserData(); // Optional cleanup function (runs when screen loses focus)
      return () => {
        console.log('Screen unfocused, cleanup if needed');
      };
    }, [reduxUserName, reduxTotalPoints, reduxProfileImage]), // Added reduxProfileImage to dependencies
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {backgroundColor: theme.backgroundColor || '#fff'},
      ]}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={
              profileImage
                ? {uri: profileImage}
                : {
                    uri: 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=',
                  }
            }
            style={styles.profileImage}
            resizeMode="cover"
            onError={error =>
              console.warn(
                'Error loading profile image:',
                error.nativeEvent.error,
              )
            }
          />
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, {color: theme.text || '#333'}]}>
              {userName || 'Unknown User'}
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Points />
              <Text
                style={[
                  styles.loyaltyText,
                  {color: theme.text ? theme.text + '80' : '#666'},
                ]}>
                {' '}
                Loyalty Points:{' '}
                <Text style={styles.loyaltyPoints}>{totalPoints}</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => {
              navigation.navigate('Profile');
            }}>
            <Edit />
          </TouchableOpacity>
        </View>
        <Settings />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(3),
      android: wp(3),
    }),
    paddingTop: Platform.select({
      ios: hp(8),
      android: hp(8),
    }),
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  profileImage: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(9),
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: wp(3),
  },
  profileName: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  loyaltyText: {
    fontSize: wp(3.5),
    color: '#666',
  },
  loyaltyPoints: {
    color: '#FF0080',
    fontWeight: 'bold',
  },
  editIcon: {
    padding: wp(2),
  },
});

export default SideMenu;
