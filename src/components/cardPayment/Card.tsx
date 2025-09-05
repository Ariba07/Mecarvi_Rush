import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  View,
  Text,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ThemeContext} from '../helperUtils/theme/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomModal from '../common/errorModal/CustomModal';

interface Card {
  id: number;
  user_card_uuid: string;
  user_id: number;
  card_type: string;
  card_number: string;
  cvc: number;
  expiry_date: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface CardProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (userCardUuid: string) => void;
  cards: Card[];
}

const Cards: React.FC<CardProps> = ({isVisible, onClose, onSubmit, cards}) => {
  const [loading, setLoading] = useState(false);
  const {theme} = useContext(ThemeContext);
  const [selectedCardUuid, setSelectedCardUuid] = useState<string | null>(null);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleCardSelect = async (card: Card) => {
    setSelectedCardUuid(card.user_card_uuid);
    setLoading(true);

    try {
      onSubmit(card.user_card_uuid);
      onClose();
    } catch (err) {
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const renderCardItem = ({item}: {item: Card}) => (
    <TouchableOpacity
      style={[
        styles.cardItem,
        selectedCardUuid === item.user_card_uuid && styles.selectedCardItem,
      ]}
      onPress={() => handleCardSelect(item)}
      disabled={loading}>
      <View style={styles.cardDetails}>
        <Text style={styles.cardType}>{item.card_type}</Text>
        <Text style={styles.cardNumber}>
          **** **** **** {item.card_number.slice(-4)}
        </Text>
        <Text style={styles.expiry}>Expires: {item.expiry_date}</Text>
        {item.is_default && <Text style={styles.defaultLabel}>Default</Text>}
      </View>
      {selectedCardUuid === item.user_card_uuid && !loading && (
        <Icon name="check-circle" size={wp(6)} color="#FF00A7" />
      )}
      {loading && selectedCardUuid === item.user_card_uuid && (
        <ActivityIndicator size="small" color="#FF0080" />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {backgroundColor: theme.backgroundColor || '#fff'},
              ]}>
              <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled">
                <View style={styles.contentContainer}>
                  <View style={styles.headerContainer}>
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png',
                      }}
                      style={styles.stripeLogo}
                    />
                  </View>
                  <View style={styles.divider} />
                  <View style={{paddingHorizontal: wp(3)}}>
                    <Text
                      style={[styles.title, {color: theme.input || '#333'}]}>
                      Select a Card
                    </Text>
                    <FlatList
                      data={cards}
                      renderItem={renderCardItem}
                      keyExtractor={item => item.user_card_uuid}
                      ListEmptyComponent={
                        <Text
                          style={[
                            styles.emptyText,
                            {color: theme.input || '#666'},
                          ]}>
                          No saved cards found.
                        </Text>
                      }
                      style={styles.cardList}
                    />
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                        disabled={loading}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
      <CustomModal
        visible={errorModalVisible}
        title="Error"
        message="An unexpected error occurred while processing the card."
        onClose={() => setErrorModalVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: wp(5),
    paddingVertical: wp(2),
    borderColor: '#cccccc',
    borderWidth: 1,
    alignSelf: 'center',
    width: wp(90),
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: hp(3),
  },
  contentContainer: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stripeLogo: {
    width: wp(17),
    height: hp(3),
  },
  title: {
    fontSize: wp(6),
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: hp(2),
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginVertical: hp(2),
  },
  cardList: {
    flexGrow: 0,
    marginBottom: hp(2),
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(4),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: wp(2),
    marginBottom: hp(1.5),
  },
  selectedCardItem: {
    borderColor: '#FF00A7',
    borderWidth: 2,
  },
  cardDetails: {
    flex: 1,
  },
  cardType: {
    fontSize: wp(4),
    fontWeight: 'bold',
    color: '#333',
  },
  cardNumber: {
    fontSize: wp(3.5),
    color: '#666',
    marginTop: hp(0.5),
  },
  expiry: {
    fontSize: wp(3),
    color: '#999',
    marginTop: hp(0.5),
  },
  defaultLabel: {
    fontSize: wp(3),
    color: '#FF00A7',
    marginTop: hp(0.5),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp(2),
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    borderRadius: wp(2),
    alignItems: 'center',
    borderColor: '#30a7a7',
    borderWidth: 2,
    width: wp('30%'),
    paddingVertical: wp(2),
  },
  cancelText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: wp(4.5),
  },
  emptyText: {
    fontSize: wp(4),
    color: '#666',
    textAlign: 'center',
    marginVertical: hp(2),
  },
});

export default Cards;
