const {withNxMetro} = require('@nx/expo');
// Expo SDK 55+ ships Metro via `@expo/metro`. `getDefaultConfig` and
// `mergeConfig` must come from the Expo-provided Metro instance.
const {getDefaultConfig} = require('expo/metro-config');
const {mergeConfig} = require('@expo/metro/metro-config');
const {withNativeWind} = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  // EXPO_PUBLIC_ values are inlined at transform time but are not part of Metro's cache key,
  // so a store build could otherwise reuse a Firebase build's cached transforms.
  cacheVersion: [
    `@smarty3/app-dev-screens-enabled:${process.env.EXPO_PUBLIC_DEV_SCREENS_ENABLED ?? ''}`,
    `mock-api:${process.env.EXPO_PUBLIC_MOCK_API ?? ''}`,
    `mock-api-scenario:${process.env.EXPO_PUBLIC_MOCK_API_SCENARIO ?? ''}`,
  ].join(','),
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],
  },
};

const nxConfig = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  // Change this to true to see debugging info.
  // Useful if you have issues resolving modules
  debug: false,
  // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
  extensions: [],
  // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
  watchFolders: [],
});

module.exports = withNativeWind(nxConfig, {
  input: './src/global.css',
  configPath: './tailwind.config.js',
  disableHotReload: false,
  browserslistEnv: 'native',
});
