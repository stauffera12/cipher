import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}