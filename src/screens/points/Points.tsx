import React, {useState} from 'react';
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

const initialRewards = [
  {id: '1', title: 'Free Shipping', points: 100, redeemed: false},
  {id: '2', title: 'Free Shipping', points: 100, redeemed: false},
  {id: '3', title: 'Free Shipping', points: 100, redeemed: false},
  {id: '4', title: '$5.00', points: 500, redeemed: false},
];

const Points = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [rewards, setRewards] = useState(initialRewards);
  const totalPoints = 500; // Define the max points required for gold
  const userPoints = 20; // User's current points
  const progress = userPoints / totalPoints; // Calculate progress percentage

  const handleRedeem = (id: string) => {
    setRewards(prevRewards =>
      prevRewards.map(reward =>
        reward.id === id ? {...reward, redeemed: true} : reward,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
              unfilledColor="#D3D3D3"
              borderWidth={0}
              borderRadius={8}
            />
            <Text style={styles.conversionText}>$1 = 100 Points</Text>
          </View>
        </View>

        {/* Rewards List */}
        <View style={styles.rewardsContainer}>
          <Text style={styles.rewardsTitle}>Rewards</Text>
          <FlatList
            data={rewards}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.rewardItem}>
                <GiftBox width={wp(8)} height={wp(8)} />
                <View style={styles.rewardTextContainer}>
                  <Text style={styles.rewardTitle}>{item.title}</Text>
                  <Text style={styles.rewardPoints}>{item.points} points</Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.redeemButton,
                    item.redeemed && styles.redeemedButton,
                  ]}
                  onPress={() => handleRedeem(item.id)}
                  disabled={item.redeemed} // Prevents clicking again
                >
                  <Text
                    style={[
                      styles.redeemText,
                      item.redeemed && styles.redeemedText,
                    ]}>
                    {item.redeemed ? 'Redeemed' : 'Redeem'}
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
