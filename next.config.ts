import type { NextConfig } from "next";
require('dotenv').config();

module.exports = {
  reactStrictMode: true,
  env: {
    PERSONAL_ACCESS_TOKEN: process.env.PERSONAL_ACCESS_TOKEN,
    NEXT_PUBLIC_BASE_ID: process.env.NEXT_PUBLIC_BASE_ID,
    NEXT_PUBLIC_TABLE_NAME: process.env.NEXT_PUBLIC_TABLE_NAME,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v5.airtableusercontent.com',
        pathname: '**',
      },
    ]
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
