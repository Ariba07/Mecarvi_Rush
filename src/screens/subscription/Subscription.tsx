/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
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

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    'price_1RSFzsQGkbRqDEDilPZLb5g6',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {theme} = useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {plans, handleSubscriptionSubmit} = useSubscriptionLogic();

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
          <ScrollView showsVerticalScrollIndicator={false}>
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
          </ScrollView>
        </View>
        <Animatable.View animation="pulse" iterationCount={1} duration={1000}>
          <CustomButton
            title="Choose Plan"
            onPress={() => setIsModalVisible(true)}
          />
        </Animatable.View>
      </View>
      <Animatable.View
        animation={isModalVisible ? 'fadeInUp' : 'fadeOutDown'}
        duration={300}>
        <CardPaymentBottomSheet
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={handleSubscriptionSubmit}
        />
      </Animatable.View>
    </SafeAreaView>
  );
};

export default Subscription;
