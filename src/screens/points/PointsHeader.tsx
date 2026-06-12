import React from 'react';
import {View} from 'react-native';
import * as Progress from 'react-native-progress';
import Container from '../../assets/images/container.svg';
import {ThemeContext} from '../../context/ThemeContext';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {styles} from '../../assets/styles/points/PointsStyles';
import * as Animatable from 'react-native-animatable';

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
  const pointsToDollar = redeemValue; // Use redeemValue directly
  console.log(loyaltyPoints, redeemValue, pointsToDollar);

  return (
    <View style={styles.containerWrapper}>
      <Container width={'100%'} height={hp(20)} />
      <View style={styles.overlay}>
        <Animatable.Text
          animation="fadeIn"
          duration={600}
          style={styles.userName}>
          Chris Adam
        </Animatable.Text>
        <Animatable.Text
          animation="fadeIn"
          duration={600}
          delay={200}
          style={styles.pointsText}>
          ✨ {totalPoints} Points
        </Animatable.Text>
        <Animatable.Text
          animation="fadeIn"
          duration={600}
          delay={400}
          style={styles.subText}>
          Collect more points to unlock gold
        </Animatable.Text>
        <Animatable.View animation="fadeIn" duration={600} delay={600}>
          <Progress.Bar
            progress={progress}
            width={wp(80)}
            height={hp(1)}
            color="#FF007A"
            unfilledColor={theme.backgroundColor}
            borderWidth={0}
            borderRadius={8}
          />
        </Animatable.View>
        <Animatable.Text
          animation="fadeIn"
          duration={600}
          delay={800}
          style={styles.conversionText}>
          1 Point = ${pointsToDollar.toFixed(2)}
        </Animatable.Text>
      </View>
    </View>
  );
};

export default PointsHeader;
