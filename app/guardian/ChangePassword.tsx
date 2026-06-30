import { changePassword } from '@/actions';
import Button from '@/components/Button';
import Container from '@/components/Container';
import Input from '@/components/Input';
import TopBackButton from '@/components/TopBackButton';
import { showToast } from '@/utils/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import * as z from 'zod';
import { PasswordRule } from '../auth/SignUp';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Required'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords mismatch',
    path: ['confirmPassword'],
  });

type ChangePasswordForm = z.infer<typeof schema>;

const ChangePassword = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ currentPassword, newPassword }: ChangePasswordForm) =>
      changePassword(currentPassword, newPassword),
    onSuccess: () => {
      showToast('success', 'Password updated successfully');
      router.back();
    },
    onError: (err: any) => {
      showToast(
        'error',
        err?.response?.data?.message ?? 'Something went wrong',
      );
    },
  });

  const passwordChecks = useMemo(() => {
    if (!watch('newPassword')) {
      return {
        minLength: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
        number: false,
      };
    }
    return {
      minLength: watch('newPassword')?.length >= 8,
      uppercase: /[A-Z]/.test(watch('newPassword')),
      lowercase: /[a-z]/.test(watch('newPassword')),
      specialChar: /[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'/`~]/.test(
        watch('newPassword'),
      ),
      number: /[0-9]/.test(watch('newPassword')),
    };
  }, [watch('newPassword')]);

  return (
    <Container>
      <View className="px-6 py-5">
        <TopBackButton />
        <Text className="font-sansSemiBold text-dark text-[20px] mt-4">
          Password
        </Text>
        <Text className="mt-2 text-[16px] text-[#6C686C] font-sans leading-[1.5]">
          Update your password to keep your account secure.
        </Text>
      </View>
      <View className="bg-white  p-8 mt-6 flex-1">
        <Input
          control={control}
          type="password"
          label="Current Password"
          name="currentPassword"
          error={errors.currentPassword?.message}
        />
        <View className="mb-6" />
        <Input
          control={control}
          type="password"
          label="New Password"
          name="newPassword"
          // error={errors.newPassword?.message}
        />
        <View className='mt-6'>
          <Text className="font-sansMedium text-[#221D23] mb-4">
            Password must include:
          </Text>
          <PasswordRule
            label="At least 8 characters"
            passed={passwordChecks.minLength}
          />
          <PasswordRule label="Uppercase" passed={passwordChecks.uppercase} />
          <PasswordRule label="Lowercase" passed={passwordChecks.lowercase} />
          <PasswordRule
            label="Special character"
            passed={passwordChecks.specialChar}
          />
          <PasswordRule label="Number" passed={passwordChecks.number} />
        </View>
        <View className="mb-6" />

        <Input
          control={control}
          type="password"
          label="Confirm New Password"
          name="confirmPassword"
          error={errors.confirmPassword?.message}
        />
        <View className="mb-10" />

        <Button
          text="UPDATE PASSWORD"
          onPress={handleSubmit((data) => mutate(data))}
          disabled={isPending}
          loading={isPending}
        />
      </View>
    </Container>
  );
};

export default ChangePassword;
