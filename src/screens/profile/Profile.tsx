import React, {useState} from 'react';
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

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [fullName, setFullName] = useState('Chris Adam');
  const [email, setEmail] = useState('abc@gmail.com');
  const [phoneNumber, setPhoneNumber] = useState('+92-2323223230');

  const handleUpdate = () => {
    console.log('Updated Profile:', {fullName, email, phoneNumber});
    // Implement API call for updating the profile
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Header title="Profile" onBackPress={() => navigation.goBack()} />

          {/* Profile Image & Name */}
          <View style={styles.profileContainer}>
            <Image
              source={require('../../assets/images/Orders.png')} // Replace with your image
              style={styles.profileImage}
            />
            <Text style={styles.storeName}>Your name</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor={'#999'}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="Enter email"
              placeholderTextColor={'#999'}
            />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
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
    flex: 1, // Ensures full screen usage
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
