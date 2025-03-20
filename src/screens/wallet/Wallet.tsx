/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
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
import PieChart from 'react-native-pie-chart'; // Updated library
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

// Mock data for transaction history
const transactions = [
  {
    id: '1',
    type: 'Order Earning',
    amount: 220.0,
    date: '16 Sep 2025, 08:00 AM',
    status: 'Pending',
    icon: 'file-text-o',
  },
  {
    id: '2',
    type: 'Withdraw to Bank',
    amount: 220.0,
    date: '16 Sep 2025, 08:00 AM',
    status: 'Completed',
    icon: 'download',
  },
  {
    id: '3',
    type: 'Withdraw to Bank',
    amount: 220.0,
    date: '16 Sep 2025, 08:00 AM',
    status: 'Completed',
    icon: 'download',
  },
  {
    id: '4',
    type: 'Withdraw to Bank',
    amount: 220.0,
    date: '16 Sep 2025, 08:00 AM',
    status: 'Completed',
    icon: 'download',
  },
  {
    id: '5',
    type: 'Withdraw to Bank',
    amount: 220.0,
    date: '16 Sep 2025, 08:00 AM',
    status: 'Completed',
    icon: 'download',
  },
];

const Wallet = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {theme} = useContext(ThemeContext); // Access theme and toggleTheme

  // Data for the pie chart
  const totalEarnings = 830.03 + 755.75; // Ongoing + Completed
  const ongoingPercentage = (830.03 / totalEarnings) * 100; // ~52%
  const completedPercentage = (755.75 / totalEarnings) * 100; // ~48%
  const chartData = [
    {
      percent: ongoingPercentage,
      color: '#03A7A7',
      legendFontColor: '#7F7F7F',
      price: 830.03,
    },
    {
      percent: completedPercentage,
      color: '#FF00A7',
      legendFontColor: '#7F7F7F',
      price: 980.03,
    },
  ];
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        {/* Header */}
        <Header title="Your Wallet" onBackPress={() => navigation.goBack()} />

        {/* Personal Balance Section */}
        <View
          style={[
            styles.balanceContainer,
            {backgroundColor: theme.backgroundColor},
          ]}>
          <View>
            <Text style={styles.balanceAmount}>+ $560.00</Text>
            <Text style={styles.balanceLabel}>Your Personal Balance</Text>
          </View>
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={() => navigation.navigate('Withdraw')}>
            <Text
              style={[
                styles.withdrawButtonText,
                {color: theme.backgroundColor},
              ]}>
              Withdraw
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Summary Section */}
        <View style={styles.earningsSummary}>
          <View
            style={[
              styles.earningsCard,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', gap: wp(2)}}>
              <View
                style={{
                  backgroundColor: '#03a7a7',
                  borderRadius: wp(5),
                  width: wp(5),
                  height: hp(2.5),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome name="dollar" size={wp(3)} color="#ffffff" />
              </View>
              <Text style={styles.earningsLabel}>Total earning</Text>
            </View>

            <View style={styles.earningsTextContainer}>
              <Text style={styles.earningsAmount}>$1400.00</Text>
            </View>
          </View>
          <View
            style={[
              styles.earningsCard,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <View
              style={{flexDirection: 'row', alignItems: 'center', gap: wp(2)}}>
              <View
                style={{
                  backgroundColor: '#03a7a7',
                  borderRadius: wp(5),
                  width: wp(5),
                  height: hp(2.5),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome name="ellipsis-h" size={wp(3)} color="#ffffff" />
              </View>
              <Text style={styles.earningsLabel}>Pending earning</Text>
            </View>

            <View style={styles.earningsTextContainer}>
              <Text style={styles.earningsAmount}>$170.00</Text>
            </View>
          </View>
        </View>

        {/* Pie Chart Section */}
        <Text style={[styles.sectionTitle, {color: theme.input}]}>
          Earnings Summary
        </Text>
        <View style={styles.pieChartContainer}>
          <PieChart
            widthAndHeight={wp(50)}
            series={chartData.map(item => ({
              value: item.percent,
              color: item.color,
            }))}
            cover={0.7}
          />
          <View style={styles.pieChartCenter}>
            <Text style={[styles.pieChartAmount, {color: theme.input}]}>
              ${totalEarnings}
            </Text>
            <Text style={styles.pieChartLabel}>September</Text>
          </View>
        </View>
        <View style={styles.pieChartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#03A7A7'}]} />
            <Text style={[styles.legendText, {color: theme.text}]}>
              Pending <Text style={{color: '#03a7a7'}}>$830.03</Text>
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: '#FF00A7'}]} />
            <Text style={[styles.legendText, {color: theme.text}]}>
              Completed <Text style={{color: '#ff00a7'}}>$755.75</Text>
            </Text>
          </View>
        </View>

        {/* Transaction History Section */}
        <Text style={[styles.sectionTitle, {color: theme.input}]}>
          Transaction History
        </Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <View
              style={[
                styles.transactionCard,
                {backgroundColor: theme.backgroundColor},
              ]}>
              <View
                style={{
                  backgroundColor: '#30a7a7',
                  borderRadius: wp(2),
                  padding: wp(2),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <FontAwesome name={item.icon} size={wp(5)} color="#ffffff" />
              </View>

              <View style={styles.transactionDetails}>
                <Text style={[styles.transactionType, {color: theme.text}]}>
                  {item.type}
                </Text>
                <Text style={styles.transactionDate}>{item.date}</Text>
              </View>
              <View style={styles.transactionAmountContainer}>
                <Text style={[styles.transactionAmount, {color: theme.text}]}>
                  + ${item.amount.toFixed(2)}
                </Text>
                <View
                  style={{
                    backgroundColor:
                      item.status === 'Pending' ? '#03A7A733' : '#069F3D59',
                    paddingHorizontal: wp(3),
                    borderRadius: wp(1),
                    paddingVertical: wp(0.7),
                  }}>
                  <Text
                    style={[
                      styles.transactionStatus,
                      {
                        color:
                          item.status === 'Pending' ? '#03A7A7' : '#28a745',
                      },
                    ]}>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    paddingHorizontal: Platform.select({
      ios: wp(6),
      android: wp(5),
    }),
  },
  // Balance Section
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: wp(3),
    marginVertical: hp(1),
  },
  balanceAmount: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#FF00A7',
  },
  balanceLabel: {
    fontSize: wp(3.5),
    color: '#777',
    marginTop: hp(0.5),
  },
  withdrawButton: {
    backgroundColor: '#03A7A7',
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(2),
  },
  withdrawButtonText: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#fff',
  },
  // Earnings Summary Section
  earningsSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: hp(1),
  },
  earningsCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: wp(3),
    marginHorizontal: wp(1),
  },
  earningsTextContainer: {
    alignSelf: 'center',
  },
  earningsLabel: {
    fontSize: wp(3.5),
    color: '#777',
  },
  earningsAmount: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#FF00A7',
    marginTop: hp(0.5),
  },
  // Pie Chart Section
  sectionTitle: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#333',
    marginVertical: hp(2),
  },
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pieChartCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartAmount: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#333',
  },
  pieChartLabel: {
    fontSize: wp(3.5),
    color: '#777',
  },
  pieChartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp(2),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(1.5),
    marginRight: wp(2),
  },
  legendText: {
    fontSize: wp(3.5),
    color: '#333',
  },
  // Transaction History Section
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: wp(3),
    borderRadius: wp(3),
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  transactionIcon: {
    marginRight: wp(3),
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: wp(3.5),
    color: '#777',
    marginTop: hp(0.5),
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333333',
  },
  transactionStatus: {
    fontSize: wp(3),
  },
});

export default Wallet;
