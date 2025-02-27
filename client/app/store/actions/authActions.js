import AsyncStorage from '@react-native-async-storage/async-storage';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

// Simple action creators
export const loginSuccess = (userData) => ({
  type: LOGIN_SUCCESS,
  payload: userData
});

export const loginFailure = (error) => ({
  type: LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: LOGOUT
});

// Async action to check if user is already authenticated
export const checkAuthState = () => {
  return async (dispatch) => {
    try {
      // Check if user is already authenticated using AsyncStorage
      const isRegistered = await AsyncStorage.getItem('userRegistered');
      
      if (isRegistered === 'true') {
        // We could fetch additional user data here from AsyncStorage if needed
        const userData = {
          id: '1',
          name: 'Cipher User',
          // Add other user data as needed
        };
        
        dispatch(loginSuccess(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  };
};

// Async action for logging out
export const logoutUser = () => {
  return async (dispatch) => {
    try {
      // Clear authentication state in AsyncStorage
      await AsyncStorage.removeItem('userRegistered');
      // You may want to keep preferred auth method
      
      dispatch(logout());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
};