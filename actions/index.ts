import axios from "@/lib/axios";

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
  const res = await axios.post("/auth/signup/guardian", payload);
  return res;
};

export const verifyOtp = async (payload: VerifyOtpProps) => {
  const res = await axios.post("/auth/verify-otp", payload);
  return res.data;
};

export const resendOTP = async (payload: ResendOtpProps) => {
  const res = await axios.post("/auth/send-otp", payload);
  return res.data;
};

export const parentForgotPassword = async (email: string) => {
  const res = await axios.post("/auth/forgot-password", { email });
  return res.data;
};
export const kidForgotPassword = async (username: string) => {
  const res = await axios.post("/auth/forgot-password/kid", { username });
  return res.data;
};

export const parentResetPassword = async (
  payload: ParentResetPasswordProps
) => {
  const res = await axios.post("/auth/reset-password", payload);
  return res;
};


