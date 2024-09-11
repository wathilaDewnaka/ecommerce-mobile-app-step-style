import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import HomeScreen from './src/windows/HomeScreen';
import ProductDetails from './src/windows/ProductDetails';
import CartScreen from './src/windows/CartScreen';
import OrderScreen from './src/windows/OrderScreen';
import LoginScreen from './src/windows/LoginScreen';
import ShopContextProvider, { ShopContext } from './src/context/ShopContext';
import PlaceOrder from './src/windows/PlaceOrder';
import CheckoutScreen from './src/windows/CheckoutScreen';
import LoadingScreen from './src/windows/LoadingScreen';
import AccountScreen from './src/windows/AccountScreen';
import Toast from 'react-native-toast-message';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HOME">
      <Stack.Screen name="HOME" component={HomeScreen} />
      <Stack.Screen name="PRODUCT_DETAILS" component={ProductDetails} />
    </Stack.Navigator>
  );
}

function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="CART">
      <Stack.Screen name="CART" component={CartScreen} />
      <Stack.Screen name="PLACE_ORDER" component={PlaceOrder} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Loading" component={LoadingScreen}/>
    </Stack.Navigator>
  );
}

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'red',
      }}
    >
      <Tab.Screen
        name="HOME_STACK"
        component={HomeStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="home" size={size} color={color} />
          ),

          unmountOnBlur: true, // Unmount screen when it is not focus
        }}
      />
      <Tab.Screen
        name="CART_STACK"
        component={CartStack}
        options={{
          tabBarIcon: ({ size, color }) => (
            <MaterialCommunityIcons name="cart" size={size} color={color} />
          ),
          unmountOnBlur: true, // Unmount screen when it is not focus
        }}
      />
      <Tab.Screen
        name="ORDERS"
        component={OrderScreen}
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="shopping-bag" size={size} color={color} />
          ),
          unmountOnBlur: true, // Unmount screen when it is not focus
        }}

      />
      <Tab.Screen
        name="ACCOUNT"
        component={AccountScreen} // Replace with AccountScreen if available
        options={{
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
          unmountOnBlur: true, // Unmount screen when it is not focus
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ShopContextProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
      <Toast/>
    </ShopContextProvider>
  );
}

function AppContent() {
  const { token } = useContext(ShopContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // Update authentication status based on token
  React.useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

  }, [token]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="MAIN_APP" component={MainApp} />
      ) : (
        <Stack.Screen name="LOGIN">
          {() => <LoginScreen isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}  />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}
