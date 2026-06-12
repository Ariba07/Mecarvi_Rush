/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {apiHelper} from '../../services/api';
import Header from '../../components/common/header/Header';
import {ThemeContext} from '../../context/ThemeContext';
import * as Animatable from 'react-native-animatable'; // Import animatable

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Disputes'>;

interface Ticket {
  id: number;
  support_ticket_uuid: string;
  ticket_number: string;
  subject: string;
  message: string;
  status: string;
  order: string;
}

const Disputes = () => {
  const navigation = useNavigation<NavigationProp>();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Add loading state
  const {theme} = useContext(ThemeContext);

  // Fetch tickets from API
  const fetchDisputes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = (await apiHelper({
        method: 'GET',
        endpoint: 'disputes/?source_type=dispute',
      })) as any;

      console.log('Disputes fetched successfully:', response);
      if (Array.isArray(response.data)) {
        setTickets(response.data);
      } else {
        console.warn('Unexpected response data:', response.data);
      }
    } catch (error) {
      console.warn('Fetch Disputes error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tickets on mount
  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const renderTicketItem = ({item, index}: {item: Ticket; index: number}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('DisputeChat', {
          disputeUuid: item.support_ticket_uuid,
          disputeId: item.id,
        });
      }}>
      <Animatable.View
        animation="fadeInUp"
        duration={600}
        delay={index * 100} // Staggered animation
        style={[styles.ticketItem, {backgroundColor: theme.backgroundColor}]}>
        <Text style={styles.ticketNumber}>{item.order}</Text>
        <Text style={[styles.subject, {color: theme.text}]}>
          Subject: {item.subject}
        </Text>
        <Text style={styles.description}>Description: {item.message}</Text>
      </Animatable.View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.whole}]}>
      <View style={styles.container}>
        <Header title="Disputes" onBackPress={() => navigation.goBack()} />
        {isLoading ? (
          <Animatable.Text
            animation="fadeIn"
            duration={800}
            style={{textAlign: 'center', color: theme.text, marginTop: hp(5)}}>
            Loading disputes...
          </Animatable.Text>
        ) : tickets.length === 0 ? (
          <Animatable.Text
            animation="fadeIn"
            duration={800}
            style={{textAlign: 'center', color: theme.text, marginTop: hp(5)}}>
            No disputes available
          </Animatable.Text>
        ) : (
          <FlatList
            data={tickets}
            renderItem={renderTicketItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.ticketList}
            showsVerticalScrollIndicator={false}
          />
        )}
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

export default Disputes;
