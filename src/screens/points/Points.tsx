import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
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
import GiftBox from '../../assets/images/GiftBox.svg';
import Container from '../../assets/images/container.svg';
import * as Progress from 'react-native-progress';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {useSelector} from 'react-redux';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {selectUserId, selectRole, selectId} from '../../slice/Slice';
import {Order} from '../dashboard/ServiceProviderDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@login_credentials';

const Points = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const totalPoints = 500; // Define the max points required for gold
  const userPoints = 20; // User's current points
  const progress = userPoints / totalPoints; // Calculate progress percentage
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme
  const reduxUserId = useSelector(selectId); // For service provider
  const reduxCustomerId = useSelector(selectUserId); // For customer
  const reduxRole = useSelector(selectRole);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch role from AsyncStorage or Redux
  useEffect(() => {
    const fetchRoleFromStorage = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedCredentials) {
          const {role: storedRole} = JSON.parse(savedCredentials);
          if (storedRole) {
            setRole(storedRole);
          } else {
            setRole(reduxRole);
          }
        } else {
          setRole(reduxRole);
        }
      } catch (error) {
        console.log(
          'Error fetching role from AsyncStorage:',
          (error as any)?.message,
        );
        setRole(reduxRole);
      }
    };

    fetchRoleFromStorage();
  }, [reduxRole]);

  // Fetch user ID based on role
  useEffect(() => {
    const getUserId = async () => {
      try {
        const credentials = await AsyncStorage.getItem(STORAGE_KEY);
        if (credentials) {
          const parsedCredentials = JSON.parse(credentials);
          if (role === 'service_provider' && parsedCredentials.id) {
            setUserId(parsedCredentials.id);
            return;
          } else if (role === 'customer' && parsedCredentials.userId) {
            setUserId(parsedCredentials.userId);
            return;
          }
        }
        setUserId(
          role === 'service_provider'
            ? reduxUserId ?? null
            : reduxCustomerId ?? null,
        );
      } catch (error) {
        console.warn('Error retrieving user ID from AsyncStorage:', error);
        setUserId(
          role === 'service_provider'
            ? reduxUserId ?? null
            : reduxCustomerId ?? null,
        );
      }
    };

    if (role) {
      getUserId();
    }
  }, [role, reduxUserId, reduxCustomerId]);

  // Fetch orders based on role
  const fetchOrders = useCallback(async () => {
    if (userId === null || !role) {
      return;
    }

    try {
      const endpoint =
        role === 'service_provider'
          ? `orders?service_provider_id=${userId}&per_page=6&page=1`
          : `orders?customer_id=${userId}&per_page=6&page=1`;
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};

      if (!response?.data || !response?.meta?.pagination?.last_page) {
        throw new Error('Invalid API response: Missing data or pagination');
      }

      setOrders(response.data.sort((a, b) => b.id - a.id)); // Sort by ID descending
    } catch (error: any) {
      console.warn('Error fetching orders:', error);
    }
  }, [userId, role]);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRedeem = async (uuid: string) => {
    try {
      const response = (await apiHelper({
        method: 'POST',
        endpoint: `redeem/${uuid}`,
      })) as {data: any};

      setOrders(response.data);
    } catch (error: any) {
      console.warn('Error updating points:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Loyalty Points"
          onBackPress={() => navigation.goBack()}
        />

        {/* SVG Container */}
        <View style={styles.containerWrapper}>
          <Container width={'100%'} height={hp(20)} />
          <View style={styles.overlay}>
            <Text style={styles.userName}>Chris Adam</Text>
            <Text style={styles.pointsText}>✨ 250 Points</Text>
            <Text style={styles.subText}>
              Collect more points to unlock gold
            </Text>
            {/* Progress Bar */}
            <Progress.Bar
              progress={progress}
              width={wp(80)}
              height={hp(1)}
              color="#FF007A"
              unfilledColor={theme.backgroundColor}
              borderWidth={0}
              borderRadius={8}
            />
            <Text style={styles.conversionText}>$1 = 100 Points</Text>
          </View>
        </View>

        {/* Rewards List */}
        <View
          style={[
            styles.rewardsContainer,
            {backgroundColor: theme.backgroundColor},
          ]}>
          <Text style={[styles.rewardsTitle, {color: theme.text}]}>
            Rewards
          </Text>
          <FlatList
            data={orders}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <View style={styles.rewardItem}>
                <GiftBox width={wp(8)} height={wp(8)} />
                <View style={styles.rewardTextContainer}>
                  <Text style={[styles.rewardTitle, {color: theme.text}]}>
                    Order id- #{item.id}
                  </Text>
                  <Text style={[styles.rewardPoints, {color: theme.text}]}>
                    {item.points} points
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    item.is_redeemed
                      ? [
                          styles.redeemedButton,
                          {backgroundColor: theme.backgroundColor},
                        ]
                      : {backgroundColor: theme.whole},
                  ]}
                  onPress={() => handleRedeem(item.order_uuid)}
                  disabled={item.is_redeemed} // Prevents clicking again
                >
                  <Text
                    style={[
                      styles.redeemText,
                      item.is_redeemed && styles.redeemedText,
                    ]}>
                    {item.is_redeemed ? 'Redeemed' : 'Redeem'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
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
    flex: 1,
    paddingHorizontal: wp(5),
  },
  containerWrapper: {
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: hp(3),
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: wp(5),
  },
  userName: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#fff',
  },
  pointsText: {
    fontSize: wp(3.5),
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: hp(1),
  },
  subText: {
    fontSize: wp(3),
    color: '#fff',
    marginBottom: hp(1),
  },
  progressBarContainer: {
    width: '100%',
    height: hp(1),
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF007A',
  },
  conversionText: {
    fontSize: wp(4),
    color: '#fff',
    marginTop: hp(1),
    fontWeight: 'bold',
  },
  rewardsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: wp(5),
  },
  rewardsTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: hp(2),
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  rewardTextContainer: {
    flex: 1,
    marginLeft: wp(3),
  },
  rewardTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  rewardPoints: {
    fontSize: wp(3.5),
    color: '#777',
  },
  redeemButton: {
    backgroundColor: '#03A7A7',
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  redeemText: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  redeemedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#03A7A7',
  },
  redeemedText: {
    color: '#03A7A7',
  },
});

export default Points;
