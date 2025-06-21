import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useNavigation} from '@react-navigation/native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {RootStackParamList} from '../../components/types/screenTypes/ScreenTypes';
import SideMenu from '../../assets/images/SideMenu.svg';
import {ThemeContext} from '../../components/helperUtils/theme/ThemeContext';
import {styles} from '../../assets/styles/dashboard/DashboardStyles';

interface HeaderTabsProps {
  selectedTab: 'prints' | 'rentals';
  setSelectedTab: (tab: 'prints' | 'rentals') => void;
}

const HeaderTabs: React.FC<HeaderTabsProps> = ({
  selectedTab,
  setSelectedTab,
}) => {
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();
  const {theme} = React.useContext(ThemeContext);

  return (
    <Animatable.View animation="fadeInDown" duration={1000}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <SideMenu />
        </TouchableOpacity>
        <View style={styles.tabsContainer}>
          <Animatable.View
            animation={selectedTab === 'prints' ? 'bounceIn' : 'fadeIn'}
            duration={300}>
            <TouchableOpacity
              onPress={() => setSelectedTab('prints')}
              style={[
                styles.tab,
                selectedTab === 'prints' && styles.selectedTabStyle,
              ]}>
              <Text
                style={[
                  styles.title,
                  selectedTab === 'prints'
                    ? styles.selectedTabText
                    : {color: theme.text || '#333'},
                ]}>
                Prints
              </Text>
            </TouchableOpacity>
          </Animatable.View>
          <Animatable.View
            animation={selectedTab === 'rentals' ? 'bounceIn' : 'fadeIn'}
            duration={300}>
            <TouchableOpacity
              onPress={() => setSelectedTab('rentals')}
              style={[
                styles.tab,
                selectedTab === 'rentals' && styles.selectedTabStyle,
              ]}>
              <Text
                style={[
                  styles.title,
                  selectedTab === 'rentals'
                    ? styles.selectedTabText
                    : {color: theme.text || '#333'},
                ]}>
                Rentals
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </View>
    </Animatable.View>
  );
};

export default HeaderTabs;
