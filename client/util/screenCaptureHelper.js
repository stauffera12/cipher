import { preventScreenCaptureAsync, addScreenshotListener, allowScreenCaptureAsync } from 'expo-screen-capture';

export const preventCapture = async () => {
  return await preventScreenCaptureAsync();
};

export const addListener = (callback) => {
  return addScreenshotListener(callback);
};

export const allowCapture = async () => {
  return await allowScreenCaptureAsync();
};