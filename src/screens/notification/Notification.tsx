import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import Header from '../../components/common/header/Header';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const notifications = [
  {
    id: '1',
    title: 'Successfully Ordered. You will receive...',
    date: 'Yesterday at 10:00 AM',
    icon: require('../../assets/icons/success.png'), // Replace with correct icon path
    bgColor: '#2ECC71',
  },
  {
    id: '2',
    title: 'Sale! Enjoy up to 70% off at New Year...',
    date: '12 March 2024 at 10:00 AM',
    icon: require('../../assets/icons/discount.png'),
    bgColor: '#3498DB',
  },
  {
    id: '3',
    title: 'Order is on the way.',
    date: '01 January 2025 at 10:00 AM',
    icon: require('../../assets/icons/delivery.png'),
    bgColor: '#F39C12',
  },
  {
    id: '4',
    title: 'Grab now New Year 2025 discount ...',
    date: '12 March 2024 at 10:00 AM',
    icon: require('../../assets/icons/discount.png'),
    bgColor: '#3498DB',
  },
];

const Notification: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Notification" onBackPress={() => navigation.goBack()} />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.notificationCard}>
            <View
              style={[styles.iconContainer, {backgroundColor: item.bgColor}]}>
              <Image source={item.icon} style={styles.icon} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(5),
    backgroundColor: '#F5F5F5',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(1.5),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  icon: {
    width: wp(5),
    height: wp(5),
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: wp(3.5),
    color: '#777',
    marginTop: hp(0.5),
  },
});

export default Notification;
