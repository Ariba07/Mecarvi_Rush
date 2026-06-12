/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback, useContext} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {apiHelper} from '../../services/api';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../context/ThemeContext';
import CustomModal from '../../components/common/errorModal/CustomModal';

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

interface ActionResult {
  success: boolean;
  data?: any;
  error?: {
    title: string;
    message: string;
  };
}

const AllTicket = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('Error');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const {theme} = useContext(ThemeContext);

  const fetchTickets = useCallback(async (): Promise<ActionResult> => {
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'support-tickets',
      })) as any;

      console.log('Tickets fetched successfully:', response);
      setTickets(response.data || []);
      return {
        success: true,
        data: response.data || [],
      };
    } catch (error) {
      console.error('Fetch tickets error:', error);
      return {
        success: false,
        error: {
          title: 'Error',
          message: 'Failed to fetch tickets. Please check your network.',
        },
      };
    } finally {
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await fetchTickets();
    if (!result.success && result.error) {
      setModalTitle(result.error.title);
      setModalMessage(result.error.message);
      setModalVisible(true);
    }
  }, [fetchTickets]);

  useFocusEffect(
    useCallback(() => {
      const loadTickets = async () => {
        const result = await fetchTickets();
        if (!result.success && result.error) {
          setModalTitle(result.error.title);
          setModalMessage(result.error.message);
          setModalVisible(true);
        }
      };
      loadTickets();
      return () => {};
    }, [fetchTickets]),
  );

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
        {tickets.length === 0 && !refreshing ? (
          <Text
            style={{
              textAlign: 'center',
              color: theme.text || '#333',
              marginTop: hp(5),
            }}>
            No tickets available
          </Text>
        ) : (
          <FlatList
            data={tickets}
            renderItem={renderTicketItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.ticketList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.status || '#00C4B4']}
                tintColor={theme.status || '#00C4B4'}
                title="Pull to refresh"
              />
            }
          />
        )}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTicket}>
          <Text style={styles.createButtonText}>Create Ticket</Text>
        </TouchableOpacity>
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
    paddingBottom: hp(10),
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
