/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {SafeAreaView, View, ActivityIndicator} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import Header from '../../components/common/header/Header';
import CustomButton from '../../components/common/buttons/CustomButton';
import CardPaymentBottomSheet from '../../components/cardPayment/CardPaymentModal';
import {useSubscriptionLogic} from './SubscriptionLogic';
import {styles} from './Styles';
import PlanCard from './PlanCard';
import {ScrollView} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CustomModal from '../../components/common/errorModal/CustomModal';

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
  const {theme} = useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {plans, handleSubscriptionSubmit} = useSubscriptionLogic();

  const handleSubscription = async (paymentMethodId: string) => {
    setIsLoading(true);
    try {
      const result: ActionResult = await handleSubscriptionSubmit(
        paymentMethodId,
      );
      if (result.success) {
        setModalTitle('Success');
        setModalMessage(
          `Subscription ${result.data ? 'created' : 'updated'} successfully!`,
        );
        setModalVisible(true);
      } else if (result.error) {
        setModalTitle(result.error.title);
        setModalMessage(result.error.message);
        setModalVisible(true);
      }
    } finally {
      setIsLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <View style={{flexGrow: 1}}>
          <Animatable.View animation="fadeInDown" duration={1000}>
            <Header
              title="Subscription"
              onBackPress={() => navigation.navigate('Drawer')}
            />
          </Animatable.View>
          <Animatable.Text
            animation="fadeIn"
            duration={800}
            delay={300}
            style={styles.heading}>
            Choose Your Plan
          </Animatable.Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1, paddingBottom: wp(50)}}>
            {plans.length > 0 ? (
              plans.map((plan, index) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => setSelectedPlan(plan.id)}
                  theme={theme}
                />
              ))
            ) : (
              <Animatable.Text
                animation="fadeIn"
                duration={800}
                delay={600}
                style={styles.errorText}>
                Loading plans...
              </Animatable.Text>
            )}
            <Animatable.View
              animation="pulse"
              iterationCount={1}
              duration={1000}>
              <CustomButton
                title={isLoading ? 'Processing...' : 'Choose Plan'}
                onPress={() => setIsModalVisible(true)}
                disabled={isLoading || !selectedPlan}
              />
              {isLoading && (
                <ActivityIndicator
                  size="large"
                  color={theme.text || '#FF0080'}
                  style={{marginTop: wp(2)}}
                />
              )}
            </Animatable.View>
          </ScrollView>
        </View>
      </View>
      <Animatable.View
        animation={isModalVisible ? 'fadeInUp' : 'fadeOutDown'}
        duration={300}>
        <CardPaymentBottomSheet
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleSubscription}
        />
      </Animatable.View>
      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Subscription;
