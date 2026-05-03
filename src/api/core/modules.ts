export const API_MODULE_PATHS = {
  auth: '/auth/api',
  customer: '/customer/api',
  member: '/member',
  booking: '/booking',
  flight: '/flight',
} as const;

export type ApiModuleKey = keyof typeof API_MODULE_PATHS;
