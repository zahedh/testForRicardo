const nativeDev = (globalThis as {__DEV__?: boolean}).__DEV__;
const nodeEnvDev =
  typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

export const isDevelopment = nativeDev ?? nodeEnvDev;
