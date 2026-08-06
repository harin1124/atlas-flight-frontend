import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ApiError } from '@/api/core/apiResponse';
import { RESULT_CODE } from '@/api/core/resultCodes';
import { getApiErrorMessage } from '@/api/core/client';
import { registerPassenger } from '@/api/services/customer/customerApis';
import type { FamilyRelCd } from '@/api/services/customer/types';
import { useToastStore } from '@/stores/toastStore';
import { atlasColors } from '@/theme/colors';

/** 등록 가능한 관계(SELF 제외) 선택지. RELATION_LABEL(MemberInfoPage)과 라벨을 맞춘다. */
const RELATION_OPTIONS: { value: FamilyRelCd; label: string }[] = [
  { value: 'SPOUSE', label: '배우자' },
  { value: 'CHILD', label: '자녀' },
  { value: 'PARENT', label: '부모' },
  { value: 'SIBL', label: '형제·자매' },
  { value: 'ETC', label: '기타' },
];

/** 한글만 허용 — 백엔드 FormatValidation.KOREAN_ONLY_REGEXP 와 동일. */
const KOREAN_ONLY = /^[가-힣]+$/;

/** 생년월일 드롭다운 값. 연/월/일을 따로 받아 제출 시 yyyy-MM-dd로 합친다. */
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1920 + 1 }, (_, i) => CURRENT_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

const pad2 = (n: string) => n.padStart(2, '0');

interface FamilyForm {
  korLastName: string;
  korFirstName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  customerNumber: string;
  relationCd: FamilyRelCd | '';
}

const DEFAULT_VALUES: FamilyForm = {
  korLastName: '',
  korFirstName: '',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  customerNumber: '',
  relationCd: '',
};

interface AddFamilyModalProps {
  open: boolean;
  onClose: () => void;
  /** 등록 성공 시 호출 — 상위에서 가족 목록을 갱신한다. */
  onRegistered: () => void;
}

/**
 * 백엔드가 본인확인 실패·중복·미존재를 모두 ATF400/ATF404 로만 내려주므로,
 * 사용자가 이해할 수 있는 안내 문구로 바꿔준다. 그 외 코드/네트워크 오류는 공통 헬퍼에 위임.
 */
const toFriendlyMessage = (error: unknown) => {
  if (error instanceof ApiError) {
    if (error.resultCode === RESULT_CODE.NOT_FOUND) {
      return '해당 회원번호의 회원을 찾을 수 없습니다. 회원번호를 확인해 주세요.';
    }
    if (error.resultCode === RESULT_CODE.BAD_REQUEST) {
      return '입력하신 정보와 일치하는 회원이 없거나, 이미 등록된 가족입니다. 회원번호·이름·생년월일을 다시 확인해 주세요.';
    }
  }
  return getApiErrorMessage(error, '가족 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
};

/** 필드 위 라벨(굵은 네이비). info=true면 라벨 옆에 안내 아이콘을 붙인다. */
const FieldLabel = ({ children, info }: { children: ReactNode; info?: string }) => (
  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 1 }}>
    <Typography
      component="span"
      sx={{ fontWeight: 700, fontSize: '0.95rem', color: atlasColors.brand.navy }}
    >
      {children}
    </Typography>
    {info && (
      <Tooltip title={info} arrow>
        <InfoOutlinedIcon sx={{ fontSize: 17, color: atlasColors.text.subtle, cursor: 'help' }} />
      </Tooltip>
    )}
  </Stack>
);

/**
 * 가족(탑승자) 추가 모달.
 *
 * <p>
 * 회원정보 페이지의 "가족 추가" 버튼으로 연다. 대상 회원의 성·이름·생년월일·스카이패스 회원번호·
 * 가족관계를 입력받아 POST /passengers 로 등록한다. 소유자는 서버가 JWT(X-User-Id)로 식별하므로
 * 보내지 않는다. 회원번호 + 한글 성·이름 + 생년월일이 모두 일치할 때만 본인확인을 통과한다.
 * </p>
 */
