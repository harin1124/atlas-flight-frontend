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
  Tab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Apple from '@mui/icons-material/Apple';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import { getApiErrorMessage } from '@/api/core/client';
import { login } from '@/api/services/auth/authApis';
import type { LoginType } from '@/api/services/auth/types';
import { atlasColors } from '@/theme/colors';

const socialPlaceholders = [
  { label: 'Naver', bg: atlasColors.social.naver, fg: '#fff', char: 'N' },
  { label: 'Kakao', bg: atlasColors.social.kakao, fg: '#000', char: 'T' },
  { label: 'Google', bg: atlasColors.background.elevated, fg: atlasColors.social.google, char: 'G' },
  { label: 'Facebook', bg: atlasColors.social.facebook, fg: '#fff', char: 'f' },
  { label: 'Apple', bg: atlasColors.social.apple, fg: '#fff', char: '' },
] as const;

const LoginPage = () => {
  const theme = useTheme();
  const isNarrow = useMediaQuery(theme.breakpoints.down('md'));

  const [loginTab, setLoginTab] = useState(0);
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
      const loginType: LoginType = loginTab === 0 ? 'ID' : 'SKYPASS';
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
    '& .MuiFilledInput-root': {
      backgroundColor: atlasColors.background.brandSubtle,
      borderRadius: 0,
      '&:hover': { backgroundColor: atlasColors.background.brandSubtle },
      '&.Mui-focused': { backgroundColor: atlasColors.background.brandSubtle },
    },
    '& .MuiFilledInput-underline:before': {
      borderBottomColor: atlasColors.border.brand,
    },
    '& .MuiFilledInput-underline:after': {
      borderBottomColor: atlasColors.border.focus,
    },
  } as const;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        boxSizing: 'border-box',
        bgcolor: atlasColors.background.brandSubtle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 3, sm: 4 },
        px: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          maxWidth: 920,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          divider={
            <Divider
              orientation={isNarrow ? 'horizontal' : 'vertical'}
              flexItem
              sx={{ borderColor: 'divider' }}
            />
          }
        >
          <Box
            sx={{
              flex: 1,
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
              minHeight: { md: 420 },
            }}
          >
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 700,
                color: atlasColors.brand.navy,
                lineHeight: 1.35,
              }}
            >
              아직 회원이 아니세요?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 280 }}>
              회원으로 가입하시고 마일리지 혜택을 누려 보세요.
            </Typography>
            <Box sx={{ pt: 1 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: 999,
                  px: 4,
                  py: 1,
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
            </Box>
            <Box sx={{ mt: 'auto', pt: 4 }}>
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
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              flex: 1,
              px: { xs: 3, sm: 4, md: 5 },
              py: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 2,
              minHeight: { md: 420 },
            }}
          >
            <Tabs
              value={loginTab}
              onChange={(_, value) => setLoginTab(value)}
              variant="fullWidth"
              sx={{
                mb: 3,
                minHeight: 44,
                '& .MuiTabs-indicator': {
                  height: 3,
                  bgcolor: atlasColors.brand.navy,
                },
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'text.secondary',
                  '&.Mui-selected': { color: atlasColors.brand.navy },
                },
              }}
            >
              <Tab label="아이디" />
              <Tab label="스카이패스 번호" />
            </Tabs>

            <Stack spacing={2.5}>
              {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
              {successMessage && <Alert severity="success">{successMessage}</Alert>}

              <TextField
                required
                fullWidth
                variant="filled"
                label={loginTab === 0 ? '아이디' : '스카이패스 번호'}
                name={loginTab === 0 ? 'userId' : 'skypass'}
                autoComplete={loginTab === 0 ? 'username' : 'off'}
                value={id}
                onChange={(e) => setId(e.target.value)}
                sx={inputSx}
              />
              <TextField
                required
                fullWidth
                variant="filled"
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
                  mt: 1,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: atlasColors.brand.sky,
                  color: atlasColors.text.strong,
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: atlasColors.action.primaryHover,
                    color: atlasColors.action.primaryText,
                  },
                }}
              >
                {isSubmitting ? <CircularProgress size={22} sx={{ color: atlasColors.brand.navy }} /> : '로그인'}
              </Button>
            </Stack>

            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1.5}
              sx={{ mt: 2 }}
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

            <Divider sx={{ my: 3 }}>
              <Typography variant="caption" color="text.secondary">
                다른 계정으로 로그인
              </Typography>
            </Divider>

            <Stack direction="row" justifyContent="center" spacing={2} flexWrap="wrap" useFlexGap>
              {socialPlaceholders.map((item) => (
                <Stack key={item.label} alignItems="center" spacing={0.75}>
                  <Box
                    role="presentation"
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: item.bg,
                      color: item.fg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: item.label === 'Google' ? '1px solid rgba(0,0,0,0.08)' : 'none',
                      fontWeight: 700,
                      fontSize: item.label === 'Apple' ? 22 : 18,
                    }}
                  >
                    {item.label === 'Apple' ? <Apple sx={{ fontSize: 28 }} /> : item.char}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default LoginPage;
