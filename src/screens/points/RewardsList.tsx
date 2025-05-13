/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import GiftBox from '../../assets/images/GiftBox.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {Order} from './types';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/points/PointsStyles';

interface RewardsListProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onRedeem: (uuid: string) => void;
}

const RewardsList: React.FC<RewardsListProps> = ({
  orders,
  isLoading,
  error,
  onRedeem,
}) => {
  const {theme} = React.useContext(ThemeContext);

  return (
    <View
      style={[
        styles.rewardsContainer,
        {backgroundColor: theme.backgroundColor},
      ]}>
      <Text style={[styles.rewardsTitle, {color: theme.text}]}>Rewards</Text>
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
                onPress={() => onRedeem(item.order_uuid)}
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
  );
};

export default RewardsList;
