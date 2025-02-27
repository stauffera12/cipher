import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  // Middleware is automatically configured with sensible defaults
  // If you need custom middleware:
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(yourCustomMiddleware)
});

export default store;