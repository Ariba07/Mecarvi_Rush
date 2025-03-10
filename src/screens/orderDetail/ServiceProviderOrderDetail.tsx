import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import {CheckCircle, Circle} from 'react-native-feather';
import {trackingSteps} from '../tracking/Tracking';
import ChatIcon from '../../assets/images/Chat.svg';

const customerDetail = [
  {label: 'Customer Name', value: 'Chris'},
  {label: 'Email', value: 'xyz@gmail.com'},
  {label: 'Phone no.', value: '09876543212'},
  {label: 'Sipping Address', value: 'NewYork, USA'},
];

const statuses = ['Processing', 'Pending', 'Completed', 'Declined'];

const ServiceProviderOrderDetail = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedStatus, setSelectedStatus] = useState('Processing');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.space}>
          <Header
            title="Order Detail"
            onBackPress={() => navigation.goBack()}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/**Order Overview */}
          <View style={styles.space}>
            <Text style={styles.title}>Orders Overview</Text>
            <View style={styles.cards}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/images/Orders.png')}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.info}>
                <Text style={styles.name}>Aluminium Signage</Text>

                <View style={styles.ratingContainer}>
                  <Text style={styles.rating}>Yesterday at 8:00 PM</Text>
                </View>

                <View style={styles.row}>
                  <TouchableOpacity style={[styles.cartButton]}>
                    <Text style={styles.cartText}>Processing </Text>
                  </TouchableOpacity>
                  <Text style={styles.price}>$ 250</Text>
                </View>
              </View>
            </View>
          </View>

          {/**Customer Detail */}
          <View style={styles.space}>
            <Text style={styles.title}>Customer Detail</Text>
            <View style={styles.cards}>
              <View>
                {customerDetail.map((item, index) => (
                  <View key={index} style={styles.specRow}>
                    <Text style={styles.specLabel}>{item.label}</Text>
                    <Text style={styles.specValue}>{item.value}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={styles.chats}
                  onPress={() => {
                    navigation.navigate('Message', {
                      chatId: '0',
                      chatName: 'Ali',
                    });
                  }}>
                  <ChatIcon />
                  <Text style={styles.chatText}>Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/**Status */}
          <View style={styles.space}>
            <Text style={styles.title}>Order Type</Text>
            <View style={styles.buttonContainer}>
              {statuses.map(status => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.button,
                    selectedStatus === status && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedStatus(status)}>
                  <Text
                    style={[
                      styles.buttonText,
                      selectedStatus === status && styles.selectedText,
                    ]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Card Section */}
          <View style={styles.card}>
            <Text style={styles.title}>Order Status</Text>
            <View>
              {trackingSteps.map((item, index) => (
                <View key={item.id} style={styles.stepContainer}>
                  {/* Icon with background */}
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item.bgColor},
                    ]}>
                    {item.icon}
                  </View>

                  <View style={styles.stepTextContainer}>
                    <Text style={styles.stepTitle}>{item.status}</Text>
                    <Text style={styles.stepTime}>{item.time}</Text>
                  </View>

                  {item.completed ? (
                    <CheckCircle color="green" width={20} height={20} />
                  ) : (
                    <Circle color="gray" width={20} height={20} />
                  )}

                  {index !== trackingSteps.length - 1 && (
                    <View style={styles.progressLine} />
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
  space: {
    paddingHorizontal: Platform.select({
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: hp(2.5),
    borderTopRightRadius: hp(2.5),
    padding: wp(5),
    paddingHorizontal: Platform.select({
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
  },
  title: {
    fontSize: wp(5),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  stepTime: {
    fontSize: wp(3),
    color: 'gray',
  },
  progressLine: {
    position: 'absolute',
    right: wp(2.2),
    top: Platform.OS === 'ios' ? wp(10) : wp(11.5),
    width: 2,
    height: Platform.OS === 'ios' ? hp(7.5) : hp(9),
    borderLeftColor: '#cccccc',
    borderLeftWidth: 1,
  },
  iconContainer: {
    width: Platform.OS === 'ios' ? wp(15) : wp(18),
    height: Platform.OS === 'ios' ? wp(15) : wp(18),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  cards: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: wp('2%'),
    borderRadius: wp('4%'),
    marginBottom: hp('1%'),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('2%'),
    overflow: 'hidden',
    backgroundColor: '#cccccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: wp('2%'),
  },
  info: {
    flex: 1,
    marginLeft: wp('4%'),
  },
  name: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: wp('3%'),
    color: '#333333',
    marginTop: hp('0.5%'),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  cartButton: {
    paddingVertical: hp('0.5%'),
    width: wp('27%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#03A7A7',
  },
  cartText: {
    fontSize: Platform.OS === 'ios' ? wp('3%') : wp('3.5%'),
    fontWeight: '600',
    color: '#ffffff',
  },
  price: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#333',
  },
  specRow: {
    flexDirection: 'row',
    paddingVertical: wp(1),
  },
  specLabel: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#9c9c9c',
    width: '50%',
  },
  specValue: {
    fontSize: wp(3.5),
    color: '#333333',
    width: '50%',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(3),
    marginBottom: wp(4),
  },
  button: {
    paddingVertical: wp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedButton: {
    backgroundColor: '#03A7A7',
    borderColor: 'transparent',
  },
  buttonText: {
    fontSize: wp(3.5),
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  chats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: wp(1),
    borderRadius: wp(2),
    backgroundColor: '#03A7A7',
    alignSelf: 'flex-end',
    width: wp(22),
    marginVertical: wp(1.5),
  },
  chatText: {fontSize: wp(3.5), color: '#ffffff'},
});

export default ServiceProviderOrderDetail;
