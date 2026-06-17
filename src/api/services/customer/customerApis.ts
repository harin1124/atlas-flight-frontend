import { customerApiClient } from '@/api/core/clients';
import { unwrapApiResponse, type ApiResponse } from '@/api/core/apiResponse';
import type { CustomerDetail } from '@/api/services/customer/types';

/** 고객 상세 조회 (GET /customers/{customerId}). */
export const getCustomer = async (customerId: string) => {
  const { data } = await customerApiClient.get<ApiResponse<CustomerDetail>>(
    `/customers/${encodeURIComponent(customerId)}`,
  );
  return unwrapApiResponse(data);
};
