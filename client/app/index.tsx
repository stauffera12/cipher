import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import * as ScreenCapture from 'expo-screen-capture';
import store from './store/store';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const activateProtection = async () => {
      await ScreenCapture.preventScreenCaptureAsync();
      console.log('Screen capture prevention activated');
    };

    activateProtection();

    const subscription = ScreenCapture.addScreenshotListener(() => {
      activateProtection();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {/* ✅ No need to wrap NavigationContainer here since AppNavigator should handle it */}
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}