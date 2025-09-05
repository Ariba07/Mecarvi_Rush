import React, {useEffect} from 'react';
import {RootStackParamList} from './src/components/types/screenTypes/ScreenTypes';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  LinkingOptions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {Linking, Platform, StatusBar} from 'react-native';
import {StripeProvider} from '@stripe/stripe-react-native';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import DrawerNavigator from './src/components/navigators/drawer/Drawer';
import Address from './src/screens/address/Address';
import Booking from './src/screens/booking/Booking';
import Cart from './src/screens/cart/Cart';
import Checkout from './src/screens/checkout/Checkout';
import DisputeChat from './src/screens/disputes/DisputeChat';
import Disputes from './src/screens/disputes/Disputes';
import Feedback from './src/screens/feedback/Feedback';
import Forget from './src/screens/forget/Forget';
import Password from './src/screens/forget/Password';
import Login from './src/screens/login/Login';
import BidList from './src/screens/marketPlace/BidList';
import MarketPlace from './src/screens/marketPlace/MarketPlace';
import Message from './src/screens/message/Message';
import Notification from './src/screens/notification/Notification';
import OnBoard from './src/screens/onBoard/OnBoard';
import OrderIndex from './src/screens/orders/OrderIndex';
import Points from './src/screens/points/Points';
import Receipt from './src/screens/popups/SuccessPayment';
import Product from './src/screens/product/Product';
import Products from './src/screens/products/Products';
import Profile from './src/screens/profile/Profile';
import Quote from './src/screens/quote/Quote';
import Register from './src/screens/register/Register';
import Review from './src/screens/review/Review';
import Schedule from './src/screens/schedule/Schedule';
import Search from './src/screens/search/Search';
import Childcategories from './src/screens/service/Childcategories';
import Service from './src/screens/service/Service';
import SubChildCategories from './src/screens/service/SubChildCategories';
import ShopProfile from './src/screens/shop/ShopProfile';
import Splash from './src/screens/splash/Splash';
import Subscription from './src/screens/subscription/Subscription';
import Support from './src/screens/support/Support';
import AllTicket from './src/screens/ticketSupport/AllTicket';
import CreateTicket from './src/screens/ticketSupport/CreateTicket';
import Ticket from './src/screens/ticketSupport/Ticket';

import Verify from './src/screens/verification/Verify';
import {store, persistor} from './Store';
import {ThemeProvider} from './src/components/helperUtils/theme/ThemeContext';
import {Card} from './src/screens/upload/Card';
import {Photo} from './src/screens/upload/Photo';
import Upload from './src/screens/upload/Upload';

const Stack = createNativeStackNavigator<RootStackParamList>();

const STRIPE_KEY =
  'pk_test_51R2R3sQGkbRqDEDibvMt3ZizRgvwrFvgYMYsxSUEM6PEBv0adSrxBLdvJWgG5bvOHUwhZcAX3QeKTXxO06dvfTSH00KrElXiGO';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [
    'mecarvirush://',
    'https://www.mecarvirush.com',
    'http://www.mecarvirush',
  ],
  config: {
    screens: {
      Checkout: {
        path: 'cancel',
      },
      Receipt: {
        path: 'success',
      },
      Password: {
        path: 'reset-password/:token?/:email?', // Support both path and query params
      },
    },
  },
};

// Utility function to parse URL query parameters
const parseQueryParams = (url: string): {[key: string]: string} => {
  const queryString = url.split('?')[1];
  if (!queryString) {
    return {};
  }
  const params: {[key: string]: string} = {};
  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) {
      params[key] = decodeURIComponent(value);
    }
  });
  return params;
};

// Utility function to extract path and params
const parseDeepLink = (url: string) => {
  const pathMatch = url.match(
    /^(?:mecarvirush|https?:\/\/www\.mecarvirush\.com|http:\/\/www\.mecarvirush)\/reset-password(?:\/([^/]+)\/([^/]+))?\/?$/,
  );
  const queryParams = parseQueryParams(url);
  return {
    path: pathMatch ? 'reset-password' : '',
    pathParams: pathMatch ? {token: pathMatch[1], email: pathMatch[2]} : {},
    queryParams,
  };
};

const AppContent: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const handleDeepLink = (event: {url: string}) => {
      const {path, pathParams, queryParams} = parseDeepLink(event.url);
      if (path === 'reset-password') {
        // Prioritize query parameters (?token=...&email=...)
        if (queryParams.token && queryParams.email) {
          navigation.navigate('Password', {
            token: queryParams.token,
            email: queryParams.email,
          });
        }
        // Fallback to path parameters (reset-password/<token>/<email>)
        else if (pathParams.token && pathParams.email) {
          navigation.navigate('Password', {
            token: pathParams.token,
            email: pathParams.email,
          });
        }
        // Handle case with only token
        else if (queryParams.token || pathParams.token) {
          navigation.navigate('Password', {
            token: (queryParams.token || pathParams.token) ?? '',
            email: queryParams.email || pathParams.email || '',
          });
        }
      }
    };

    // Handle initial URL when app is opened from a deep link
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });

    // Handle URL when app is already open
    Linking.addEventListener('url', handleDeepLink);

    // Cleanup listener on unmount
    return () => {
      Linking.removeAllListeners('url');
    };
  }, [navigation]);

  return (
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
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Verify" component={Verify} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="Card" component={Card} />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="Service" component={Service} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Review" component={Review} />
      <Stack.Screen name="Points" component={Points} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Quote" component={Quote} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Schedule" component={Schedule} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Booking" component={Booking} />
      <Stack.Screen name="Receipt" component={Receipt} />
      <Stack.Screen name="MarketPlace" component={MarketPlace} />
      <Stack.Screen name="ShopProfile" component={ShopProfile} />
      <Stack.Screen name="Orders" component={OrderIndex} />
      <Stack.Screen name="AcceptBid" component={BidList} />
      <Stack.Screen name="Ticket" component={Ticket} />
      <Stack.Screen name="Feedback" component={Feedback} />
      <Stack.Screen name="AllTicket" component={AllTicket} />
      <Stack.Screen name="CreateTicket" component={CreateTicket} />
      <Stack.Screen name="ChildCategories" component={Childcategories} />
      <Stack.Screen name="SubChildCategories" component={SubChildCategories} />
      <Stack.Screen name="Disputes" component={Disputes} />
      <Stack.Screen name="DisputeChat" component={DisputeChat} />
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider publishableKey={STRIPE_KEY}>
          <ThemeProvider>
            <NavigationContainer linking={linking}>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
              />
              <AppContent />
            </NavigationContainer>
          </ThemeProvider>
        </StripeProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
