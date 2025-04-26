/* eslint-disable react-native/no-inline-styles */
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
import {
  selectUserId,
  selectRole,
  selectId,
  selectPointsEarned,
  selectPointsUsed,
} from '../../slice/Slice';
import {Order} from '../dashboard/ServiceProviderDashboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@login_credentials';

const Points: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const reduxPointsEarned = useSelector(selectPointsEarned); // Points earned from Redux
  const reduxPointsUsed = useSelector(selectPointsUsed); // Points used from Redux
  const reduxUserId = useSelector(selectId); // For service provider
  const reduxCustomerId = useSelector(selectUserId); // For customer
  const reduxRole = useSelector(selectRole);
  const {theme} = useContext(ThemeContext); // Access theme
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0); // State for loyalty_points
  const [redeemValue, setRedeemValue] = useState<number>(0); // State for redeem_value
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [totalPoints, setTotalPoints] = useState<number>(0); // Synced total points
  const [usedPoints, setUsedPoints] = useState<number>(0); // Synced used points

  // Fetch loyalty_points and redeem_value from API
  useEffect(() => {
    const getPoints = async () => {
      try {
        const response = (await apiHelper({
          method: 'GET',
          endpoint: 'admin-settings',
        })) as {
          data: {id: number; setting_name: string; setting_value: string}[];
        };

        // Find loyalty_points and redeem_value
        const settings = response.data || [];
        const loyaltySetting = settings.find(
          setting => setting.setting_name === 'loyalty_points',
        );
        const redeemSetting = settings.find(
          setting => setting.setting_name === 'redeem_value',
        );

        // Parse and set values (convert string to number)
        if (loyaltySetting) {
          setLoyaltyPoints(parseFloat(loyaltySetting.setting_value) || 0);
        }
        if (redeemSetting) {
          setRedeemValue(parseFloat(redeemSetting.setting_value) || 0);
        }
        console.log('Loyalty Points:', loyaltySetting);
        console.log('Redeem Value:', redeemSetting);
      } catch (settingsError) {
        console.warn('Error retrieving settings:', settingsError);
      }
    };

    getPoints();
  }, []);

  // Combined useEffect to fetch role, userId, pointsEarned, and pointsUsed from AsyncStorage and Redux
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('Saved Credentials:', savedCredentials); // Debug
        let parsedCredentials = null;

        if (savedCredentials) {
          parsedCredentials = JSON.parse(savedCredentials);
        }

        // Fetch and set role
        const fetchedRole = parsedCredentials?.role || reduxRole;
        setRole(fetchedRole);

        // Fetch and set userId based on role
        let fetchedUserId: number | null = null;
        if (fetchedRole === 'service_provider') {
          fetchedUserId = parsedCredentials?.id ?? reduxUserId ?? null;
        } else if (fetchedRole === 'customer') {
          fetchedUserId = parsedCredentials?.userId ?? reduxCustomerId ?? null;
        }
        setUserId(fetchedUserId);
        console.log('Role:', fetchedRole, 'UserId:', fetchedUserId); // Debug

        // Fetch and set pointsEarned and pointsUsed
        const storedPointsEarned = parsedCredentials?.pointsEarned;
        const storedPointsUsed = parsedCredentials?.pointsUsed;

        const finalPointsEarned =
          storedPointsEarned !== undefined
            ? Number(storedPointsEarned)
            : reduxPointsEarned ?? 0;
        const finalPointsUsed =
          storedPointsUsed !== undefined
            ? Number(storedPointsUsed)
            : reduxPointsUsed ?? 0;

        setTotalPoints(finalPointsEarned);
        setUsedPoints(finalPointsUsed);

        console.log(
          'Synced Points - Earned:',
          finalPointsEarned,
          'Used:',
          finalPointsUsed,
        );
      } catch (fetchError) {
        console.warn('Error fetching user data from AsyncStorage:', fetchError);

        // Fallback to Redux values if AsyncStorage fails
        setRole(reduxRole);
        setUserId(
          reduxRole === 'service_provider'
            ? reduxUserId ?? null
            : reduxCustomerId ?? null,
        );
        setTotalPoints(reduxPointsEarned ?? 0);
        setUsedPoints(reduxPointsUsed ?? 0);
      }
    };

    fetchUserData();
  }, [
    reduxRole,
    reduxUserId,
    reduxCustomerId,
    reduxPointsEarned,
    reduxPointsUsed,
  ]);

  // Fetch orders based on role
  const fetchOrders = useCallback(async () => {
    if (userId === null || !role) {
      console.log('Skipping fetchOrders: userId or role is null', {
        userId,
        role,
      }); // Debug
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const endpoint =
        role === 'service_provider'
          ? `orders?service_provider_id=${userId}&per_page=6&page=1`
          : `orders?customer_id=${userId}&per_page=6&page=1`;
      console.log('Fetching orders from endpoint:', endpoint); // Debug
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};

      console.log('Orders response:', response); // Debug
      const fetchedOrders = Array.isArray(response?.data) ? response.data : [];
      setOrders(fetchedOrders.sort((a, b) => b.id - a.id)); // Sort by ID descending
    } catch (fetchOrdersError: any) {
      console.warn('Error fetching orders:', fetchOrdersError);
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, role]);

  // Fetch orders when userId or role changes
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRedeem = async (uuid: string) => {
    try {
      const response = (await apiHelper({
        method: 'POST',
        endpoint: `redeem/${uuid}`,
      })) as {data: Order[]}; // Adjust type based on actual response

      console.log('Redeem response:', response); // Debug
      const updatedOrders = Array.isArray(response.data) ? response.data : [];
      setOrders(updatedOrders.sort((a, b) => b.id - a.id));
    } catch (redeemError: any) {
      console.warn('Error updating points:', redeemError);
    }
  };

  // Calculate progress
  const progress = (usedPoints ?? 0) / (totalPoints || 1); // Avoid division by zero

  // Calculate points-to-dollar conversion
  const pointsToDollar = loyaltyPoints * redeemValue;

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
            <Text style={styles.pointsText}>✨ {totalPoints} Points</Text>
            <Text style={styles.subText}>
              Collect more points to unlock gold
            </Text>
            <Progress.Bar
              progress={progress}
              width={wp(80)}
              height={hp(1)}
              color="#FF007A"
              unfilledColor={theme.backgroundColor}
              borderWidth={0}
              borderRadius={8}
            />
            <Text style={styles.conversionText}>
              1 Point = ${pointsToDollar.toFixed(2)}
            </Text>
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
          {isLoading ? (
            <Text style={[styles.statusText, {color: theme.text}]}>
              Loading orders...
            </Text>
          ) : error ? (
            <Text style={[styles.statusText, {color: 'red'}]}>{error}</Text>
          ) : orders.length === 0 ? (
            <Text style={[styles.statusText, {color: theme.text}]}>
              No orders available
            </Text>
          ) : (
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
                    disabled={!!item.is_redeemed}>
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
          )}
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
  statusText: {
    fontSize: wp(4),
    textAlign: 'center',
    marginVertical: hp(2),
  },
});

export default Points;
