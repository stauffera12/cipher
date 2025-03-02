import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuthState } from '../store/actions/authActions';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';

// Import screens
import RegisterUser from '../../components/screens/CreateNewUserAuth/registerUser';
import UserDetails from '../../components/screens/CreateNewUserAuth/userDetails';
import InviteError from '../../components/screens/CreateNewUserAuth/inviteError'; // Import your error screen

const Stack = createStackNavigator();

// Deep link handler inside AppNavigator
const DeepLinkHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      let url = event.url;
      if (url) {
        const { path, queryParams } = Linking.parse(url) || {};
        
        // Handle normal invite with code
        if (queryParams?.code) {
          console.log('Deep link activated with invite code:', queryParams.code);
          navigation.navigate('RegisterUser', { inviteCode: queryParams.code });
        } 
        // Handle invite error cases
        else if (path === 'invite/error') {
          // Extract error reason if available
          const reason = queryParams?.reason || 'unknown';
          console.log('Deep link error with reason:', reason);
          navigation.navigate('InviteError', { reason });
        }
        // Handle invite without code (implicit error)
        else if (path === 'invite') {
          console.log('Deep link without invite code');
          navigation.navigate('InviteError', { reason: 'missing_code' });
        }
      }
    };

    // Listen for deep link events while app is running
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Handle deep link if app was opened from an invite link (cold start)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove(); // Proper cleanup
    };
  }, [navigation]);

  return null; // This component does not render anything
};

// Stack navigator for authentication flows
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RegisterUser" component={RegisterUser} />
    <Stack.Screen 
    name="InviteError" 
    component={InviteError} 
    options={{ 
      gestureEnabled: false,
      headerLeft: () => null,  // This removes the back button if header is shown
      animationEnabled: true   // Keep animations for better UX
    }}
  />
  </Stack.Navigator>
);

// Stack navigator for main app screens
const InternalNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserDetails" component={UserDetails} />
  </Stack.Navigator>
);

// Root navigator that decides between auth and main flows
const AppNavigator = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthState()); // Check auth state when app starts
  }, [dispatch]);

  return (
    <>
      <DeepLinkHandler />
      {isAuthenticated ? <InternalNavigator /> : <AuthNavigator />}
    </>
  );
};

export default AppNavigator;