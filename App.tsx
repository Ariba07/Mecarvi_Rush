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
import ServiceProviderRegister from './src/screens/register/ServiceProviderRegister';
import ServiceProviderRegister3 from './src/screens/register/ServiceProviderRegister3';
import ServiceProviderRegister2 from './src/screens/register/ServiceProviderRegister2';
import ServiceProviderRegister1 from './src/screens/register/ServiceProviderRegister1';
import Subscription from './src/screens/subscription/Subscription';
import DrawerNavigator from './src/components/navigators/drawer/Drawer';
import Notification from './src/screens/notification/Notification';
import Service from './src/screens/service/Service';
import Search from './src/screens/search/Search';
import Address from './src/screens/address/Address';
import Message from './src/screens/message/Message';
import Tracking from './src/screens/tracking/Tracking';
import OrderDetails from './src/screens/orderDetail/OrderDetails';
import Review from './src/screens/review/Review';
import Support from './src/screens/support/Support';
import Profile from './src/screens/profile/Profile';
import Points from './src/screens/points/Points';
import Products from './src/screens/products/Products';
import Product from './src/screens/product/Product';

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
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
          <Stack.Screen name="Subscription" component={Subscription} />
          <Stack.Screen
            name="ServiceProviderRegister"
            component={ServiceProviderRegister}
          />
          <Stack.Screen
            name="ServiceProviderRegister1"
            component={ServiceProviderRegister1}
          />
          <Stack.Screen
            name="ServiceProviderRegister2"
            component={ServiceProviderRegister2}
          />
          <Stack.Screen
            name="ServiceProviderRegister3"
            component={ServiceProviderRegister3}
          />
          <Stack.Screen name="Notification" component={Notification} />
          <Stack.Screen name="Service" component={Service} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="Address" component={Address} />
          <Stack.Screen name="Message" component={Message} />
          <Stack.Screen name="Tracking" component={Tracking} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="Review" component={Review} />
          <Stack.Screen name="Points" component={Points} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Support" component={Support} />
          <Stack.Screen name="Product" component={Product} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
