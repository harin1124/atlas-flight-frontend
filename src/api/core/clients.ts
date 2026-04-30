import { createApiClient, rootApiClient } from '@/api/core/client';
import { API_MODULE_PATHS } from '@/api/core/modules';

const buildApiUrl = (path: string) => {
  const baseURL = rootApiClient.defaults.baseURL ?? '';
  return `${baseURL}${path.startsWith('/') ? path : `/${path}`}`;
};

export { rootApiClient };

export const authApiClient = createApiClient(buildApiUrl(API_MODULE_PATHS.auth));
export const memberApiClient = createApiClient(buildApiUrl(API_MODULE_PATHS.member));
export const bookingApiClient = createApiClient(buildApiUrl(API_MODULE_PATHS.booking));
export const flightApiClient = createApiClient(buildApiUrl(API_MODULE_PATHS.flight));
