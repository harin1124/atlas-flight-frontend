import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { getApiErrorMessage } from '@/api/core/client';
import { login } from '@/api/services/auth/authApis';
import type { LoginType } from '@/api/services/auth/types';
import { atlasColors } from '@/theme/colors';

const LoginPage = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('savedLoginId');
    if (!savedId) {
      return;
    }

    setId(savedId);
    setRememberId(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      const loginType: LoginType = 'ID';
      await login({
        loginType,
        identifier: id.trim(),
        password,
        rememberId,
      });

      if (rememberId) {
        localStorage.setItem('savedLoginId', id.trim());
      } else {
        localStorage.removeItem('savedLoginId');
      }

      setSuccessMessage('로그인 요청이 완료되었습니다.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, '로그인에 실패했습니다. 입력 정보를 확인해 주세요.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputSx = {
    '& .MuiInputLabel-root.Mui-focused': {
      color: atlasColors.brand.navy,
    },
    '& .MuiInput-root:before': {
      borderBottomColor: atlasColors.border.default,
    },
    '& .MuiInput-root:hover:not(.Mui-disabled, .Mui-error):before': {
      borderBottomColor: atlasColors.text.muted,
    },
    '& .MuiInput-root:after': {
      borderBottomColor: atlasColors.brand.navy,
    },
  } as const;

  return (
    <Box
      component="main"
      sx={{
        boxSizing: 'border-box',
        bgcolor: atlasColors.background.subtle,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 121px)',
        px: 2,
        py: { xs: 5, md: 8 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 440,
          border: `1px solid ${atlasColors.border.default}`,
          borderRadius: 2,
          // 헤더와 동일 계열의 부드러운 네이비 톤 그림자 (headerMainLayout.scss 참고)
          boxShadow: '0 8px 24px rgb(7 24 39 / 8%)',
          bgcolor: atlasColors.background.elevated,
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          align="center"
          sx={{
            fontWeight: 700,
            color: atlasColors.brand.navy,
            mb: 4,
          }}
        >
          로그인
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}

            <TextField
              required
              fullWidth
              variant="standard"
              label="아이디"
              name="userId"
              autoComplete="username"
              value={id}
              onChange={(e) => setId(e.target.value)}
              sx={inputSx}
            />
            <TextField
              required
              fullWidth
              variant="standard"
              type="password"
              label="비밀번호"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputSx}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberId}
                  onChange={(e) => setRememberId(e.target.checked)}
                  sx={{
                    color: atlasColors.brand.navy,
                    '&.Mui-checked': { color: atlasColors.brand.navy },
                  }}
                />
              }
              label="아이디 저장"
            />

            <Button
              type="submit"
              fullWidth
              size="large"
              variant="contained"
              disableElevation
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                bgcolor: atlasColors.brand.navy,
                color: atlasColors.text.inverse,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: atlasColors.brand.navy,
                  filter: 'brightness(0.92)',
                  boxShadow: 'none',
                },
              }}
            >
              {isSubmitting ? <CircularProgress size={22} sx={{ color: atlasColors.text.inverse }} /> : '로그인'}
            </Button>
          </Stack>
        </Box>

        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1.5}
          sx={{ mt: 2.5 }}
        >
          <Link href="#" underline="hover" color="inherit" sx={{ fontSize: '0.875rem' }} onClick={(e) => e.preventDefault()}>
            아이디 찾기
          </Link>
          <Typography component="span" color="text.disabled">
            |
          </Typography>
          <Link href="#" underline="hover" color="inherit" sx={{ fontSize: '0.875rem' }} onClick={(e) => e.preventDefault()}>
            비밀번호 찾기
          </Link>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            아직 회원이 아니세요?
          </Typography>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 999,
              px: 2.5,
              borderColor: atlasColors.brand.navy,
              color: atlasColors.brand.navy,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                borderColor: atlasColors.brand.navy,
                bgcolor: atlasColors.action.secondary,
              },
            }}
          >
            회원가입
          </Button>
        </Stack>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link
            href="#"
            underline="hover"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              color: 'text.secondary',
              fontSize: '0.8125rem',
            }}
            onClick={(e) => e.preventDefault()}
          >
            <VpnKeyOutlinedIcon sx={{ fontSize: 18 }} />
            로그인에 어려움이 있나요?
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
