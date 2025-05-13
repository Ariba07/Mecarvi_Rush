import React from 'react';
import {View, Text} from 'react-native';
import * as Progress from 'react-native-progress';
import Container from '../../assets/images/container.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/points/PointsStyles';

interface PointsHeaderProps {
  totalPoints: number;
  usedPoints: number;
  loyaltyPoints: number;
  redeemValue: number;
}

const PointsHeader: React.FC<PointsHeaderProps> = ({
  totalPoints,
  usedPoints,
  loyaltyPoints,
  redeemValue,
}) => {
  const {theme} = React.useContext(ThemeContext);
  const progress = (usedPoints ?? 0) / (totalPoints || 1);
  const pointsToDollar = loyaltyPoints * redeemValue;

  return (
    <View style={styles.containerWrapper}>
      <Container width={'100%'} height={hp(20)} />
      <View style={styles.overlay}>
        <Text style={styles.userName}>Chris Adam</Text>
        <Text style={styles.pointsText}>✨ {totalPoints} Points</Text>
        <Text style={styles.subText}>Collect more points to unlock gold</Text>
        <Progress.Bar
          progress={progress}
          width={wp(80)}
          height={hp(1)}
          color="#FF007A"
          unfilledColor={theme.backgroundColor}
          borderWidth={0}
          borderRadius={8}
        />
        <Text style={styles.conversionText}>
          1 Point = ${pointsToDollar.toFixed(2)}
        </Text>
      </View>
    </View>
  );
};

export default PointsHeader;
