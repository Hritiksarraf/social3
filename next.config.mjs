/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/', // Redirect all routes
          destination: '/coming-soon', // Redirect to the coming soon page
          permanent: false, // Temporary redirect
        },
      ]
    },
  };
  
  export default nextConfig;
  