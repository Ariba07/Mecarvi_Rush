import React, {useState} from 'react';
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
import ServiceList from '../../components/helperUtils/profile/ServiceList';
import AboutUs from '../../components/helperUtils/profile/AboutUs';
import Work from '../../components/helperUtils/profile/Work';
import Reviews from '../../components/helperUtils/profile/Reviews';

const tabs = [
  {label: 'Services'},
  {label: 'About'},
  {label: 'Work'},
  {label: 'Reviews'},
];

const ServiceProviderProfile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedTab, setSelectedTab] = useState('Services');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header title="Profile" onBackPress={() => navigation.goBack()} />

        {/* Profile Image & Name */}
        <View style={styles.profileContainer}>
          <Image
            source={require('../../assets/images/Orders.png')} // Replace with your image
            style={styles.profileImage}
            resizeMode="cover"
          />
          <Text style={styles.storeName}>Your name</Text>
          <Text style={styles.label}>New York, USA</Text>
          <View style={styles.ratings}>
            <Rate width={wp(3)} height={wp(3)} />
            <Text style={styles.ratingText}> 4.9 (12 Reviews)</Text>
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
                    selectedTab === item.label && styles.activeTab,
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
          {selectedTab === 'Services' && <ServiceList />}
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
    flex: 1, // Ensures full screen usage
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
    justifyContent: 'space-between', // Ensures even spacing
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
    flex: 1, // Takes remaining space
  },
});

export default ServiceProviderProfile;
