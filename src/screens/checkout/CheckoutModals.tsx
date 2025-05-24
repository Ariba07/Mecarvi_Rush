import React from 'react';
import {Modal, View, Text, TouchableOpacity, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import CustomButton from '../../components/common/buttons/CustomButton';
import {styles} from '../../assets/styles/checkout/CheckoutStyles';
import {UserCard} from './types';

interface CardSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  userCards: UserCard[];
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;
  onChoose: () => void;
  onAddNewCard: () => void;
  theme: any;
}

const CardSelectionModal: React.FC<CardSelectionModalProps> = ({
  isVisible,
  onClose,
  userCards,
  selectedCardId,
  setSelectedCardId,
  onChoose,
  onAddNewCard,
  theme,
}) => {
  const renderCardItem = ({item}: {item: UserCard}) => (
    <TouchableOpacity
      style={[
        styles.cardItem,
        {backgroundColor: theme.backgroundColor},
        selectedCardId === item.user_card_uuid && styles.selectedCardItem,
      ]}
      onPress={() => setSelectedCardId(item.user_card_uuid)}>
      <View style={styles.cardDetails}>
        <Text style={[styles.cardText, {color: theme.text}]}>
          {item.brand} ending in {item.last4}
        </Text>
        <Text style={[styles.cardSubText, {color: theme.text}]}>
          Expires {item.exp_month}/{item.exp_year}
        </Text>
      </View>
      {selectedCardId === item.user_card_uuid && (
        <Icon name="check-circle" size={wp(6)} color="#FF00A7" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, {backgroundColor: theme.whole}]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, {color: theme.text}]}>
              Select Payment Card
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={wp(7)} color={theme.text} />
            </TouchableOpacity>
          </View>
          {userCards.length > 0 ? (
            <>
              <FlatList
                data={userCards}
                renderItem={renderCardItem}
                keyExtractor={item => item.user_card_uuid}
                style={styles.cardList}
              />
              <View>
                <CustomButton title="Choose" onPress={onChoose} />
                <CustomButton title="Add New Card" onPress={onAddNewCard} />
              </View>
            </>
          ) : (
            <View style={styles.noCardsContainer}>
              <Text style={[styles.noCardsText, {color: theme.text}]}>
                No cards available
              </Text>
              <CustomButton title="Add New Card" onPress={onAddNewCard} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default CardSelectionModal;
