import {ConfigContext, ExpoConfig} from '@expo/config';

/**
 * Builds the Expo config for the app.
 *
 * @param context - The config Expo has read so far.
 * @returns The Expo config.
 */
export default (context: ConfigContext): ExpoConfig => {
  const {config} = context;

  return {
    ...config,
    name: 'App',
    slug: 'app',
    version: '1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    ios: {
      bundleIdentifier: 'com.example.app',
    },
    android: {
      package: 'com.example.app',
    },
  };
};
