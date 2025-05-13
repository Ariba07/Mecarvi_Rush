import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useDispatch} from 'react-redux';
import {setServiceProviderUuid} from '../../slice/Slice';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';

import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {BusinessProvider} from '../../components/types/screenTypes/ScreenTypes';
import {styles} from '../../assets/styles/bidList/BidListStyles';

interface ProviderCardProps {
  item: BusinessProvider;
  onAccept: (item: BusinessProvider) => void;
  onReject: (quote_bid_uuid: string) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  item,
  onAccept,
  onReject,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const dispatch = useDispatch();

  return (
    <View
      style={[styles.providerCard, {backgroundColor: theme.backgroundColor}]}>
      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => onReject(item.quote_bid_uuid)}>
        <Icon name="close" size={wp(5)} color={theme.input} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.providerContent}
        onPress={() => {
          console.warn(
            'Cannot navigate to ShopProfile: service_provider_user_uuid is undefined',
          );
          dispatch(
            setServiceProviderUuid(
              item.service_provider_uuid || item.quote_bid_uuid,
            ),
          );
        }}>
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
          <Text style={[styles.address, {color: theme.text}]}>
            Address: {item.address || 'N/A'}
          </Text>
          <View style={styles.row}>
            <Text style={[styles.price, {color: theme.input}]}>
              {item.price}
            </Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => onAccept(item)}>
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ProviderCard;
