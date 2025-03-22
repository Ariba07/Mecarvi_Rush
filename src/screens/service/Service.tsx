import {
  Text,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Header from '../../components/common/header/Header';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {setServiceUuid} from '../../slice/Slice';
import {useDispatch} from 'react-redux';

const Service: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [categories, setCategories] = useState<any[]>([]);
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: {data: {data: any[]}} = await apiHelper({
          method: 'GET',
          endpoint: 'categories/?parent_only=1',
        });
        setCategories(response?.data?.data || []); // Ensure response data is valid
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []); // Runs once when the component mounts

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Services" onBackPress={() => navigation.goBack()} />
        <FlatList
          data={categories}
          numColumns={3} // Ensures each row contains 3 items
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.serviceCard,
                {backgroundColor: theme.backgroundColor},
              ]}
              onPress={() => {
                navigation.navigate('Products');
                dispatch(setServiceUuid(item.id));
              }}>
              <Image
                source={{uri: item.icon}}
                style={styles.serviceImage}
                resizeMode="contain"
              />
              <Text style={[styles.serviceName, {color: theme.text}]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: '#F5F7FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6), // Slightly more padding on iOS
      android: wp(5),
    }),
    paddingBottom: Platform.select({
      ios: hp(4),
      android: hp(8),
    }),
  },
  listContainer: {
    alignItems: 'center',
  },
  serviceCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('1.5%'),
    width: wp('25%'), // Adjust width for 3 columns
    height: wp('25%'),
    justifyContent: 'center',
    margin: wp('3.5%'), // Ensure spacing between items
  },
  serviceImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('2%'),
  },
  serviceName: {
    marginTop: hp('1%'),
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    maxWidth: wp('20%'), // Ensure text does not overflow the card
  },
});

export default Service;
