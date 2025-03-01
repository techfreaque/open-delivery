import 'dotenv/config';

export default {
  expo: {
    name: "Open Delivery",
    slug: "open-delivery",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router"
    ],
    extra: {
      BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000",
      eas: {
        projectId: "your-project-id"
      }
    }
  }
};
