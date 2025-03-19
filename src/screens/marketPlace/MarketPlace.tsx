import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useContext} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import Header from '../../components/common/header/Header';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For star icons
import {
  BusinessProvider,
  businessProviders,
} from '../../components/common/list/List';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

type Prop = RouteProp<RootStackParamList, 'MarketPlace'>;

const MarketPlace: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Prop>();
  const {fromProduct} = route.params;
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  // Handle "Accept" button press (you can add navigation or API call here)
  const handleAccept = (providerId: string) => {
    // Example: Navigate to a confirmation screen or make an API call
    console.log(`Accepted provider with ID: ${providerId}`);
    // You can navigate to another screen or update state here
    navigation.navigate('Checkout');
  };

  // Render each provider item
  const renderProviderItem = ({item}: {item: BusinessProvider}) => (
    <TouchableOpacity
      style={[styles.providerCard, {backgroundColor: theme.backgroundColor}]}
      onPress={() => {
        navigation.navigate('ShopProfile', {
          fromBid: fromProduct === true ? false : true,
        });
      }}>
      <Image
        source={{uri: item.imageUrl}}
        style={styles.providerImage}
        resizeMode="cover"
      />
      <View style={styles.providerInfo}>
        <Text style={[styles.providerName, {color: theme.text}]}>
          {item.name}
        </Text>
        <Text style={[styles.deliveryDate, {color: theme.text}]}>
          Delivery Date: {item.deliveryDate}
        </Text>
        <View style={styles.ratingContainer}>
          {[...Array(5)].map((_, index) => (
            <Icon
              key={index}
              name="star"
              size={wp(4)}
              color={index < item.rating ? '#ffd700' : '#ddd'}
            />
          ))}
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.price, {color: theme.input}]}>{item.price}</Text>
          {!fromProduct && (
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                handleAccept(item.id);
              }}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title={fromProduct ? 'MarketPlace' : 'Bids List'}
          onBackPress={() => navigation.goBack()}
        />

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Icon name="store" size={wp(5)} color="#666" />
          <Text style={styles.subtitle}>
            Select Your Preferred business provider
          </Text>
        </View>

        {/* List of Providers */}
        <FlatList
          data={businessProviders}
          renderItem={renderProviderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
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
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(2),
    marginBottom: hp(2),
  },
  subtitle: {
    fontSize: wp(4),
    color: '#666',
    marginLeft: wp(2),
  },
  listContainer: {
    paddingBottom: hp(2),
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: wp(2),
    marginBottom: hp(2),
    alignItems: 'center',
  },
  providerImage: {
    width: wp(15),
    height: wp(15),
    borderRadius: 10,
  },
  providerInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  providerName: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
  },
  deliveryDate: {
    fontSize: wp(3),
    color: '#666',
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
  price: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#000',
    marginTop: hp(0.5),
  },
  acceptButton: {
    backgroundColor: '#00cec9', // Teal color as per image
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  acceptButtonText: {
    fontSize: wp(3.5),
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default MarketPlace;
