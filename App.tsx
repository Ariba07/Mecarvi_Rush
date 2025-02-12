import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, Platform} from 'react-native'; // Import StatusBar and Platform
import Splash from './src/screens/splash/Splash';
import OnBoard from './src/screens/onBoard/OnBoard';
import {RootStackParamList} from './src/components/types/screenTypes/ScreenTypes';
import Login from './src/screens/login/Login';
import Forget from './src/screens/forget/Forget';
import Reset from './src/screens/password/Reset';
import {Provider} from 'react-redux';
import store from './Store';
import Verify from './src/screens/verification/Verify';
import Options from './src/screens/registerOption/Options';
import Register from './src/screens/register/Register';
import Upload, {Card, Photo} from './src/screens/upload/Upload';
import Dashboard from './src/screens/dashboard/Dashboard';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
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
          <Stack.Screen name="Verify" component={Verify} />
          <Stack.Screen name="Reset" component={Reset} />
          <Stack.Screen name="Options" component={Options} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Upload" component={Upload} />
          <Stack.Screen name="Card" component={Card} />
          <Stack.Screen name="Photo" component={Photo} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
