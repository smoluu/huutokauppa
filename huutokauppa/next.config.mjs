/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {

        REST_API_URL: 'http://localhost:5000'
    },
    module: {
    rules: [
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
};

export default nextConfig;
