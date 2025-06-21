import {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectToken,
  selectSubscriptionStatus,
  setSubscriptionStatus,
} from '../../slice/Slice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import {Alert} from 'react-native';
import {STORAGE_KEY} from '../login/types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';

type Plan = {
  id: string;
  title: string;
  price: string;
  unit_amount: number;
  features: string[];
};

const SUBSCRIPTION_HISTORY_KEY = '@subscription_history';

export const useSubscriptionLogic = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [hasPreviousPaidPlan, setHasPreviousPaidPlan] =
    useState<boolean>(false);
  const [isFirstSubscription, setIsFirstSubscription] = useState<boolean>(true);
  const token = useSelector(selectToken);
  const user = useSelector(selectSubscriptionStatus);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const initializeSubscriptionState = async () => {
      try {
        const subscriptionHistory = await AsyncStorage.getItem(
          SUBSCRIPTION_HISTORY_KEY,
        );
        const hasSubscribed = !!subscriptionHistory;
        setIsFirstSubscription(!hasSubscribed);
        const history = subscriptionHistory
          ? JSON.parse(subscriptionHistory)
          : [];
        const hadPaidPlan = history.some((sub: any) => sub.type === 'paid');
        setHasPreviousPaidPlan(hadPaidPlan);
        dispatch(setSubscriptionStatus(user || 'inactive'));

        const response = await apiHelper({
          method: 'GET',
          endpoint: 'packages',
          token: token,
        });

        const {data} = response as {data: any[]};
        const fetchedPlans: Plan[] = data.map(plan => ({
          id: plan.id,
          title: plan.product_name,
          price: `$${plan.plan_price.toFixed(2)}/month`,
          unit_amount: plan.unit_amount,
          features:
            plan.benefits && Object.keys(plan.benefits).length > 0
              ? (Object.values(plan.benefits) as string[])
              : ['Limited orders per month', 'Access to basic features'],
        }));

        const availablePlans = hadPaidPlan
          ? fetchedPlans.filter(plan => plan.unit_amount > 0)
          : fetchedPlans;
        setPlans(availablePlans);
      } catch (error: any) {
        console.log('Error fetching plans or subscription history:', error);
      }
    };

    initializeSubscriptionState();
  }, [token, user, dispatch]);

  const handleSubscriptionSubmit = async (paymentMethodId: string) => {
    const selectedPlanData = plans.find(plan => plan.id);
    if (!selectedPlanData) {
      Alert.alert('Error', 'Please select a valid plan.');
      return;
    }

    const planType = selectedPlanData.unit_amount === 0 ? 'free' : 'paid';
    if (planType === 'paid' && !paymentMethodId) {
      Alert.alert('Error', 'Payment method is required for paid plans.');
      return;
    }
    if (planType === 'free' && hasPreviousPaidPlan) {
      Alert.alert(
        'Error',
        'You cannot select a free plan after having a paid plan.',
      );
      return;
    }

    try {
      const endpoint = isFirstSubscription
        ? 'subscribe'
        : 'update-subscription';
      const response = await apiHelper({
        method: 'POST',
        endpoint,
        data: {
          plan: selectedPlanData.id,
          type: planType,
          payment_method: paymentMethodId,
        },
        token: token,
      });

      const result = response as any;
      if (result.error) {
        throw new Error(
          result.error.message || 'Subscription creation/update failed',
        );
      }

      const {subscriptionId} = result;
      console.log(
        `Subscription ${isFirstSubscription ? 'created' : 'updated'}:`,
        subscriptionId,
      );

      const subscriptionHistory = await AsyncStorage.getItem(
        SUBSCRIPTION_HISTORY_KEY,
      );
      const history = subscriptionHistory
        ? JSON.parse(subscriptionHistory)
        : [];
      history.push({
        plan: selectedPlanData.id,
        type: planType,
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem(
        SUBSCRIPTION_HISTORY_KEY,
        JSON.stringify(history),
      );

      const status = planType === 'free' ? 'inactive' : 'active';
      dispatch(setSubscriptionStatus(status));

      const credentials = await AsyncStorage.getItem(STORAGE_KEY);
      if (credentials) {
        const userData = JSON.parse(credentials);
        userData.subscriptionStatus = status;
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      }

      Alert.alert(
        'Success',
        `Subscription ${
          isFirstSubscription ? 'created' : 'updated'
        } successfully!`,
      );
      navigation.navigate('Drawer');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'An error occurred during subscription.',
      );
      console.log('Subscription error:', error);
    }
  };

  return {plans, handleSubscriptionSubmit};
};
