// App.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar, Platform} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import {Provider} from 'react-redux';
import store from './Store'; // Ensure this is correctly typed or imported
import Splash from './src/screens/splash/Splash';
import OnBoard from './src/screens/onBoard/OnBoard';
import {RootStackParamList} from './src/components/types/screenTypes/ScreenTypes';
import Login from './src/screens/login/Login';
import Forget from './src/screens/forget/Forget';
import Reset from './src/screens/password/Reset';
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
import Quote from './src/screens/quote/Quote';
import ServicesProducts from './src/screens/services/ServicesProducts';
import ProductPrice from './src/screens/productPrice/ProductPrice';
import ServiceProviderOrderDetail from './src/screens/orderDetail/ServiceProviderOrderDetail';
import ServiceProviderProfile from './src/screens/profile/ServiceProviderProfile';
import Wallet from './src/screens/wallet/Wallet';
import Withdraw from './src/screens/withdraw/Withdraw';
import WithdrawBalance from './src/screens/withdraw_balance/WithdrawBalance';
import WithdrawConfirm from './src/screens/popups/WithdrawConfirm';
import Cart from './src/screens/cart/Cart';
import Schedule from './src/screens/schedule/Schedule';
import Booking from './src/screens/booking/Booking';
import Checkout from './src/screens/checkout/Checkout';
import Receipt from './src/screens/popups/SuccessPayment';
import MarketPlace from './src/screens/marketPlace/MarketPlace';
import ShopProfile from './src/screens/shop/ShopProfile';
import {ThemeProvider} from './src/components/helperUtils/theme/ThemeContext';

// Define the Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const STRIPE_KEY =
  'pk_test_51R2R3sQGkbRqDEDibvMt3ZizRgvwrFvgYMYsxSUEM6PEBv0adSrxBLdvJWgG5bvOHUwhZcAX3QeKTXxO06dvfTSH00KrElXiGO';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_KEY}>
        <ThemeProvider>
          {/* Wrap everything with ThemeProvider */}
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
              <Stack.Screen name="Quote" component={Quote} />
              <Stack.Screen name="Services" component={ServicesProducts} />
              <Stack.Screen name="ProductPrice" component={ProductPrice} />
              <Stack.Screen
                name="ServiceProviderOrderDetail"
                component={ServiceProviderOrderDetail}
              />
              <Stack.Screen
                name="ServiceProviderProfile"
                component={ServiceProviderProfile}
              />
              <Stack.Screen name="Wallet" component={Wallet} />
              <Stack.Screen name="Withdraw" component={Withdraw} />
              <Stack.Screen
                name="WithdrawBalance"
                component={WithdrawBalance}
              />
              <Stack.Screen
                name="WithdrawConfirm"
                component={WithdrawConfirm}
              />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen name="Schedule" component={Schedule} />
              <Stack.Screen name="Checkout" component={Checkout} />
              <Stack.Screen name="Booking" component={Booking} />
              <Stack.Screen name="Receipt" component={Receipt} />
              <Stack.Screen name="MarketPlace" component={MarketPlace} />
              <Stack.Screen name="ShopProfile" component={ShopProfile} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </StripeProvider>
    </Provider>
  );
};

export default App;
