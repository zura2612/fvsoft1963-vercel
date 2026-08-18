import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
        serverActions: { allowedOrigins: ['www.fvsoft1963.com', 'fvsoft1963.com'], },
        images: { qualities: [75, 85], },
};

export default nextConfig;
