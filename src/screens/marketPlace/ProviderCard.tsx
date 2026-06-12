/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {BusinessProvider} from '../../types/navigation';
import {styles} from '../../assets/styles/bidList/BidListStyles';

interface ProviderCardProps {
  item: BusinessProvider;
  onAccept: (item: BusinessProvider) => void;
  onReject: (quote_bid_uuid: string) => void;
  acceptedBidUuid: string | null;
  isAnyBidAccepted: boolean;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  item,
  onAccept,
  onReject,
  acceptedBidUuid,
  isAnyBidAccepted,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const isAccepted = item.quote_bid_uuid === acceptedBidUuid;
  const isDisabled = isAnyBidAccepted && !isAccepted;

  return (
    <View
      style={[
        styles.providerCard,
        {backgroundColor: theme.backgroundColor},
        isDisabled && {opacity: 0.5},
      ]}>
      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => onReject(item.quote_bid_uuid)}
        disabled={isDisabled || isAccepted}>
        <Icon
          name="close"
          size={wp(5)}
          color={
            isDisabled || isAccepted ? '#cccccc' : theme.input || '#ff00a7'
          } // Fallback color
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.providerContent}
        onPress={() => {
          console.warn(
            'Cannot navigate to ShopProfile: service_provider_user_uuid is undefined',
          );
        }}
        disabled={isDisabled}>
        <Image
          source={{uri: item.logo}}
          style={styles.providerImage}
          resizeMode="cover"
          onError={() =>
            console.warn(
              `Failed to load image for ${item.service_provider_name}`,
            )
          }
        />
        <View style={styles.providerInfo}>
          <Text style={[styles.providerName, {color: theme.text}]}>
            {item.service_provider_name}
          </Text>

          <View style={styles.row}>
            <Text style={[styles.price, {color: theme.input}]}>
              {item.price}
            </Text>
            <TouchableOpacity
              style={[
                styles.acceptButton,
                isAccepted && {backgroundColor: '#4CAF50'},
                isDisabled && {backgroundColor: '#cccccc'},
              ]}
              onPress={() => onAccept(item)}
              disabled={isDisabled || isAccepted}>
              <Text style={styles.acceptButtonText}>
                {isAccepted ? 'Accepted' : 'Accept'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProviderCard;
