import React from 'react';
import {View, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {styles} from '../../assets/styles/product/Product';

interface TabContentProps {
  activeTab: number;
  dynamicSpecifications: any[];
  refundPolicy?: string;
  theme: any;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  dynamicSpecifications,
  refundPolicy,
  theme,
}) => (
  <Animatable.View
    animation="fadeIn"
    duration={600}
    key={activeTab} // Key ensures animation retriggers on tab change
    style={styles.contentContainer}>
    {activeTab === 0 && (
      <View>
        {dynamicSpecifications.map((item, index) => (
          <Animatable.View
            key={index}
            animation="fadeInUp"
            duration={600}
            delay={index * 100}
            style={styles.specRow}>
            <Text style={[styles.specLabel, {color: theme.text}]}>
              {item.label}:
            </Text>
            <Text style={styles.specValue}>{item.value}</Text>
          </Animatable.View>
        ))}
      </View>
    )}
    {activeTab === 1 && (
      <Text style={[styles.policyText, {color: theme.text}]}>
        {refundPolicy || 'No refund policy available.'}
      </Text>
    )}
  </Animatable.View>
);

export default TabContent;
