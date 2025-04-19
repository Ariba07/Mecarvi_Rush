import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  Keyboard,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import {TouchableWithoutFeedback} from 'react-native';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {useSelector} from 'react-redux';
import {selectUserName, selectUserUuidId} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@login_credentials';

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const reduxUserName = useSelector(selectUserName);
  const user_uuid = useSelector(selectUserUuidId);
  const [userUuid, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

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
        setLoading(true); // Show loading while fetching
        const response = await apiHelper({
          method: 'GET',
          endpoint: `customers/${userUuid}`,
        });
        const profile = (
          response as {
            data: {full_name?: string; email?: string; phone_number?: string};
          }
        ).data; // Assuming response.data is a single user object

        if (profile) {
          setFullName(profile.full_name || '');
          setEmail(profile.email || '');
          setPhoneNumber(profile.phone_number || '');
        }
      } catch (error) {
        console.warn('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userUuid]);

  const handleUpdate = async () => {
    try {
      const updatedProfile = {
        full_name: fullName,
        email: email,
        phone_number: phoneNumber,
      };

      const response = await apiHelper({
        method: 'POST',
        endpoint: `customers/${user_uuid}?_method=patch`,
        data: updatedProfile,
      });

      console.log('Profile updated successfully:', response);

      // Refetch the profile data after a successful update
    } catch (error) {
      console.warn('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
        <View style={styles.container}>
          <Header title="Profile" onBackPress={() => navigation.goBack()} />

          {/* Profile Image & Name */}
          <View style={styles.profileContainer}>
            <Image
              source={require('../../assets/images/Orders.png')}
              style={styles.profileImage}
            />
            <Text style={[styles.storeName, {color: theme.text}]}>
              {userName}
            </Text>
          </View>

          <View style={[styles.card, {backgroundColor: theme.backgroundColor}]}>
            <Text style={[styles.label, {color: theme.text}]}>Full Name</Text>
            <TextInput
              style={[styles.input, {color: theme.input}]}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor={'#999'}
            />

            <Text style={[styles.label, {color: theme.text}]}>Email</Text>
            <TextInput
              style={[styles.input, {color: theme.input}]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor={'#999'}
            />

            <Text style={[styles.label, {color: theme.text}]}>
              Phone Number
            </Text>
            <TextInput
              style={[styles.input, {color: theme.input}]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              placeholderTextColor={'#999'}
            />

            <CustomButton title="Update" onPress={handleUpdate} />
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    alignItems: 'center',
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
    marginTop: hp(2),
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: wp(5),
    borderRadius: 12,
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
    color: '#333',
  },
  input: {
    height: hp(5.5),
    borderWidth: 1.5,
    borderColor: '#DDD',
    borderRadius: wp(2),
    paddingHorizontal: wp(3),
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(1.5),
  },
});

export default Profile;
