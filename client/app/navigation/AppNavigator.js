import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthState } from '../store/actions/authActions';

// Import screens
import LoginScreen from '../../components/screens/LoginScreen';
import HomeScreen from '../../components/screens/HomeScreen';

const Stack = createStackNavigator();

// Stack navigator for authentication flows
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    {/* Add other auth screens here if needed */}
  </Stack.Navigator>
);

// Stack navigator for main app screens
const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    {/* Add other app screens here */}
  </Stack.Navigator>
);

// Root navigator that decides between auth and main flows
const AppNavigator = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Check if user is already authenticated when app starts
    dispatch(checkAuthState());
  }, [dispatch]);

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;