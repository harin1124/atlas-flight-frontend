import { customerApiClient } from '@/api/core/clients';
import { unwrapApiResponse, type ApiResponse } from '@/api/core/apiResponse';
import type { CustomerDetail, Passenger } from '@/api/services/customer/types';

/** 고객 상세 조회 (GET /customers/{customerId}). */
export const getCustomer = async (customerId: string) => {
  const { data } = await customerApiClient.get<ApiResponse<CustomerDetail>>(
    `/customers/${encodeURIComponent(customerId)}`,
  );
  return unwrapApiResponse(data);
};

/** 탑승자(가족) 목록 조회 (GET /passengers). 현재 로그인 사용자 기준이며, 본인(SELF) 행도 포함해 내려온다. */
export const getPassengers = async () => {
  const { data } = await customerApiClient.get<ApiResponse<Passenger[]>>('/passengers');
  return unwrapApiResponse(data);
};
