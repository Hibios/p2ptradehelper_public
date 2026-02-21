/** @type {import('next').NextConfig} */

const nextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  env: {
    baseURL: process.env.LOCAL_START === 'true' ? 'http://localhost:8000' : '/api/v1/articles',
    templateURL: process.env.LOCAL_START === 'true' ? 'http://gigachatdictionarysrv-1-tcp1-ift.apps.ift-gen1-ds.delta.sbrf.ru/proxy/admin/template/get' : '/admin/template/get',
  },
};

module.exports = {
  ...nextConfig,
  staticPageGenerationTimeout: 300,
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  logging: {
    level: 'info',
  },
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'http://gigachatdictionarysrv-1-tcp1-ift.apps.ift-gen1-ds.delta.sbrf.ru/:path*'
      },
      {
        source: '/proxy-history/:path*',
        destination: 'http://gigachat-history-service-1-tcp1-ift.apps.ift-gen1-ds.delta.sbrf.ru/:path*'
      }
    ]
  }
}
