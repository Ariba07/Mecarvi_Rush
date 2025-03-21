import React from 'react';
import {View, Text} from 'react-native';
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
  <View style={styles.contentContainer}>
    {activeTab === 0 && (
      <View>
        {dynamicSpecifications.map((item, index) => (
          <View key={index} style={styles.specRow}>
            <Text style={[styles.specLabel, {color: theme.text}]}>
              {item.label}:
            </Text>
            <Text style={styles.specValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    )}
    {activeTab === 1 && (
      <Text style={styles.policyText}>
        {refundPolicy || 'No refund policy available.'}
      </Text>
    )}
    {activeTab === 2 && (
      <Text style={styles.contentText}>No Reviews Found</Text>
    )}
  </View>
);

export default TabContent;
