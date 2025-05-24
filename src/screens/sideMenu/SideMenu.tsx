/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useState} from 'react';
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
  selectRole,
  selectUserName,
} from '../../slice/Slice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';

const STORAGE_KEY = '@login_credentials';

const SideMenu: React.FC = () => {
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  const [userName, setUserName] = useState<string | null>(null);
  const reduxUserName = useSelector(selectUserName);
  const reduxRole = useSelector(selectRole);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const reduxtotalPoints = useSelector(selectPointsEarned); // Define the max points required for gold
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const profileImage = useSelector(selectProfileImage);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);

          if (
            parsedCredentials.name &&
            parsedCredentials.role &&
            parsedCredentials.pointsEarned
          ) {
            setUserName(parsedCredentials.name);
            setTotalPoints(parsedCredentials.pointsEarned);
            return;
          }
        }
        // Fallback to Redux if AsyncStorage doesn't have userId
        setUserName(reduxUserName ?? null);
        setTotalPoints(reduxtotalPoints ?? 0);
      } catch (error) {
        console.warn('Error retrieving user ID from AsyncStorage:', error);
        // Fallback to Redux on error
        setUserName(reduxUserName ?? null);
        setTotalPoints(reduxtotalPoints ?? 0);
      }
    };

    getUserId();
  }, [reduxRole, reduxUserName, reduxtotalPoints]);

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
                  } // Fallback to default image
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    gap: wp(4),
    paddingLeft: wp(1.5),
  },
  menuText: {
    fontSize: wp(4),
  },
});

export default SideMenu;
