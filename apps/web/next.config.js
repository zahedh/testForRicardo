/* eslint-disable no-console */
//@ts-check

const {composePlugins, withNx} = require('@nx/next');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const nxEnv = process.env.NX_TASK_TARGET_CONFIGURATION || 'development';

const envFile = path.resolve(__dirname, `.env.config.${nxEnv}`);

if (fs.existsSync(envFile)) {
  console.log(`🔧 Loading env: ${envFile}`);
  dotenv.config({path: envFile});
} else {
  console.warn(`⚠️ Env file not found: ${envFile}`);
}

process.env.NEXT_PUBLIC_BUILD_TIMESTAMP ??= new Date().toISOString();

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 */
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  reactStrictMode: true,
  // expo-image (like other React Native code) reads the `__DEV__` global, which only Metro defines.
  compiler: {
    define: {__DEV__: String(process.env.NODE_ENV === 'development')},
  },
  // Inline the flag in server code as well as client code, so that src/app/devTools.ts
  // drops dev-tools from both. NEXT_PUBLIC_ values are otherwise inlined only on the client.
  env: {
    NEXT_PUBLIC_DEV_SCREENS_ENABLED:
      process.env.NEXT_PUBLIC_DEV_SCREENS_ENABLED ?? '',
  },
  output: 'export',
  distDir: '.next',
  trailingSlash: process.env.NODE_ENV !== 'development',
  turbopack: {
    resolveAlias: {
      // Alias direct react-native imports to react-native-web
      'react-native': 'react-native-web',
      // Alias internal react-native modules to react-native-web
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$':
        'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    },
    resolveExtensions: [
      '.web.ts',
      '.web.tsx',
      '.web.js',
      '.web.jsx',
      // Then the default extensions:
      '.js',
      '.mjs',
      '.tsx',
      '.ts',
      '.jsx',
      '.json',
      '.wasm',
    ],

    root: path.join(__dirname, '../..'),
  },
  transpilePackages: [
    '@adrianso/react-native-barcode-builder',
    'expo',
    'expo-image',
    'expo-modules-core',
    'jsbarcode',
    'lucide-react-native',
    'nativewind',
    'react-native-css-interop',
    'react-native',
    'react-native-reanimated',
    'react-native-safe-area-context',
    'react-native-svg',
    'zeego',
  ],

  // This will only work in dev!
  // Origin header so the DX API accepts PUT, POST and DELETE from localhost.
  async rewrites() {
    const dxOrigin = 'http://localhost:4310';
    return [
      {
        source: '/dx/:path*',
        destination: `${dxOrigin}/dx/:path*`,
      },
    ];
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
