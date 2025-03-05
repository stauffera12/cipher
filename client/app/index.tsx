import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ScreenCapture from 'expo-screen-capture';
import store, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
import AppNavigator from './navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';

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
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <View style={styles.container}>
            {/* Using translucent status bar with light content */}
            <StatusBar translucent backgroundColor='black'/>
            <AppNavigator />
          </View>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Your black background
  },
});