import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectUserId,
  selectRole,
  selectId,
  selectPointsEarned,
  selectPointsUsed,
  setWalletBalance,
  setPointUsed,
  setPointsEarned,
} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import PointsHeader from './PointsHeader';
import RewardsList from './RewardsList';
import {STORAGE_KEY, Order} from './types';
import {styles} from '../../assets/styles/points/PointsStyles';
import CustomModal from '../../components/common/errorModal/CustomModal';

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

const Points: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext);
  const reduxPointsEarned = useSelector(selectPointsEarned);
  const reduxPointsUsed = useSelector(selectPointsUsed);
  const reduxUserId = useSelector(selectId);
  const reduxCustomerId = useSelector(selectUserId);
  const reduxRole = useSelector(selectRole);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [redeemValue, setRedeemValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [redeemingUuid, setRedeemingUuid] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
  const dispatch = useDispatch();

  useEffect(() => {
    const getPoints = async () => {
      try {
        const response = (await apiHelper({
          method: 'GET',
          endpoint: 'admin-settings',
        })) as {
          data: {id: number; setting_key: string; setting_value: string}[];
        };
        const settings = response.data || [];
        console.log('settings', settings);

        const loyaltySetting = settings.find(
          s => s.setting_key === 'loyalty_points',
        );
        const redeemSetting = settings.find(
          s => s.setting_key === 'redeem_value',
        );
        if (loyaltySetting) {
          setLoyaltyPoints(parseFloat(loyaltySetting.setting_value) || 0);
        }
        if (redeemSetting) {
          setRedeemValue(parseFloat(redeemSetting.setting_value) || 0);
        }
      } catch (settingsError) {
        console.warn('Error retrieving settings:', settingsError);
      }
    };
    getPoints();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedCredentials = await AsyncStorage.getItem(STORAGE_KEY);
        const parsedCredentials = savedCredentials
          ? JSON.parse(savedCredentials)
          : null;
        const fetchedRole = parsedCredentials?.role || reduxRole;
        setRole(fetchedRole);
        const fetchedUserId =
          fetchedRole === 'service_provider'
            ? parsedCredentials?.id ?? reduxUserId ?? null
            : parsedCredentials?.userId ?? reduxCustomerId ?? null;
        setUserId(fetchedUserId);
        const storedPointsEarned = parsedCredentials?.pointsEarned;
        const storedPointsUsed = parsedCredentials?.pointsUsed;
        setTotalPoints(
          storedPointsEarned !== undefined
            ? Number(storedPointsEarned)
            : reduxPointsEarned ?? 0,
        );
        setUsedPoints(
          storedPointsUsed !== undefined
            ? Number(storedPointsUsed)
            : reduxPointsUsed ?? 0,
        );
      } catch (fetchError) {
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

  const fetchProfileData = async () => {
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'authentication/profile',
      })) as any;
      dispatch(setWalletBalance(response.data.wallet?.balance || 0));
      dispatch(setPointUsed(response.data.wallet?.points_used || 0));
      dispatch(setPointsEarned(response.data.wallet?.points_earned || 0));
    } catch (profileError) {
      console.warn('Error fetching profile:', profileError);
    }
  };

  const fetchOrders = useCallback(async () => {
    if (userId === null || !role) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = 'orders?per_page=6&page=1';
      const response = (await apiHelper({
        method: 'GET',
        endpoint,
      })) as {data: Order[]; meta: {pagination: {last_page: number}}};
      const fetchedOrders = Array.isArray(response?.data) ? response.data : [];
      setOrders(fetchedOrders);
    } catch (fetchOrdersError: any) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId, role]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleRedeem = async (uuid: string): Promise<ActionResult> => {
    setRedeemingUuid(uuid);
    try {
      const response = (await apiHelper({
        method: 'POST',
        endpoint: `redeem/${uuid}`,
      })) as any;

      const updatedOrder = response?.data?.order || response?.data;

      if (updatedOrder) {
        setOrders(prevOrders =>
          prevOrders
            .map(order =>
              order.order_uuid === uuid
                ? {
                    ...order,
                    is_redeemed: true,
                    points: updatedOrder.points ?? order.points,
                  }
                : order,
            )
            .sort((a, b) => b.id - a.id),
        );
        await fetchProfileData();
        return {
          success: true,
          data: updatedOrder,
        };
      } else {
        await fetchOrders();
        return {
          success: true,
          data: null,
        };
      }
    } catch (redeemError: any) {
      console.warn('Error redeeming order:', redeemError);
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to redeem order. Please try again.',
        },
      };
    } finally {
      setRedeemingUuid(null);
    }
  };

  const onRedeem = async (uuid: string) => {
    const result = await handleRedeem(uuid);
    if (result.success) {
      setModalTitle('Success');
      setModalMessage(
        result.data
          ? 'Order redeemed successfully!'
          : 'Order redeemed, list updated.',
      );
      setModalVisible(true);
    } else if (result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Loyalty Points"
          onBackPress={() => navigation.goBack()}
        />
        <PointsHeader
          totalPoints={totalPoints}
          usedPoints={usedPoints}
          loyaltyPoints={loyaltyPoints}
          redeemValue={redeemValue}
        />
        <RewardsList
          orders={orders}
          isLoading={isLoading}
          error={error}
          onRedeem={onRedeem}
          redeemingUuid={redeemingUuid}
        />
        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Points;
