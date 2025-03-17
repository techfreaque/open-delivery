let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Set webpack stats to verbose
      config.stats = 'verbose';
    }
    // Add a fallback for the Handlebars module
    config.resolve.alias['handlebars'] = 'handlebars/dist/handlebars.min.js';
    if (!isServer) {
      config.resolve.alias['react-native$'] = 'react-native-web';
      // config.resolve.alias['./button'] = './button.web';
    }
    return config;
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      
    },
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
