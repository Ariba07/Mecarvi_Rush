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
} from 'react-native';
import React from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For star icons and chat
import CustomButton from '../../components/common/buttons/CustomButton';
import {
  PreviousWorkItem,
  ServiceItem,
  profileData,
  previousWork,
  offeredServices,
} from '../../components/common/list/List';

type Prop = RouteProp<RootStackParamList, 'ShopProfile'>;

const ShopProfile: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {fromBid} = route.params;
  // Handle chat button press
  const handleChat = () => {
    navigation.navigate('Message', {chatId: '0', chatName: 'ALI'});
  };

  // Handle book service button press
  const handleBookService = () => {
    navigation.navigate('Booking'); // Navigate to Booking screen
  };

  // Render previous work item
  const renderPreviousWorkItem = ({item}: {item: PreviousWorkItem}) => (
    <Image
      source={{uri: item.imageUrl}}
      style={styles.previousWorkImage}
      resizeMode="cover"
    />
  );

  // Render offered service item
  const renderServiceItem = ({item}: {item: ServiceItem}) => (
    <View style={styles.serviceCard}>
      <Image
        source={{uri: item.imageUrl}}
        style={styles.serviceImage}
        resizeMode="cover"
      />
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
          title="Business Profile"
          onBackPress={() => navigation.goBack()}
        />
        <ScrollView contentContainerStyle={{paddingBottom: wp(16)}}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <Image
              source={{uri: profileData.profileImageUrl}}
              style={styles.profileImage}
              resizeMode="cover"
            />
            <Text style={styles.profileName}>{profileData.name}</Text>
            <Text style={styles.profileLocation}>{profileData.location}</Text>
            <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
              <Icon name="chat" size={wp(4)} color="#fff" />
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          </View>

          {/* Previous Work Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Previous Work</Text>
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

          {/* Other Offered Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Other Offered Services</Text>
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

          {/* Review & Rating Section */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Review & Rating</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingValue}>4.9</Text>
              {[...Array(5)].map((_, index) => (
                <Icon
                  key={index}
                  name="star"
                  size={wp(5)}
                  color="#03A7A7" // Teal color as per image
                />
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
    backgroundColor: '#f0f4f8', // Light background as per image
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
    backgroundColor: '#00cec9', // Teal color as per image
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: 8,
    alignItems: 'center',
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
    marginBottom: hp(2), // Ensure button is not too close to the bottom
  },
});

export default ShopProfile;
