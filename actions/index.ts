import axios from '@/lib/axios';
import { getDeviceId } from '@/utils';

interface TeacherSignupProps {
  email: string;
  password: string;
  role: string;
}

interface VerifyOtpProps {
  email: string;
  otpType: string;
  otp: string;
}

interface ResendOtpProps {
  email: string;
  otpType: string;
}

interface ParentResetPasswordProps {
  resetToken: string;
  newPassword: string;
}

export const teacherSignup = async (payload: TeacherSignupProps) => {
  const res = await axios.post('/auth/signup/guardian', payload);
  return res;
};

export const verifyOtp = async (payload: VerifyOtpProps) => {
  const res = await axios.post('/auth/verify-otp', payload);
  return res.data;
};

export const resendOTP = async (payload: ResendOtpProps) => {
  const res = await axios.post('/auth/send-otp', payload);
  return res.data;
};

export const parentForgotPassword = async (email: string) => {
  const res = await axios.post('/auth/forgot-password', { email });
  return res.data;
};
export const kidForgotPassword = async (username: string) => {
  const res = await axios.post('/auth/forgot-password/kid', { username });
  return res.data;
};

export const parentResetPassword = async (
  payload: ParentResetPasswordProps,
) => {
  const res = await axios.post('/auth/reset-password', payload);
  return res;
};

export const attachTokenOnLogin = async () => {
  const deviceId = await getDeviceId();
  if (!deviceId) return;
  await axios.put('/push-tokens/attach-user', { deviceId });
};

export const savePushToken = async (payload: {
  token: string;
  deviceType?: string;
  deviceId: string;
}) => {
  await axios.post('/push-tokens', payload);
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  const res = await axios.post('/auth/update-password', {
    currentPassword,
    newPassword,
  });
  return res.data;
};

export const scheduleAccountDeletion = async (password: string) => {
  const res = await axios.delete('/guardian/me', { data: { password } });
  return res.data;
};

export const updateDeletionReason = async (reason: string) => {
  const res = await axios.patch('/guardian/me/deletion-reason', { reason });
  return res.data;
};

export const restoreAccount = async () => {
  const res = await axios.post('/guardian/restore-account');
  return res.data;
};

export const deleteChildAccount = async (
  id: string,
  {
    password,
    reason,
  }: { password: string;  reason?: string },
) => {
  const res = await axios.delete(`/guardian/kid/${id}`, { data: { password, reason } });
  return res.data;
};
