import 'react-native-url-polyfill/auto';
import './global.css';

import {setApiEnv} from '@smarty-app/api-controller';
import {Config} from '@smarty-app/core';
import {registerRootComponent} from 'expo';
import {enableScreens} from 'react-native-screens';

import App from './app/App';
import {initializeMockApi} from './app/mockApi';

enableScreens();

Config.initialize({
  apiBaseUrl: process.env.EXPO_PUBLIC_DX_API_BASE_URL as string,
});

setApiEnv({
  timeout: 20000,
});

initializeMockApi();

// Registers the component as 'main', which the generated native projects launch.
registerRootComponent(App);
