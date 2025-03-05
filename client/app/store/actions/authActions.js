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

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });
    
    // API call to your authentication endpoint
    const response = await apiService.login(credentials);
    
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: response.userData
    });
  } catch (error) {
    dispatch({
      type: 'LOGIN_FAILURE',
      payload: error.message
    });
  }
};

export const createNewUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: 'CREATE_USER_REQUEST' });
    
    // API call to create a new user
    const response = await apiService.createUser(userData);
    
    dispatch({
      type: 'CREATE_USER_SUCCESS',
      payload: response.userData
    });
  } catch (error) {
    dispatch({
      type: 'CREATE_USER_FAILURE',
      payload: error.message
    });
  }
};

// Update profile action
export const updateUserProfile = (profileData) => async (dispatch, getState) => {
  try {
    dispatch({ type: 'UPDATE_PROFILE_REQUEST' });
    
    // Get user ID from current state
    const { user } = getState().auth;
    
    // API call to update profile
    const updatedProfile = await apiService.updateProfile(user.id, profileData);
    
    dispatch({
      type: 'UPDATE_USER_PROFILE',
      payload: updatedProfile
    });
  } catch (error) {
    dispatch({
      type: 'UPDATE_PROFILE_FAILURE',
      payload: error.message
    });
  }
};

// Async action for logging out
export const logoutUser = () => {
  return async (dispatch) => {
    try {
      dispatch(logout());
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
};