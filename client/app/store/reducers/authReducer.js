import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../actions/authActions';

const initialState = {
  isAuthenticated: false,
  user: null,
  isNewUser: null, //change to true for newuser route
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isNewUser: null,
        error: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: null,
        user: null,
        isNewUser: null,
        error: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isNewUser: null,
        error: null
      };
      case 'SET_NEW_USER':
      return {
        ...state,
        isNewUser: action.payload
      };
      case 'UPDATE_USER_PROFILE':
        return {
          ...state,
          user: {
            ...state.user,
            ...action.payload // Merge updated profile fields
          }
      };
      case 'CREATE_USER_REQUEST':
        return {
          ...state,
          loading: true,
          error: null
        };
      case 'CREATE_USER_SUCCESS':
        return {
          ...state,
          isAuthenticated: true,
          isNewUser: false,  //when the user returns later, if we store isNewUser as part of their data and they try to login, this may take them through the NewUserNavigator path because once their data is pulled it will read the false and redirect
          user: action.payload,
          loading: false,
          error: null
        };
      case 'CREATE_USER_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload
        };
    default:
      return state;
  }
};

export default authReducer;