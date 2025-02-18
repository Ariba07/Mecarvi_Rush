import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideMenu from '../../../screens/sideMenu/SideMenu';
import BottomTabs from '../bottomTabs/BottomTabs';

const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => <SideMenu {...props} />;

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '65%',
          borderRadius: 0,
        },
        swipeEnabled: false,
        drawerType: 'front',
        overlayColor: 'rgba(255,255,255,0.2)',
      }}>
      <Drawer.Screen name="BottomTabs" component={BottomTabs} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
