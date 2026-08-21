// fvsoft1963/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	experimental: {
          serverActions: { allowedOrigins: ['www.fvsoft1963.com', 'fvsoft1963.com'] },
        },
        /*serverActions: { allowedOrigins: ['www.fvsoft1963.com', 'fvsoft1963.com'] },*/
        images: { 
          qualities: [75, 85],
          deviceSizes: [640, 750, 828, 1080, 1200], //largeurs pour desktop
          imageSizes: [128, 256, 384], //largeurs pour mobile
        },
};

export default nextConfig;
