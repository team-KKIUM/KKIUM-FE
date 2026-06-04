import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  serverExternalPackages: ['@lottiefiles/dotlottie-react', '@lottiefiles/dotlottie-web'],
};

export default nextConfig;
