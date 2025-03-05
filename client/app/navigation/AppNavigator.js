import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import * as Linking from 'expo-linking';
import { useNavigation } from '@react-navigation/native';

// Import screens
import RegisterUser from '../../components/screens/CreateNewUserAuth/registerUser';
import UserDetails from '../../components/screens/CreateNewUserAuth/userDetails';
import InviteError from '../../components/screens/CreateNewUserAuth/inviteError';
import TermsConditions from '../../components/screens/OtherPages/terms_conditions';
import PrivacyPolicy from '../../components/screens/OtherPages/privacy_policy';
import CustomAnonymitySettings from '../../components/screens/CreateNewUserAuth/customAnonymity';
import GlobalNetwork from '../../components/screens/UserProfile/globalNetworkPage';
import Profile from '../../components/screens/UserProfile/profilePage';
import LoginPage from '../../components/screens/ExistingUserAuth/loginPage';

const Stack = createStackNavigator();

// Deep link handler inside AppNavigator
const DeepLinkHandler = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleDeepLink = (event) => {
      let url = event.url;
      if (url) {
        const { path, queryParams } = Linking.parse(url) || {};
        
        // Handle normal invite with code
        if (queryParams?.code) {
          console.log('Deep link activated with invite code:', queryParams.code);
          // Set isNewUser to true when invite code is detected
          dispatch({ type: 'SET_NEW_USER', payload: true });
          navigation.navigate('RegisterUser', { inviteCode: queryParams.code });
        } 
        // Handle invite error cases
        else if (path === 'invite/error') {
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
      if (url) {
        handleDeepLink({ url });
      } else {
        // If no deep link, ensure isNewUser is false
        dispatch({ type: 'SET_NEW_USER', payload: false });
      }
    });

    return () => {
      subscription.remove(); // Proper cleanup
    };
  }, [navigation, dispatch]);

  return null;
};

const MainAppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GlobalNetwork" component={GlobalNetwork} />
    <Stack.Screen name="Profile" component={Profile} />
    {/* Other tabs */}
  </Stack.Navigator>
);

// Stack navigator for authentication flows
const NewUserNavigator = () => (
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
    <Stack.Screen name="UserDetails" component={UserDetails} />
    <Stack.Screen name="CustomAnonymitySettings" component={CustomAnonymitySettings} />
    <Stack.Screen name="TermsConditions" component={TermsConditions} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
    <Stack.Screen name="MainApp" component={MainAppNavigator} />
  </Stack.Navigator>
);

const ExistingUserNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginPage} />
    <Stack.Screen name="GlobalNetwork" component={GlobalNetwork} />
    <Stack.Screen name="Profile" component={Profile} />
      {/* Other tabs */}
  </Stack.Navigator>
)

// Root navigator that decides between auth and main flows
const AppNavigator = () => {
  const { isNewUser } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  // Initial app start - set isNewUser to false by default
  useEffect(() => {
    // Only set on initial app load
    console.log(isNewUser);
  }, [isNewUser]);

  return (
    <>
      <DeepLinkHandler />
      {isNewUser === true || isNewUser === false ? (
        <NewUserNavigator />
      ) : isNewUser === null ? (
        <ExistingUserNavigator />
      ) : (
        <InviteError />
      )}
    </>
  );
};

export default AppNavigator;