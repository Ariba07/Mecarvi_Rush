import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import {apiHelper} from '../../components/helperUtils/apiHelper/ApiHelper';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'AllTicket'
>;

interface Ticket {
  id: number;
  support_ticket_uuid: string;
  ticket_number: string;
  subject: string;
  message: string;
  status: string;
}

const AllTicket = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const {theme} = useContext(ThemeContext);

  // Fetch tickets from API
  const fetchTickets = useCallback(async () => {
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'support-tickets',
      })) as any;

      console.log('Tickets fetched successfully:', response);
      setTickets(response.data || []);
    } catch (error) {
      console.error('Fetch tickets error:', error);
      Alert.alert(
        'Error',
        'Failed to fetch tickets. Please check your network.',
      );
    }
  }, []);

  // Fetch tickets on mount and when token changes
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleCreateTicket = () => {
    navigation.navigate('CreateTicket', {order_id: 0, fromOrders: false});
  };

  const renderTicketItem = ({item}: {item: Ticket}) => (
    <TouchableOpacity
      style={[styles.ticketItem, {backgroundColor: theme.backgroundColor}]}
      onPress={() => {
        navigation.navigate('Ticket', {
          ticketUuid: item.support_ticket_uuid,
          ticketId: item.id,
        });
      }}>
      <Text style={styles.ticketNumber}>{item.ticket_number}</Text>
      <Text style={[styles.subject, {color: theme.text}]}>
        Subject: {item.subject}
      </Text>
      <Text style={styles.description}>Description: {item.message}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header
          title="Customer Support"
          onBackPress={() => navigation.goBack()}
        />

        {/* Ticket List */}
        <FlatList
          data={tickets}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.ticketList}
          showsVerticalScrollIndicator={false}
        />

        {/* Create Ticket Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTicket}>
          <Text style={styles.createButtonText}>Create Ticket</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F8FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  ticketList: {
    paddingBottom: hp(10), // Space for the Create Ticket button
    paddingTop: hp(2),
    flexGrow: 1,
  },
  ticketItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
  },
  ticketNumber: {
    fontSize: wp(4),
    fontWeight: '600',
    color: '#00C4B4',
    marginBottom: hp(0.5),
  },
  subject: {
    fontSize: wp(3.5),
    color: '#333',
    marginBottom: hp(0.5),
  },
  description: {
    fontSize: wp(3.5),
    color: '#666',
  },
  createButton: {
    position: 'absolute',
    bottom: hp(3),
    left: wp(4),
    right: wp(4),
    borderWidth: 1,
    borderColor: '#00C4B4',
    borderRadius: wp(3),
    paddingVertical: hp(1.5),
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: wp(4.5),
    fontWeight: '600',
    color: '#00C4B4',
  },
});

export default AllTicket;
