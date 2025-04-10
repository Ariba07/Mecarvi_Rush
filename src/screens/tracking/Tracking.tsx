import React, {useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  FlatList,
  Text,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {CheckCircle, Circle} from 'react-native-feather';
import Successful from '../../assets/images/Successful.svg';
import Track from '../../assets/images/Track.svg';
import Courier from '../../assets/images/Courier.svg';
import Delivery from '../../assets/images/Delivery.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import CustomButton from '../../components/common/buttons/CustomButton';

export const trackingSteps = [
  {
    id: '1',
    status: 'Order is accepted.',
    time: '',
    icon: <Successful width={wp(9)} height={wp(9)} />,
    bgColor: '#B3EACD', // Light green
    completed: true,
  },
  {
    id: '2',
    status: 'Order is being Pickup.',
    time: '',
    icon: <Track width={wp(9)} height={wp(9)} />,
    bgColor: '#FFD59E', // Light orange
    completed: true,
  },
  {
    id: '3',
    status: 'Order is on the way.',
    time: '',
    icon: <Delivery width={wp(9)} height={wp(9)} />,
    bgColor: '#B3D9FF', // Light blue
    completed: false,
  },
  {
    id: '4',
    status: 'Order will be delivered soon.',
    time: '',
    icon: <Courier width={wp(9)} height={wp(9)} />,
    bgColor: '#FFC2C2', // Light red
    completed: false,
  },
];

const Tracking: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Track Order" onBackPress={() => navigation.goBack()} />
      </View>
      {/* Background Map Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/map.png')}
          style={styles.mapBackground}
        />
      </View>

      {/* Card Section */}
      <View style={[styles.card, {backgroundColor: theme.whole}]}>
        <Text style={[styles.title, {color: theme.input}]}>
          Delivery Status
        </Text>
        <FlatList
          data={trackingSteps}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <View style={styles.stepContainer}>
              {/* Icon with background */}
              <View
                style={[styles.iconContainer, {backgroundColor: item.bgColor}]}>
                {item.icon}
              </View>

              <View style={styles.stepTextContainer}>
                <Text style={[styles.stepTitle, {color: theme.input}]}>
                  {item.status}
                </Text>
                <Text style={[styles.stepTime, {color: theme.text}]}>
                  {item.time}
                </Text>
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
          )}
        />

        <CustomButton
          title="View Order"
          onPress={() => {
            navigation.navigate('OrderDetails');
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: Platform.select({
      ios: wp(3), // Slightly more padding on iOS
      android: wp(3),
    }),
  },
  imageContainer: {
    width: '100%',
  },
  mapBackground: {
    width: '100%',
    height: hp(30), // Adjust height as needed
    resizeMode: 'cover',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: hp(2.5),
    borderTopRightRadius: hp(2.5),
    padding: wp(5),
    zIndex: 10, // Ensures it's above the image
    marginTop: hp(-2), // Moves it up
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
  button: {
    backgroundColor: '#03A7A7',
    paddingVertical: Platform.OS === 'ios' ? hp(1) : hp(1.5), // iOS has slightly more padding
    borderRadius: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(2),
    width: wp(80), // iOS button is slightly narrower
    height: Platform.OS === 'ios' ? hp(4.5) : hp(5.7), // iOS button is slightly taller
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: 'bold',
  },
  iconContainer: {
    width: Platform.OS === 'ios' ? wp(15) : wp(18),
    height: Platform.OS === 'ios' ? wp(15) : wp(18),
    borderRadius: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
});

export default Tracking;
