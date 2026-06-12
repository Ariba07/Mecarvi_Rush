import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Icon} from 'react-native-elements';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { styles } from './styles';

type Plan = {
  id: string;
  title: string;
  price: string;
  unit_amount: number;
  features: string[];
};

interface PlanCardProps {
  plan: Plan;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  theme: any;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  index,
  isSelected,
  onSelect,
  theme,
}) => {
  return (
    <Animatable.View
      key={plan.id}
      animation="fadeInUp"
      duration={1000}
      delay={600 + index * 200}>
      <TouchableOpacity
        style={[
          styles.card,
          isSelected && styles.selectedCard,
          {backgroundColor: theme.backgroundColor},
        ]}
        onPress={onSelect}>
        <View style={styles.cardHeader}>
          <Text style={[styles.planTitle, {color: theme.text}]}>
            {plan.title}
          </Text>
          <Text style={styles.planPrice}>{plan.price}</Text>
        </View>
        {plan.features.map((feature, featureIndex) => (
          <Animatable.View
            key={featureIndex}
            animation="fadeIn"
            duration={800}
            delay={900 + featureIndex * 100}>
            <View style={styles.feature}>
              <Icon
                name="checkbox"
                size={wp(4.5)}
                color="green"
                type="ionicon"
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          </Animatable.View>
        ))}
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default PlanCard;
