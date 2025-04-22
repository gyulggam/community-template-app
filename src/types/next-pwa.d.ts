declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  export interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    [key: string]: any;
  }
  
  function withPWA(config?: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  
  export default withPWA;
} 