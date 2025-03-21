import React from 'react';
import {View, TouchableOpacity, Text, Animated, Easing} from 'react-native';
import {styles} from '../../assets/styles/product/Product';
import {tabs} from './Product';

interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  translateX: Animated.Value;
  theme: any;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  translateX,
  theme,
}) => {
  const animateUnderline = (index: number) => {
    setActiveTab(index);
    Animated.timing(translateX, {
      toValue: index * (styles.tabButton.width || 0),
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  };

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          style={styles.tabButton}
          onPress={() => animateUnderline(index)}>
          <Text
            style={[
              styles.tabText,
              activeTab === index && [
                styles.activeTabText,
                {color: theme.input},
              ],
            ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
      <Animated.View style={[styles.underline, {transform: [{translateX}]}]} />
    </View>
  );
};

export default TabNavigation;
