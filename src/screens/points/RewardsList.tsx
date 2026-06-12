/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import GiftBox from '../../assets/images/GiftBox.svg';
import {ThemeContext} from '../../context/ThemeContext';
import {Order} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/points/PointsStyles';
import * as Animatable from 'react-native-animatable';

interface RewardsListProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onRedeem: (uuid: string) => void;
  redeemingUuid: string | null;
}

const RewardsList: React.FC<RewardsListProps> = ({
  orders,
  isLoading,
  error,
  onRedeem,
  redeemingUuid,
}) => {
  const {theme} = React.useContext(ThemeContext);
  console.log('Orders', orders);

  // Filter orders to exclude those with points as null
  const validOrders = orders.filter(order => order.points !== null);
console.log('Valid Orders', validOrders);

  return (
    <View
      style={[
        styles.rewardsContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <Text style={[styles.rewardsTitle, {color: theme.text}]}>Rewards</Text>
      {isLoading ? (
        <Animatable.Text
          animation="fadeIn"
          duration={800}
          style={[styles.statusText, {color: theme.text}]}>
          Loading orders...
        </Animatable.Text>
      ) : error ? (
        <Animatable.Text
          animation="fadeIn"
          duration={800}
          style={[styles.statusText, {color: 'red'}]}>
          {error}
        </Animatable.Text>
      ) : validOrders.length === 0 ? (
        <Animatable.Text
          animation="fadeIn"
          duration={800}
          style={[styles.statusText, {color: theme.text}]}>
          No orders available
        </Animatable.Text>
      ) : (
        <FlatList
          data={validOrders}
          keyExtractor={item => item.id.toString()}
          renderItem={({item, index}) => (
            <Animatable.View
              animation="fadeInUp"
              duration={600}
              delay={index * 100}
              style={styles.rewardItem}>
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
                onPress={() => onRedeem(item.order_uuid)}
                disabled={
                  !!item.is_redeemed || redeemingUuid === item.order_uuid
                }>
                <Animatable.View>
                  <Text
                    style={[
                      styles.redeemText,
                      item.is_redeemed && styles.redeemedText,
                      redeemingUuid === item.order_uuid && {opacity: 0.5},
                    ]}>
                    {redeemingUuid === item.order_uuid
                      ? 'Redeeming...'
                      : item.is_redeemed
                      ? 'Redeemed'
                      : 'Redeem'}
                  </Text>
                </Animatable.View>
              </TouchableOpacity>
            </Animatable.View>
          )}
        />
      )}
    </View>
  );
};

export default RewardsList;