const AddFamilyModal = ({ open, onClose, onRegistered }: AddFamilyModalProps) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FamilyForm>({ defaultValues: DEFAULT_VALUES, mode: 'onBlur' });

  const [submitting, setSubmitting] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  // 열릴 때마다 이전 입력을 초기화한다.
  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES);
    }
  }, [open, reset]);

  const closeIfIdle = () => {
    if (!submitting) onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      await registerPassenger({
        customerNumber: values.customerNumber.trim(),
        korLastName: values.korLastName.trim(),
        korFirstName: values.korFirstName.trim(),
        birthday: `${values.birthYear}-${pad2(values.birthMonth)}-${pad2(values.birthDay)}`,
        // 폼 검증(required)을 통과하면 빈 값이 아니므로 관계 코드로 단언.
        relationCd: values.relationCd as FamilyRelCd,
      });
      onRegistered();
    } catch (error) {
      // 등록 실패는 토스트로 알리고, 모달은 열어둬 사용자가 값을 고칠 수 있게 한다.
      showToast(toFriendlyMessage(error), 'error');
    } finally {
      setSubmitting(false);
    }
  });

  // 박스형(outlined) 입력 공통 스타일 — 둥근 모서리, 포커스 시 네이비 테두리.
  const fieldSx = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        backgroundColor: atlasColors.background.elevated,
        '& fieldset': { borderColor: atlasColors.border.default },
        '&:hover fieldset': { borderColor: atlasColors.text.muted },
        '&.Mui-focused fieldset': { borderColor: atlasColors.brand.navy, borderWidth: 2 },
      },
      // 오류 메시지의 기본 좌측 여백(14px) 제거 — 입력창 좌측선과 맞춘다.
      '& .MuiFormHelperText-root': { marginLeft: 0, marginRight: 0 },
    }),
    [],
  );

  // 빈 값일 때 placeholder를 흐린 색으로 보여주는 Select renderValue 생성기.
  const selectPlaceholder =
    (placeholder: string, label?: (value: string) => string) => (value: unknown) => {
      const v = value as string;
      if (!v) {
        return <Box component="span" sx={{ color: atlasColors.text.subtle }}>{placeholder}</Box>;
      }
      return label ? label(v) : v;
    };

  const birthdayError = errors.birthYear || errors.birthMonth || errors.birthDay;

  return (
    <Dialog
      open={open}
      onClose={closeIfIdle}
      fullWidth
      maxWidth="md"
      slotProps={{ paper: { sx: { borderRadius: 3, p: { xs: 1, sm: 2 } } } }}
    >
      <IconButton
        aria-label="닫기"
        onClick={closeIfIdle}
        disabled={submitting}
        sx={{ position: 'absolute', top: 12, right: 12, color: atlasColors.text.muted }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ px: { xs: 2, sm: 4 }, py: 3 }}>
        <Typography
          component="h2"
          sx={{ fontSize: '1.75rem', fontWeight: 800, color: atlasColors.brand.navy, mb: 4 }}
        >
          가족 회원 정보 입력
        </Typography>

        <Box component="form" onSubmit={onSubmit} noValidate>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              columnGap: 4,
              rowGap: 3,
            }}
          >
            {/* 성 */}
            <div>
              <FieldLabel>성</FieldLabel>
              <TextField
                fullWidth
                placeholder="홍"
                error={Boolean(errors.korLastName)}
                helperText={errors.korLastName?.message}
                sx={fieldSx}
                {...register('korLastName', {
                  required: '성을 입력해 주세요.',
                  maxLength: { value: 30, message: '최대 30자입니다.' },
                  pattern: { value: KOREAN_ONLY, message: '한글만 입력 가능합니다.' },
                })}
              />
            </div>

            {/* 이름 */}
            <div>
              <FieldLabel>이름</FieldLabel>
              <TextField
                fullWidth
                placeholder="길동"
                error={Boolean(errors.korFirstName)}
                helperText={errors.korFirstName?.message}
                sx={fieldSx}
                {...register('korFirstName', {
                  required: '이름을 입력해 주세요.',
                  maxLength: { value: 30, message: '최대 30자입니다.' },
                  pattern: { value: KOREAN_ONLY, message: '한글만 입력 가능합니다.' },
                })}
              />
            </div>

            {/* 생년월일 (연/월/일 드롭다운) */}
            <div>
              <FieldLabel>생년월일</FieldLabel>
              <Stack direction="row" spacing={1.5}>
                <Controller
                  name="birthYear"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      error={Boolean(errors.birthYear)}
                      sx={fieldSx}
                      slotProps={{
                        select: { displayEmpty: true, renderValue: selectPlaceholder('연도') },
                      }}
                    >
                      {YEARS.map((y) => (
                        <MenuItem key={y} value={String(y)}>
                          {y}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="birthMonth"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      error={Boolean(errors.birthMonth)}
                      sx={fieldSx}
                      slotProps={{
                        select: { displayEmpty: true, renderValue: selectPlaceholder('월') },
                      }}
                    >
                      {MONTHS.map((m) => (
                        <MenuItem key={m} value={String(m)}>
                          {m}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="birthDay"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      error={Boolean(errors.birthDay)}
                      sx={fieldSx}
                      slotProps={{
                        select: { displayEmpty: true, renderValue: selectPlaceholder('일') },
                      }}
                    >
                      {DAYS.map((d) => (
                        <MenuItem key={d} value={String(d)}>
                          {d}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>
              {birthdayError && (
                <Typography sx={{ mt: 0.75, fontSize: '0.75rem', color: atlasColors.semantic.error }}>
                  생년월일을 모두 선택해 주세요.
                </Typography>
              )}
            </div>

            {/* 스카이패스 회원번호 (= customerNumber) */}
            <div>
              <FieldLabel info="함께 여행할 가족도 회원(스카이패스)이어야 등록할 수 있어요.">
                스카이패스 회원번호
              </FieldLabel>
              <TextField
                fullWidth
                placeholder="회원번호 입력"
                error={Boolean(errors.customerNumber)}
                helperText={errors.customerNumber?.message}
                sx={fieldSx}
                {...register('customerNumber', {
                  required: '회원번호를 입력해 주세요.',
                  maxLength: { value: 12, message: '회원번호는 최대 12자입니다.' },
                })}
              />
            </div>

            {/* 가족관계 */}
            <div>
              <FieldLabel>가족관계</FieldLabel>
              <Controller
                name="relationCd"
                control={control}
                rules={{ required: '가족관계를 선택해 주세요.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    error={Boolean(errors.relationCd)}
                    helperText={errors.relationCd?.message}
                    sx={fieldSx}
                    slotProps={{
                      select: {
                        displayEmpty: true,
                        renderValue: selectPlaceholder(
                          '선택',
                          (v) => RELATION_OPTIONS.find((o) => o.value === v)?.label ?? v,
                        ),
                      },
                    }}
                  >
                    {RELATION_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          </Box>

          {/* 우하단 알약 버튼 */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
            <Button
              type="submit"
              variant="outlined"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} sx={{ color: atlasColors.brand.navy }} />
                ) : (
                  <AddIcon />
                )
              }
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1,
                textTransform: 'none',
                fontWeight: 700,
                color: atlasColors.brand.navy,
                borderColor: atlasColors.border.default,
                bgcolor: atlasColors.background.subtle,
                '&:hover': {
                  borderColor: atlasColors.brand.navy,
                  bgcolor: atlasColors.action.secondary,
                },
              }}
            >
              가족 추가
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddFamilyModal;
