import { envClient } from "./lib/env-client";

export const APP_NAME = "OpenEats";
export const APP_DOMAIN = envClient.NEXT_PUBLIC_FRONTEND_APP_URL;

export const ENDPOINT_DOMAINS = {
  prod: envClient.NEXT_PUBLIC_BACKEND_PROD,
  dev: envClient.NEXT_PUBLIC_BACKEND_DEV,
  test: envClient.NEXT_PUBLIC_BACKEND_TEST,
};

export const backendPages = {
  home: "/",
  login: "/v1/auth/login",
  register: "/v1/auth/signup",
  notFound: "/404",
  apiDocs: "/v1/api-docs",
};

export const frontendRoutes = {
  home: `${APP_DOMAIN}/`,
  login: `${APP_DOMAIN}/login`,
  help: `${APP_DOMAIN}/help`,
  register: `${APP_DOMAIN}/register`,
  forgotPassword: `${APP_DOMAIN}/forgot-password`,
  resetPassword: `${APP_DOMAIN}/reset-password`,
  account: `${APP_DOMAIN}/account`,
  notFound: `${APP_DOMAIN}/404`,
} as const;
