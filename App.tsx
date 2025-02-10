import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, Platform} from 'react-native'; // Import StatusBar and Platform
import Splash from './src/screens/splash/Splash';
import OnBoard from './src/screens/onBoard/OnBoard';
import {RootStackParamList} from './src/components/types/screenTypes/ScreenTypes';
import Login from './src/screens/login/Login';
import Forget from './src/screens/forget/Forget';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          navigationBarHidden: Platform.OS === 'android',
          animation: 'simple_push',
        }}>
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="OnBoard" component={OnBoard} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Forget" component={Forget} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
