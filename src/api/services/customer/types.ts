/** 고객 상세 — 백엔드 Customer 엔티티(GET /customers/{customerId})의 응답 형태. */
export interface CustomerDetail {
  customerId: string;
  customerNumber: string;
  korFirstName: string;
  korLastName: string;
  engFirstName: string;
  engLastName: string;
  /** 생년월일 (yyyy-MM-dd) */
  birthday: string;
  /** 성별 코드 (예: MALE | FEMALE) */
  genderCd: string;
  /** 휴대폰 국가 코드 (예: 82) */
  phoneCountryCd: string;
  /** 휴대폰 번호 — 백엔드에서 복호화되어 평문으로 내려온다. */
  phoneNumber: string;
  /** 이메일 — 복호화된 평문. */
  email: string;
  /** 선호 언어 코드 */
  preferredLangCd: string | null;
  /** 가입 일시 (ISO-8601, 예: 2022-08-07T09:30:00) */
  regDt: string;
}
