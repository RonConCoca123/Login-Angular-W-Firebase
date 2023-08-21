import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kiraCuli.dev',
  appName: 'login-firebase',
  webDir: 'dist/login-firebase',
  server: {
    androidScheme: 'https'
  }
};

export default config;
